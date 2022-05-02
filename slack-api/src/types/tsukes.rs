use chrono::NaiveDate;

use crate::types::Users;
use crate::types::users::PartOfUser;

#[derive(Debug)]
pub struct Tsukes(pub Vec<Tsuke>, pub Users);

#[derive(Debug)]
pub struct Tsuke {
    pub id: i64,
    pub date: NaiveDate,
    pub from_user: PartOfUser,
    pub to_user: PartOfUser,
    pub amount: i64,
    pub description: String,
}

impl Tsukes {
    pub fn users(&self) -> &Users {
        &self.1
    }

    pub fn list_by_user(&self, id: i64, limit: i64) -> Vec<&Tsuke> {
        self.0
            .iter()
            .filter(|x| x.from_user.id == id || x.to_user.id == id)
            .take(limit as usize)
            .collect::<Vec<&Tsuke>>()
    }

    pub fn amount(&self, my_id: i64, opponent_id: i64) -> i64 {
        self.0.iter().fold(0, |acc, x| {
            if x.from_user.id == my_id && x.to_user.id == opponent_id {
                acc + x.amount
            } else if x.from_user.id == opponent_id && x.to_user.id == my_id {
                acc - x.amount
            } else {
                acc
            }
        })
    }
}
