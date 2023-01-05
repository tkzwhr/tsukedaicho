use std::sync::Arc;

use log::*;
use slack_morphism::prelude::*;

pub use actions::SlackActions;
pub use event::handler as event;
pub use interaction::handler as interaction;

use crate::BoxedError;

mod actions;
mod event;
mod interaction;

pub fn error_handler(
    err: BoxedError,
    _client: Arc<SlackHyperClient>,
    _states: SlackClientEventsUserState,
) -> http::StatusCode {
    error!("{:#?}", err);
    http::StatusCode::BAD_REQUEST
}
