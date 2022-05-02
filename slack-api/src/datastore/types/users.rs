use graphql_client::GraphQLQuery;

use crate::types::*;

#[derive(GraphQLQuery)]
#[graphql(
schema_path = "../graphql/schema.graphql",
query_path = "../graphql/queries/fetch_users.graphql",
response_derives = "Debug",
normalization = "rust"
)]
pub struct FetchUsers;

impl From<fetch_users::FetchUsersUsers> for User {
    fn from(u: fetch_users::FetchUsersUsers) -> Self {
        User {
            id: u.id,
            name: u.name.clone(),
            slack_id: u.slack_id.as_ref().map(|uu| uu.clone()),
            slack_data: None,
            position: u.position,
        }
    }
}
