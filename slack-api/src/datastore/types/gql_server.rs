use graphql_client::{GraphQLQuery, reqwest as gql_reqwest, Response};
use http::{HeaderMap, HeaderValue};
use reqwest::{Client, Error};
use shaku::{HasComponent, Module, Provider};

use crate::datastore::GQLServerConf;

pub struct GQLServer {
    url: String,
    secret: String,
}

impl<M: Module + HasComponent<dyn GQLServerConf>> Provider<M> for GQLServer {
    type Interface = GQLServer;

    fn provide(module: &M) -> Result<Box<GQLServer>, Box<dyn std::error::Error + 'static>> {
        let server_conf = module.resolve_ref();
        Ok(Box::new(GQLServer { url: server_conf.url().clone(), secret: server_conf.secret().clone() }))
    }
}

impl GQLServer {
    pub async fn post<Q: GraphQLQuery>(&self, vars: Q::Variables) -> Result<Response<Q::ResponseData>, Error> {
        let mut headers = HeaderMap::new();
        headers.insert(
            "x-hasura-admin-secret",
            HeaderValue::from_str(self.secret.as_str()).unwrap(),
        );

        let client = Client::builder().default_headers(headers).build().unwrap();

        gql_reqwest::post_graphql::<Q, _>(
            &client,
            self.url.as_str(),
            vars,
        ).await
    }
}
