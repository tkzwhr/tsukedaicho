use reqwest::Error;
use shaku::Provider;

use crate::datastore::{fetch_users, FetchUsers, GQLServer, UsersRepo};
use crate::types::Users;

#[derive(Provider)]
#[shaku(interface = UsersRepo)]
pub struct UsersRepoImpl {
    #[shaku(provide)]
    gql_server: Box<GQLServer>,
}

#[async_trait::async_trait]
impl UsersRepo for UsersRepoImpl {
    async fn fetch(&self) -> Result<Users, Error> {
        self.gql_server.post::<FetchUsers>(fetch_users::Variables {})
            .await
            .map(|res| {
                let data = res.data.unwrap();
                let users = data.users.into_iter().map(|v| v.into()).collect();
                Users(users)
            })
    }
}

#[cfg(test)]
mod tests {
    use crate::datastore;

    #[tokio::test]
    async fn test_fetch() {
        datastore::init_for_test();
        let repo = datastore::get_users_repo().unwrap();

        let res = repo.fetch().await;
        assert!(res.is_ok());

        let users = res.unwrap();
        assert_eq!(users.0.len(), 3);

        let user = users.0.iter().find(|v| v.id == 1);
        assert!(user.is_some());

        let user = user.unwrap();
        assert_eq!(user.name, "user1");
        assert_eq!(user.slack_id, Some("slack1".to_string()));
        assert_eq!(user.position, 1);
    }
}
