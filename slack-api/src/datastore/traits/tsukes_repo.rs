use reqwest::Error;
use shaku::Interface;

use crate::datastore::CreateTsukeRequest;
use crate::types::Tsukes;

#[async_trait::async_trait]
pub trait TsukesRepo: Interface {
    async fn fetch(&self) -> Result<Tsukes, Error>;
    async fn create(&self, tsuke: CreateTsukeRequest) -> Result<(), Error>;
    async fn delete(&self, id: i64) -> Result<(), Error>;
}
 