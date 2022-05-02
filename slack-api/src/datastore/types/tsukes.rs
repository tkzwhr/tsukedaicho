use chrono::NaiveDate;
use graphql_client::GraphQLQuery;

use crate::types::*;

// https://github.com/graphql-rust/graphql-client#custom-scalars
type Date = NaiveDate;

#[derive(GraphQLQuery)]
#[graphql(
schema_path = "../graphql/schema.graphql",
query_path = "../graphql/queries/fetch_tsukes_and_users.graphql",
response_derives = "Debug",
normalization = "rust"
)]
pub struct FetchTsukesAndUsers;

impl From<fetch_tsukes_and_users::FetchTsukesAndUsersTsukes> for Tsuke {
    fn from(t: fetch_tsukes_and_users::FetchTsukesAndUsersTsukes) -> Self {
        Tsuke {
            id: t.id,
            date: t.date.clone(),
            from_user: PartOfUser {
                id: t.from_user.id,
                name: t.from_user.name.clone(),
            },
            to_user: PartOfUser {
                id: t.to_user.id,
                name: t.to_user.name.clone(),
            },
            amount: t.amount,
            description: t.description.clone(),
        }
    }
}

impl From<fetch_tsukes_and_users::FetchTsukesAndUsersUsers> for User {
    fn from(u: fetch_tsukes_and_users::FetchTsukesAndUsersUsers) -> Self {
        User {
            id: u.id,
            name: u.name.clone(),
            slack_id: u.slack_id.as_ref().map(|uu| uu.clone()),
            slack_data: None,
            position: u.position,
        }
    }
}

#[derive(GraphQLQuery)]
#[graphql(
schema_path = "../graphql/schema.graphql",
query_path = "../graphql/queries/create_tsuke.graphql",
response_derives = "Debug",
normalization = "rust"
)]
pub struct CreateTsuke;

#[derive(GraphQLQuery)]
#[graphql(
schema_path = "../graphql/schema.graphql",
query_path = "../graphql/queries/delete_tsuke.graphql",
response_derives = "Debug",
normalization = "rust"
)]
pub struct DeleteTsuke;

#[derive(Debug)]
pub struct CreateTsukeRequest {
    pub date: NaiveDate,
    pub from_user_id: i64,
    pub to_user_id: i64,
    pub amount: i64,
    pub description: String,
}

impl From<CreateTsukeRequest> for create_tsuke::Variables {
    fn from(r: CreateTsukeRequest) -> Self {
        create_tsuke::Variables {
            date: r.date,
            from_user_id: r.from_user_id,
            to_user_id: r.to_user_id,
            amount: r.amount,
            description: r.description,
        }
    }
}
