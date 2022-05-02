use http::{Request, Response};
use hyper::Body;

pub use actions::SlackActions;
pub use event::handler as event;
pub use interaction::handler as interaction;

use crate::BoxedError;

mod actions;
mod event;
mod interaction;

pub async fn default(_: Request<Body>) -> Result<Response<Body>, BoxedError> {
    Response::builder()
        .body("Tsukedaicho for Slack v1.0".into())
        .map_err(|e| e.into())
}
