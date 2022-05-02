use slack_morphism_models::SlackUser;

use crate::types::{SlackUserData, Tsukes, User, Users};

impl Tsukes {
    pub fn into_slack_data(self, slack_users: &[SlackUser]) -> Tsukes {
        Tsukes(self.0, self.1.into_slack_data(slack_users))
    }
}

impl Users {
    pub fn into_slack_data(self, slack_users: &[SlackUser]) -> Users {
        Users(
            self.0.into_iter()
                .map(|x| {
                    if let Some(slack_id) = x.slack_id.as_ref() {
                        if let Some(slack_user) = slack_users.iter().find(|y| y.id.0.as_str() == slack_id) {
                            return x.into_slack_data(slack_user);
                        }
                    }
                    x
                })
                .collect()
        )
    }
}

impl User {
    pub fn into_slack_data(self, slack_user: &SlackUser) -> User {
        let slack_data = slack_user.profile.as_ref().map(|x| SlackUserData {
            display_name: x.display_name.clone(),
            image: x.icon.as_ref().and_then(|y| y.image_original.as_ref()).map(|y| y.to_string()),
        });

        User {
            id: self.id,
            name: self.name,
            slack_id: self.slack_id,
            slack_data,
            position: self.position,
        }
    }
}
