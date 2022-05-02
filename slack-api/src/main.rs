use tsukedaicho_slack_api::BoxedError;

#[tokio::main]
async fn main() -> Result<(), BoxedError> {
    tsukedaicho_slack_api::serve().await?;
    Ok(())
}
