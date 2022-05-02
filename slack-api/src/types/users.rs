#[derive(Debug)]
pub struct Users(pub Vec<User>);

#[derive(Debug)]
pub struct User {
    pub id: i64,
    pub name: String,
    pub slack_id: Option<String>,
    pub slack_data: Option<SlackUserData>,
    pub position: i64,
}

#[derive(Debug)]
pub struct SlackUserData {
    pub display_name: Option<String>,
    pub image: Option<String>,
}

#[derive(Debug)]
pub struct SlackUserDataWithDefault {
    pub display_name: String,
    pub image: String,
}

#[derive(Debug)]
pub struct PartOfUser {
    pub id: i64,
    pub name: String,
}

impl Users {
    pub fn users(&self) -> &[User] {
        self.0.as_slice()
    }

    pub fn find(&self, id: i64) -> Option<&User> {
        self.0.iter().find(|x| x.id == id)
    }

    pub fn list_without(&self, id: i64) -> Vec<&User> {
        self.0.iter().filter(|x| x.id != id).collect()
    }

    pub fn find_by_slack_id(&self, slack_id: &str) -> Option<&User> {
        let slack_id = Some(slack_id.to_string());
        self.0.iter().find(|x| x.slack_id == slack_id)
    }
}

impl User {
    pub fn slack_data_with_default(&self) -> SlackUserDataWithDefault {
        let display_name = self.slack_data.as_ref()
            .and_then(|x| x.display_name.as_ref())
            .map(|x| x.to_string())
            .unwrap_or(format!("({})", self.name.as_str()));

        let image = self.slack_data.as_ref()
            .and_then(|x| x.image.as_ref())
            .map(|x| x.to_string())
            .unwrap_or(format!("https://placehold.jp/32/cccccc/000000/64x64.png?text={}", self.name.chars().next().unwrap()));

        SlackUserDataWithDefault {
            display_name,
            image,
        }
    }
}
