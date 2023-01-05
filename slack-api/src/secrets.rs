use log::*;
use slack_morphism::{SlackApiToken, SlackSigningSecret};

const HASURA_URL: &str = "HASURA_URL";
const HASURA_SECRET: &str = "HASURA_SECRET";
const SLACK_SIGNING_SECRET: &str = "SLACK_SIGNING_SECRET";
const SLACK_BOT_TOKEN: &str = "SLACK_BOT_TOKEN";

pub fn check_secrets() -> Result<(), String> {
    let result = dotenv::dotenv();
    if let Err(err) = result.as_ref() {
        warn!("'.env' file not loaded. Err={:?}", err);
    }

    let _ = env(HASURA_URL)?;
    let _ = env(HASURA_SECRET)?;
    let _ = env(SLACK_SIGNING_SECRET)?;
    let _ = env(SLACK_BOT_TOKEN)?;

    Ok(())
}

pub fn hasura_url() -> String {
    env(HASURA_URL).unwrap()
}

pub fn hasura_secret() -> String {
    env(HASURA_SECRET).unwrap()
}

pub fn signing_secret() -> SlackSigningSecret {
    let signing_secret = env(SLACK_SIGNING_SECRET).unwrap();
    SlackSigningSecret::new(signing_secret)
}

pub fn api_token() -> SlackApiToken {
    let token_value = env(SLACK_BOT_TOKEN).unwrap();
    SlackApiToken::new(token_value.into())
}

fn env(name: &str) -> Result<String, String> {
    std::env::var(name).map_err(|e| {
        let error_message = format!("{}: {}", name, e);
        error!("[Env] Failed to load. {}", error_message);
        error_message
    })
}
