use std::sync::Arc;

use axum::Extension;
use axum::response::Response;
use http::header::CONTENT_TYPE;
use http::StatusCode;
use hyper::Body;
use log::*;
use slack_morphism::errors::SlackClientError;
use slack_morphism::prelude::*;

use crate::{datastore, secrets};
use crate::datastore::CreateTsukeRequest;
use crate::server::forms::{DeleteForm, RegisterForm};
use crate::server::SlackActions;
use crate::server::views;

pub async fn handler(
    Extension(environment): Extension<Arc<SlackHyperListenerEnvironment>>,
    Extension(event): Extension<SlackInteractionEvent>,
) -> Result<Response<Body>, StatusCode> {
    debug!("interaction requested");

    match &event {
        SlackInteractionEvent::ViewSubmission(vs) => {
            let event = SlackInteractionViewSubmissionEventWrapper(vs);
            match event.view() {
                SlackView::Modal(smv) => {
                    let callback_id: SlackActions = smv.callback_id.as_ref().map(|x| x.clone().into()).unwrap();
                    match callback_id {
                        SlackActions::Register => {
                            let form = RegisterForm::from(event.state_params());
                            if !form.is_valid() {
                                warn!("form is invalid: {:?}", form);
                                return Err(StatusCode::BAD_REQUEST);
                            }
                        }
                        _ => {}
                    }
                }
                _ => {}
            }
        }
        _ => {}
    }

    tokio::spawn(async move {
        let token = secrets::api_token();
        let session = environment.client.open_session(&token);

        match event {
            SlackInteractionEvent::BlockActions(ba) => {
                let event = SlackInteractionBlockActionsEventWrapper(&ba);
                block_actions(&session, &event).await;
            }
            SlackInteractionEvent::DialogSubmission(_) => {}
            SlackInteractionEvent::MessageAction(_) => {}
            SlackInteractionEvent::Shortcut(_) => {}
            SlackInteractionEvent::ViewSubmission(vs) => {
                let event = SlackInteractionViewSubmissionEventWrapper(&vs);
                view_submission(&session, &event).await;
            }
            SlackInteractionEvent::ViewClosed(_) => {}
        }
    });

    Ok(
        Response::builder()
            .header(CONTENT_TYPE, "text/plain")
            .body(Body::empty())
            .unwrap()
    )
}

async fn block_actions(
    session: &SlackClientSession<'_, SlackClientHyperHttpsConnector>,
    event: &SlackInteractionBlockActionsEventWrapper<'_>,
) {
    match event.action() {
        SlackActions::ChangeUser => {
            let user = event.user().unwrap();
            let selected_user_id = event.selected_user_id().unwrap();
            refresh_home_view(session, user, selected_user_id).await;
        }
        SlackActions::Register => {
            let target_user_id = event.target_user_id().unwrap();
            open_register_modal(session, event.trigger_id(), target_user_id).await;
        }
        SlackActions::Delete => {
            let target_user_id = event.target_user_id().unwrap();
            open_delete_modal(session, event.trigger_id(), target_user_id).await;
        }
        _ => {}
    }
}

async fn view_submission(
    session: &SlackClientSession<'_, SlackClientHyperHttpsConnector>,
    event: &SlackInteractionViewSubmissionEventWrapper<'_>,
) {
    match event.view() {
        SlackView::Home(_) => {}
        SlackView::Modal(smv) => {
            let callback_id: SlackActions = smv.callback_id.as_ref().map(|x| x.clone().into()).unwrap();
            match callback_id {
                SlackActions::Register => {
                    let user = event.user();
                    let selected_user_id = event.selected_user_id().unwrap();
                    let form = RegisterForm::from(event.state_params());
                    create_tsuke(session, user, selected_user_id, &form).await;
                }
                SlackActions::Delete => {
                    let user = event.user();
                    let selected_user_id = event.selected_user_id().unwrap();
                    let form = DeleteForm::from(event.state_params());
                    delete_tsuke(session, user, selected_user_id, &form).await;
                }
                _ => {}
            }
        }
    }
}

async fn open_register_modal(
    session: &SlackClientSession<'_, SlackClientHyperHttpsConnector>,
    trigger_id: SlackTriggerId,
    target_user_id: i64,
) {
    let repo = datastore::get_users_repo().unwrap();

    let users = match repo.fetch().await {
        Ok(data) => data,
        Err(err) => {
            error!("[Datastore] Failed to fetch users. Err={:#?}", err);
            return;
        }
    };

    let view = views::register_modal(&users, target_user_id);
    let open_view_req = SlackApiViewsOpenRequest::new(trigger_id, view);
    let open_view_res = session.views_open(&open_view_req).await;
    if let Err(err) = open_view_res.as_ref() {
        error!("[Slack API] Failed to open modal view. Err={:#?}", err);
    }
}

async fn open_delete_modal(
    session: &SlackClientSession<'_, SlackClientHyperHttpsConnector>,
    trigger_id: SlackTriggerId,
    target_user_id: i64,
) {
    let repo = datastore::get_tsukes_repo().unwrap();

    let tsukes = match repo.fetch().await {
        Ok(data) => data,
        Err(err) => {
            error!("[Datastore] Failed to fetch tsukes and users. Err={:#?}", err);
            return;
        }
    };

    let slack_users_req = SlackApiUsersListRequest::new();
    let slack_users_res = session.users_list(&slack_users_req).await;

    let tsukes = match slack_users_res.as_ref() {
        Ok(data) => tsukes.into_slack_data(data.members.as_slice()),
        Err(err) => match err {
            SlackClientError::RateLimitError(_) => {
                warn!("[Slack API] Failed to fetch users. Err={:#?}", err);
                tsukes
            }
            _ => {
                error!("[Slack API] Failed to fetch users. Err={:#?}", err);
                return;
            }
        }
    };

    let view = views::delete_modal(&tsukes, target_user_id);
    let open_view_req = SlackApiViewsOpenRequest::new(trigger_id, view);
    let open_view_res = session.views_open(&open_view_req).await;
    if let Err(err) = open_view_res.as_ref() {
        error!("[Slack API] Failed to open modal view. Err={:#?}", err);
    }
}

async fn refresh_home_view(
    session: &SlackClientSession<'_, SlackClientHyperHttpsConnector>,
    user_slack_id: SlackUserId,
    target_user_id: i64,
) {
    let repo = datastore::get_tsukes_repo().unwrap();

    let tsukes = match repo.fetch().await {
        Ok(data) => data,
        Err(err) => {
            error!("[Datastore] Failed to fetch tsukes and users. Err={:#?}", &err);
            return;
        }
    };

    let slack_users_req = SlackApiUsersListRequest::new();
    let slack_users_res = session.users_list(&slack_users_req).await;

    let tsukes = match slack_users_res.as_ref() {
        Ok(data) => tsukes.into_slack_data(data.members.as_slice()),
        Err(err) => match err {
            SlackClientError::RateLimitError(_) => {
                warn!("[Slack API] Failed to fetch users. Err={:#?}", err);
                tsukes
            }
            _ => {
                error!("[Slack API] Failed to fetch users. Err={:#?}", err);
                return;
            }
        }
    };

    let view = views::home_view_by_id(&tsukes, target_user_id.clone());
    let publish_view_req = SlackApiViewsPublishRequest::new(user_slack_id, view);
    let publish_view_res = session.views_publish(&publish_view_req).await;
    if let Err(err) = publish_view_res.as_ref() {
        error!("[Slack API] Failed to publish home view. Err={:#?}", err);
    }
}

async fn create_tsuke(
    session: &SlackClientSession<'_, SlackClientHyperHttpsConnector>,
    user_slack_id: SlackUserId,
    target_user_id: i64,
    form: &RegisterForm,
) {
    let repo = datastore::get_tsukes_repo().unwrap();

    let tsuke = CreateTsukeRequest {
        date: form.date,
        from_user_id: form.from_id,
        to_user_id: form.to_id,
        amount: form.amount,
        description: form.description.clone(),
    };
    match repo.create(tsuke).await {
        Ok(_) => (),
        Err(err) => {
            error!("[Datastore] Failed to create the tsuke. Err={:#?}", &err);
            return;
        }
    };

    refresh_home_view(session, user_slack_id, target_user_id).await;
}

async fn delete_tsuke(
    session: &SlackClientSession<'_, SlackClientHyperHttpsConnector>,
    user_slack_id: SlackUserId,
    target_user_id: i64,
    form: &DeleteForm,
) {
    let repo = datastore::get_tsukes_repo().unwrap();

    match repo.delete(form.tsuke_id).await {
        Ok(_) => (),
        Err(err) => {
            error!("[Datastore] Failed to delete the tsuke. Err={:#?}", &err);
            return;
        }
    };

    refresh_home_view(session, user_slack_id, target_user_id).await;
}

// ---

struct SlackInteractionBlockActionsEventWrapper<'a>(&'a SlackInteractionBlockActionsEvent);

impl<'a> SlackInteractionBlockActionsEventWrapper<'a> {
    fn action(&self) -> SlackActions {
        self.0
            .actions
            .as_ref()
            .and_then(|x| x.first())
            .map(|x| SlackActions::from(x.action_id.clone()))
            .unwrap_or(SlackActions::Unknown)
    }

    fn trigger_id(&self) -> SlackTriggerId {
        self.0.trigger_id.clone()
    }

    fn user(&self) -> Option<SlackUserId> {
        self.0.user.as_ref().map(|x| x.id.clone())
    }

    fn target_user_id(&self) -> Option<i64> {
        self.0
            .actions
            .as_ref()
            .and_then(|x| x.first())
            .and_then(|x| x.block_id.as_ref())
            .and_then(|x| x.0.parse::<i64>().ok())
    }

    fn selected_user_id(&self) -> Option<i64> {
        self.0
            .actions
            .as_ref()
            .and_then(|x| x.first())
            .and_then(|x| x.selected_option.as_ref())
            .and_then(|x| x.value.parse::<i64>().ok())
    }
}

struct SlackInteractionViewSubmissionEventWrapper<'a>(&'a SlackInteractionViewSubmissionEvent);

impl<'a> SlackInteractionViewSubmissionEventWrapper<'a> {
    fn user(&self) -> SlackUserId {
        self.0.user.id.clone()
    }

    fn view(&self) -> &SlackView {
        &self.0.view.view
    }

    fn state_params(&self) -> SlackStatefulStateParams {
        self.0.view.state_params.clone()
    }

    fn selected_user_id(&self) -> Option<i64> {
        match self.view() {
            SlackView::Home(_) => None,
            SlackView::Modal(m) => m.external_id.as_ref().and_then(|x| x.parse::<i64>().ok())
        }
    }
}
