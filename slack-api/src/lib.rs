use std::sync::Arc;

use log::*;
use slack_morphism::prelude::*;

mod server {
    pub use handler::*;
    pub use types::*;

    mod forms;
    mod handler;
    mod views;

    mod types {
        pub mod slack_users;
    }
}

mod datastore {
    pub use module::{get_tsukes_repo, get_users_repo, init};
    #[cfg(test)]
    pub use module::init_for_test;
    pub use traits::gql_server_conf::*;
    pub use traits::tsukes_repo::*;
    pub use traits::users_repo::*;
    pub use types::gql_server::*;
    pub use types::tsukes::*;
    pub use types::users::*;

    mod infra {
        pub mod tsukes_repo;
        pub mod mock;
        pub mod users_repo;
        pub mod gql_server_conf;
    }

    mod traits {
        pub mod tsukes_repo;
        pub mod users_repo;
        pub mod gql_server_conf;
    }

    mod types {
        pub mod tsukes;
        pub mod users;
        pub mod gql_server;
    }

    mod module;
}

mod types {
    pub use tsukes::*;
    pub use users::*;

    mod tsukes;
    mod users;
}

mod logger;
mod secrets;

pub type BoxedError = Box<dyn std::error::Error + Send + Sync>;

pub async fn serve() -> Result<(), BoxedError> {
    logger::init()?;
    secrets::check_secrets()?;
    datastore::init(
        secrets::hasura_url().as_str(),
        secrets::hasura_secret().as_str(),
    );

    let addr = std::net::SocketAddr::from(([0, 0, 0, 0], 3000));
    info!("Loading server: {}", addr);

    let client = Arc::new(SlackClient::new(SlackClientHyperConnector::new()));
    let listener_environment: Arc<SlackHyperListenerEnvironment> = Arc::new(
        SlackClientEventsListenerEnvironment::new(client.clone())
            .with_error_handler(server::error_handler),
    );
    let listener = SlackEventsAxumListener::new(listener_environment.clone());

    let app = axum::routing::Router::new()
        .route(
            "/push",
            axum::routing::post(server::event).layer(
                listener
                    .events_layer(&secrets::signing_secret())
                    .with_event_extractor(SlackEventsExtractors::push_event()),
            ),
        )
        .route(
            "/interaction",
            axum::routing::post(server::interaction).layer(
                listener
                    .events_layer(&secrets::signing_secret())
                    .with_event_extractor(SlackEventsExtractors::interaction_event()),
            ),
        );

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();

    Ok(())
}
