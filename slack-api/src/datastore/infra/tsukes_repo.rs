use reqwest::Error;
use shaku::Provider;

use crate::datastore::{CreateTsuke, CreateTsukeRequest, delete_tsuke, DeleteTsuke, fetch_tsukes_and_users, FetchTsukesAndUsers, GQLServer, TsukesRepo};
use crate::types::{Tsukes, Users};

#[derive(Provider)]
#[shaku(interface = TsukesRepo)]
pub struct TsukesRepoImpl {
    #[shaku(provide)]
    gql_server: Box<GQLServer>,
}

#[async_trait::async_trait]
impl TsukesRepo for TsukesRepoImpl {
    async fn fetch(&self) -> Result<Tsukes, Error> {
        self.gql_server.post::<FetchTsukesAndUsers>(fetch_tsukes_and_users::Variables {})
            .await
            .map(|res| {
                let data = res.data.unwrap();
                let tsukes = data.tsukes.into_iter().map(|v| v.into()).collect();
                let users = data.users.into_iter().map(|v| v.into()).collect();
                Tsukes(tsukes, Users(users))
            })
    }

    async fn create(&self, tsuke: CreateTsukeRequest) -> Result<(), Error> {
        self.gql_server.post::<CreateTsuke>(tsuke.into())
            .await
            .map(|_| ())
    }

    async fn delete(&self, id: i64) -> Result<(), Error> {
        self.gql_server.post::<DeleteTsuke>(delete_tsuke::Variables { id })
            .await
            .map(|_| ())
    }
}

#[cfg(test)]
mod tests {
    use chrono::NaiveDate;

    use crate::datastore;
    use crate::types::Tsuke;

    use super::*;

    const NUMBER_OF_PRESET: i64 = 3;

    fn find_dummy_tsuke(result: &Tsukes) -> Option<&Tsuke> {
        result.0.iter().find(|v| v.id > NUMBER_OF_PRESET)
    }

    #[tokio::test]
    async fn test_fetch() {
        datastore::init_for_test();
        let repo = datastore::get_tsukes_repo().unwrap();

        let res = repo.fetch().await;
        assert!(res.is_ok());

        let tsukes = res.unwrap();
        assert_eq!(tsukes.0.len(), 3);

        let tsuke = tsukes.0.iter().find(|v| v.id == 1);
        assert!(tsuke.is_some());

        let tsuke = tsuke.unwrap();
        assert_eq!(tsuke.date, NaiveDate::from_ymd(2021, 1, 1));
        assert_eq!(tsuke.from_user.id, 1);
        assert_eq!(tsuke.from_user.name, String::from("user1"));
        assert_eq!(tsuke.to_user.id, 2);
        assert_eq!(tsuke.to_user.name, String::from("user2"));
        assert_eq!(tsuke.amount, 100);
        assert_eq!(tsuke.description, String::from("Bought chocolate"));
    }

    #[tokio::test]
    async fn test_create() {
        datastore::init_for_test();
        let repo = datastore::get_tsukes_repo().unwrap();

        let req = CreateTsukeRequest {
            date: NaiveDate::from_ymd(2000, 1, 1),
            from_user_id: 1,
            to_user_id: 2,
            amount: 9999,
            description: String::from("newTsuke"),
        };
        let res = repo.create(req).await;
        assert!(res.is_ok());

        let tsukes = repo.fetch().await.unwrap();
        let tsuke = find_dummy_tsuke(&tsukes).unwrap();
        assert_eq!(tsuke.date, NaiveDate::from_ymd(2000, 1, 1));
        assert_eq!(tsuke.from_user.id, 1);
        assert_eq!(tsuke.from_user.name, String::from("user1"));
        assert_eq!(tsuke.to_user.id, 2);
        assert_eq!(tsuke.to_user.name, String::from("user2"));
        assert_eq!(tsuke.amount, 9999);
        assert_eq!(tsuke.description, String::from("newTsuke"));
    }

    #[tokio::test]
    async fn test_delete() {
        datastore::init_for_test();
        let repo = datastore::get_tsukes_repo().unwrap();

        let tsukes = repo.fetch().await.unwrap();
        let tsuke = find_dummy_tsuke(&tsukes).unwrap();
        let res = repo.delete(tsuke.id).await;
        assert!(res.is_ok());

        let res = repo.fetch().await;
        assert!(res.is_ok());

        let tsukes = res.unwrap();
        let tsuke = find_dummy_tsuke(&tsukes);
        assert!(tsuke.is_none());
    }
}
