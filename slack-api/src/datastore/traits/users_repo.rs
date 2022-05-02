use reqwest::Error;
use shaku::Interface;

use crate::types::Users;

#[async_trait::async_trait]
pub trait UsersRepo: Interface {
    async fn fetch(&self) -> Result<Users, Error>;
}
