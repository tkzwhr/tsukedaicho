use std::collections::HashMap;

use chrono::NaiveDate;
use serde_json::Value;
use slack_morphism_models::blocks::SlackStatefulStateParams;
use slack_morphism_models::SlackActionId;

use crate::server::SlackActions;

#[derive(Debug)]
pub struct RegisterForm {
    pub from_id: i64,
    pub to_id: i64,
    pub date: NaiveDate,
    pub amount: i64,
    pub description: String,
}

impl RegisterForm {
    pub fn is_valid(&self) -> bool {
        self.from_id != self.to_id
    }
}

impl From<SlackStatefulStateParams> for RegisterForm {
    fn from(sssp: SlackStatefulStateParams) -> Self {
        let status = parse_view(sssp);

        let from_id = status
            .get(SlackActionId::from(SlackActions::RegFromUser).0.as_str())
            .and_then(|x| x.as_object())
            .and_then(|x| x.get("selected_option"))
            .and_then(|x| x.as_object())
            .and_then(|x| x.get("value"))
            .and_then(|x| x.as_str())
            .and_then(|x| x.parse::<i64>().ok())
            .unwrap();

        let to_id = status
            .get(SlackActionId::from(SlackActions::RegToUser).0.as_str())
            .and_then(|x| x.as_object())
            .and_then(|x| x.get("selected_option"))
            .and_then(|x| x.as_object())
            .and_then(|x| x.get("value"))
            .and_then(|x| x.as_str())
            .and_then(|x| x.parse::<i64>().ok())
            .unwrap();

        let date = status
            .get(SlackActionId::from(SlackActions::RegDate).0.as_str())
            .and_then(|x| x.as_object())
            .and_then(|x| x.get("selected_date"))
            .and_then(|x| x.as_str())
            .and_then(|x| NaiveDate::parse_from_str(x, "%Y-%m-%d").ok())
            .unwrap();

        let amount = status
            .get(SlackActionId::from(SlackActions::RegAmount).0.as_str())
            .and_then(|x| x.as_object())
            .and_then(|x| x.get("value"))
            .and_then(|x| x.as_str())
            .and_then(|x| x.parse::<i64>().ok())
            .unwrap();

        let description = status
            .get(SlackActionId::from(SlackActions::RegDesc).0.as_str())
            .and_then(|x| x.as_object())
            .and_then(|x| x.get("value"))
            .and_then(|x| x.as_str())
            .map(|x| x.to_string())
            .unwrap();

        RegisterForm {
            from_id,
            to_id,
            date,
            amount,
            description,
        }
    }
}

#[derive(Debug)]
pub struct DeleteForm {
    pub tsuke_id: i64,
}

impl From<SlackStatefulStateParams> for DeleteForm {
    fn from(sssp: SlackStatefulStateParams) -> Self {
        let status = parse_view(sssp);

        let tsuke_id = status
            .get(SlackActionId::from(SlackActions::DelTsukeId).0.as_str())
            .and_then(|x| x.as_object())
            .and_then(|x| x.get("selected_option"))
            .and_then(|x| x.as_object())
            .and_then(|x| x.get("value"))
            .and_then(|x| x.as_str())
            .and_then(|x| x.parse::<i64>().ok())
            .unwrap();

        DeleteForm { tsuke_id }
    }
}

fn parse_view(sssp: SlackStatefulStateParams) -> HashMap<String, Value> {
    let mut status: HashMap<String, Value> = HashMap::new();

    if let Some(state) = sssp.state {
        let values = state
            .values
            .values()
            .flat_map(|x| x.as_object())
            .flat_map(|x| x);
        for (k, v) in values {
            status.insert(k.to_string(), v.clone());
        }
    }

    status
}
