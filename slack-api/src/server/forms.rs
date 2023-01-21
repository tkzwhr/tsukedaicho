use std::collections::HashMap;

use chrono::NaiveDate;
use slack_morphism::blocks::{SlackStatefulStateParams, SlackViewStateValue};
use slack_morphism::SlackActionId;

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
    fn from(params: SlackStatefulStateParams) -> Self {
        let status = parse_view(params);

        let from_id = status
            .get(&SlackActionId::from(SlackActions::RegFromUser))
            .and_then(|x| x.selected_option.clone())
            .and_then(|x| x.value.parse::<i64>().ok())
            .unwrap();

        let to_id = status
            .get(&SlackActionId::from(SlackActions::RegToUser))
            .and_then(|x| x.selected_option.clone())
            .and_then(|x| x.value.parse::<i64>().ok())
            .unwrap();

        let date = status
            .get(&SlackActionId::from(SlackActions::RegDate))
            .and_then(|x| x.selected_date.clone())
            .and_then(|x| NaiveDate::parse_from_str(x.as_str(), "%Y-%m-%d").ok())
            .unwrap();

        let amount = status
            .get(&SlackActionId::from(SlackActions::RegAmount))
            .and_then(|x| x.value.clone())
            .and_then(|x| x.parse::<i64>().ok())
            .unwrap();

        let description = status
            .get(&SlackActionId::from(SlackActions::RegDesc))
            .and_then(|x| x.value.clone())
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
    fn from(params: SlackStatefulStateParams) -> Self {
        let status = parse_view(params);

        let tsuke_id = status
            .get(&SlackActionId::from(SlackActions::DelTsukeId))
            .and_then(|x| x.selected_option.clone())
            .and_then(|x| x.value.parse::<i64>().ok())
            .unwrap();

        DeleteForm { tsuke_id }
    }
}

fn parse_view(params: SlackStatefulStateParams) -> HashMap<SlackActionId, SlackViewStateValue> {
    let mut collected = HashMap::<SlackActionId, SlackViewStateValue>::new();
    if let Some(state) = params.state {
        for values in state.values.into_values() {
            for (k, v) in values {
                collected.insert(k, v);
            }
        }
    }
    collected
}
