use std::sync::Arc;

use axum::Extension;
use axum::response::Response;
use http::header::CONTENT_TYPE;
use hyper::Body;
use log::*;
use slack_morphism::api::SlackApiViewsPublishRequest;
use slack_morphism::prelude::*;

use crate::{datastore, secrets};
use crate::server::views;

pub async fn handler(
    Extension(environment): Extension<Arc<SlackHyperListenerEnvironment>>,
    Extension(event): Extension<SlackPushEvent>,
) -> Response<Body> {
    debug!("push requested");

    let response_builder = Response::builder()
        .header(CONTENT_TYPE, "text/plain");
    let response = match &event {
        SlackPushEvent::UrlVerification(url_verification) => {
            response_builder.body(Body::from(url_verification.challenge.clone())).unwrap()
        },
        _ => response_builder.body(Body::empty()).unwrap(),
    };

    tokio::spawn(async move {
        let token = secrets::api_token();
        let session = environment.client.open_session(&token);

        match event {
            SlackPushEvent::UrlVerification(_) => {}
            SlackPushEvent::EventCallback(ec) => match ec.event {
                SlackEventCallbackBody::Message(_) => {}
                SlackEventCallbackBody::AppHomeOpened(aho) => {
                    app_home_opened(&session, aho.user.clone()).await;
                }
                SlackEventCallbackBody::AppMention(_) => {}
                SlackEventCallbackBody::AppUninstalled(_) => {}
                SlackEventCallbackBody::LinkShared(_) => {}
                SlackEventCallbackBody::EmojiChanged(_) => {}
            },
            SlackPushEvent::AppRateLimited(_) => {}
        }
    });

    response
}

async fn app_home_opened(
    session: &SlackClientSession<'_, SlackClientHyperHttpsConnector>,
    user_slack_id: SlackUserId,
) {
    let repo = datastore::get_tsukes_repo().unwrap();

    let data_res = repo.fetch().await;
    if let Err(err) = data_res.as_ref() {
        error!("[Datastore] Failed to fetch tsukes and users. Err={:#?}", err);
        return;
    }

    let slack_users_req = SlackApiUsersListRequest::new();
    let slack_users_res = session.users_list(&slack_users_req).await;
    if let Err(err) = slack_users_res.as_ref() {
        error!("[Slack API] Failed to fetch users. Err={:#?}", err);
        return;
    }

    let tsukes = data_res.unwrap().into_slack_data(slack_users_res.unwrap().members.as_slice());

    let view = views::home_view_by_slack_id(&tsukes, user_slack_id.clone());
    let publish_view_req = SlackApiViewsPublishRequest::new(user_slack_id, view);
    let publish_view_res = session.views_publish(&publish_view_req).await;
    if let Err(err) = publish_view_res.as_ref() {
        error!("[Slack API] Failed to publish home view. Err={:#?}", err);
    }
}
