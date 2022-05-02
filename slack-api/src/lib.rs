use std::sync::Arc;

use hyper::service::{make_service_fn, service_fn};
use log::*;
use slack_morphism::prelude::*;
use slack_morphism_hyper::{
    chain_service_routes_fn, SlackClientEventsHyperListener, SlackClientHyperConnector,
};

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

    let event_config = Arc::new(SlackPushEventsListenerConfig::new(secrets::signing_secret()));
    let interaction_config = Arc::new(SlackInteractionEventsListenerConfig::new(
        secrets::signing_secret(),
    ));

    let connector = SlackClientHyperConnector::new();
    let client = Arc::new(SlackClient::new(connector));
    let environment = Arc::new(SlackClientEventsListenerEnvironment::new(client.clone()));

    let make_svc = make_service_fn(move |_| {
        let listener = SlackClientEventsHyperListener::new(environment.clone());
        let event_routes = listener.push_events_service_fn(event_config.clone(), server::event);
        let interaction_routes =
            listener.interaction_events_service_fn(interaction_config.clone(), server::interaction);

        async move {
            let routes = chain_service_routes_fn(
                event_routes,
                chain_service_routes_fn(interaction_routes, server::default),
            );
            Ok::<_, BoxedError>(service_fn(routes))
        }
    });

    hyper::server::Server::bind(&addr)
        .serve(make_svc)
        .await
        .map_err(|e| {
            error!("Server error: {}", e);
            e.into()
        })
}
