use slack_morphism::{SlackActionId, SlackCallbackId};

const SLACK_CHANGE_USER: &str = "change_user";
const SLACK_ACTIONS_REGISTER: &str = "register";
const SLACK_ACTIONS_DELETE: &str = "delete";
const SLACK_ACTIONS_REG_FROM_USER: &str = "registration_from_user";
const SLACK_ACTIONS_REG_TO_USER: &str = "registration_to_user";
const SLACK_ACTIONS_REG_DATE: &str = "registration_date";
const SLACK_ACTIONS_REG_AMOUNT: &str = "registration_amount";
const SLACK_ACTIONS_REG_DESC: &str = "registration_desc";
const SLACK_ACTIONS_DEL_TSUKE_ID: &str = "deletion_tsuke_id";

pub enum SlackActions {
    ChangeUser,
    Register,
    Delete,
    RegFromUser,
    RegToUser,
    RegDate,
    RegAmount,
    RegDesc,
    DelTsukeId,
    Unknown,
}

impl From<SlackActions> for SlackActionId {
    fn from(sa: SlackActions) -> Self {
        match sa {
            SlackActions::ChangeUser => SlackActionId(SLACK_CHANGE_USER.to_string()),
            SlackActions::Register => SlackActionId(SLACK_ACTIONS_REGISTER.to_string()),
            SlackActions::Delete => SlackActionId(SLACK_ACTIONS_DELETE.to_string()),
            SlackActions::RegFromUser => SlackActionId(SLACK_ACTIONS_REG_FROM_USER.to_string()),
            SlackActions::RegToUser => SlackActionId(SLACK_ACTIONS_REG_TO_USER.to_string()),
            SlackActions::RegDate => SlackActionId(SLACK_ACTIONS_REG_DATE.to_string()),
            SlackActions::RegAmount => SlackActionId(SLACK_ACTIONS_REG_AMOUNT.to_string()),
            SlackActions::RegDesc => SlackActionId(SLACK_ACTIONS_REG_DESC.to_string()),
            SlackActions::DelTsukeId => SlackActionId(SLACK_ACTIONS_DEL_TSUKE_ID.to_string()),
            _ => SlackActionId(String::new()),
        }
    }
}

impl From<SlackActionId> for SlackActions {
    fn from(said: SlackActionId) -> Self {
        match said.0.as_str() {
            SLACK_CHANGE_USER => SlackActions::ChangeUser,
            SLACK_ACTIONS_REGISTER => SlackActions::Register,
            SLACK_ACTIONS_DELETE => SlackActions::Delete,
            SLACK_ACTIONS_REG_FROM_USER => SlackActions::RegFromUser,
            SLACK_ACTIONS_REG_TO_USER => SlackActions::RegToUser,
            SLACK_ACTIONS_REG_DATE => SlackActions::RegDate,
            SLACK_ACTIONS_REG_AMOUNT => SlackActions::RegAmount,
            SLACK_ACTIONS_REG_DESC => SlackActions::RegDesc,
            SLACK_ACTIONS_DEL_TSUKE_ID => SlackActions::DelTsukeId,
            _ => SlackActions::Unknown,
        }
    }
}

impl From<SlackActions> for SlackCallbackId {
    fn from(sa: SlackActions) -> Self {
        match sa {
            SlackActions::Register => SlackCallbackId(SLACK_ACTIONS_REGISTER.to_string()),
            SlackActions::Delete => SlackCallbackId(SLACK_ACTIONS_DELETE.to_string()),
            _ => SlackCallbackId(String::new()),
        }
    }
}

impl From<SlackCallbackId> for SlackActions {
    fn from(slack_callback_id: SlackCallbackId) -> Self {
        match slack_callback_id.0.as_str() {
            SLACK_ACTIONS_REGISTER => SlackActions::Register,
            SLACK_ACTIONS_DELETE => SlackActions::Delete,
            _ => SlackActions::Unknown,
        }
    }
}
