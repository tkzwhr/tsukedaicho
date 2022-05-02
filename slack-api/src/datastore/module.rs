use log::info;
use once_cell::sync::OnceCell;
use shaku::{HasProvider, module, Provider};

use crate::datastore::*;
use crate::datastore::infra::gql_server_conf::{GQLServerConfImpl, GQLServerConfImplParameters};
use crate::datastore::infra::mock::{TsukesRepoMock, UsersRepoMock};
use crate::datastore::infra::tsukes_repo::TsukesRepoImpl;
use crate::datastore::infra::users_repo::UsersRepoImpl;

module! {
    DatastoreModule {
        components = [GQLServerConfImpl],
        providers = [GQLServer, TsukesRepoImpl, UsersRepoImpl]
    }
}

static INSTANCE: OnceCell<DatastoreModule> = OnceCell::new();

pub fn init(url: &str, secret: &str) {
    let module = DatastoreModule::builder()
        .with_component_parameters::<GQLServerConfImpl>(GQLServerConfImplParameters {
            url: url.to_string(),
            secret: secret.to_string(),
        });

    let module = if let Some(_) = std::env::var("MOCK_MODE").ok() {
        info!("Mock mode enabled.");
        module
            .with_provider_override::<dyn TsukesRepo>(Box::new(TsukesRepoMock::provide))
            .with_provider_override::<dyn UsersRepo>(Box::new(UsersRepoMock::provide))
    } else {
        module
    };

    let _ = INSTANCE.set(module.build());
}

#[cfg(test)]
pub fn init_for_test() {
    let url = "http://localhost:20081/v1/graphql";
    let secret = "hasura";

    init(url, secret);
}

pub fn get_tsukes_repo() -> Option<Box<dyn TsukesRepo>> {
    INSTANCE.get().and_then(|x| x.provide().ok())
}

pub fn get_users_repo() -> Option<Box<dyn UsersRepo>> {
    INSTANCE.get().and_then(|x| x.provide().ok())
}
