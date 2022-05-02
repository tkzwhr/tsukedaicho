use chrono::NaiveDate;
use log::*;
use reqwest::Error;
use shaku::Provider;

use crate::datastore::{CreateTsukeRequest, TsukesRepo, UsersRepo};
use crate::types::{PartOfUser, Tsuke, Tsukes, User, Users};

fn generate_tsukes() -> Vec<Tsuke> {
    vec![
        Tsuke {
            id: 1,
            date: NaiveDate::from_ymd(2001, 2, 3),
            from_user: PartOfUser { id: 1, name: "A".to_string() },
            to_user: PartOfUser { id: 2, name: "B".to_string() },
            amount: 100,
            description: "TEST".to_string(),
        },
        Tsuke {
            id: 2,
            date: NaiveDate::from_ymd(2002, 3, 4),
            from_user: PartOfUser { id: 2, name: "B".to_string() },
            to_user: PartOfUser { id: 3, name: "CC".to_string() },
            amount: 200,
            description: "TEST TEST TEST".to_string(),
        },
    ]
}

fn generate_users() -> Vec<User> {
    vec![
        User {
            id: 1,
            name: "A".to_string(),
            slack_id: Some("---------".to_string()),
            slack_data: None,
            position: 1,
        },
        User {
            id: 2,
            name: "B".to_string(),
            slack_id: Some("---------".to_string()),
            slack_data: None,
            position: 2,
        },
        User {
            id: 3,
            name: "CC".to_string(),
            slack_id: None,
            slack_data: None,
            position: 2,
        },
    ]
}

#[derive(Provider)]
#[shaku(interface = TsukesRepo)]
pub struct TsukesRepoMock;

#[async_trait::async_trait]
impl TsukesRepo for TsukesRepoMock {
    async fn fetch(&self) -> Result<Tsukes, Error> {
        Ok(Tsukes(generate_tsukes(), Users(generate_users())))
    }

    async fn create(&self, tsuke: CreateTsukeRequest) -> Result<(), Error> {
        debug!("called create: {:?}", &tsuke);
        Ok(())
    }

    async fn delete(&self, id: i64) -> Result<(), Error> {
        debug!("called delete: {:?}", &id);
        Ok(())
    }
}

#[derive(Provider)]
#[shaku(interface = UsersRepo)]
pub struct UsersRepoMock;

#[async_trait::async_trait]
impl UsersRepo for UsersRepoMock {
    async fn fetch(&self) -> Result<Users, Error> {
        Ok(Users(generate_users()))
    }
}
