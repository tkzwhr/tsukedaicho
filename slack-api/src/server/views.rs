use chrono::Utc;
use slack_morphism::prelude::*;

use crate::server::handler::SlackActions;
use crate::types::*;

pub fn home_view_by_id(tsukes: &Tsukes, target_user_id: i64) -> SlackView {
    let target_user = tsukes
        .users()
        .find(target_user_id);
    home_view_target_user(tsukes, target_user)
}

pub fn home_view_by_slack_id(tsukes: &Tsukes, target_user_id: SlackUserId) -> SlackView {
    let target_user = tsukes
        .users()
        .find_by_slack_id(target_user_id.0.as_str());
    home_view_target_user(tsukes, target_user)
}

fn home_view_target_user(tsukes: &Tsukes, target_user: Option<&User>) -> SlackView {
    if target_user.is_none() {
        return SlackView::Home(SlackHomeView::new(slack_blocks![
            some_into(
                    SlackSectionBlock::new()
                    .with_text(md!("*ユーザー選択*"))
                    .with_accessory(select_user(tsukes.users(), None, SlackActions::ChangeUser).into())
            ),
            some_into(SlackHeaderBlock::new(pt!("情報が見つかりません")))
        ]));
    }
    let target_user = target_user.unwrap();

    SlackView::Home(SlackHomeView::new(
        vec![
            slack_blocks![
                some_into(
                    SlackSectionBlock::new()
                    .with_text(md!("*ユーザー選択*"))
                    .with_accessory(select_user(tsukes.users(), Some(target_user), SlackActions::ChangeUser).into())
                ),
                some_into(SlackHeaderBlock::new(pt!("貸し借り一覧"))),
                some_into(SlackDividerBlock::new())
            ],
            tsukes
                .users()
                .list_without(target_user.id)
                .iter()
                .flat_map(|&x| balance(tsukes, target_user, x))
                .collect::<Vec<SlackBlock>>(),
            slack_blocks![
                some_into(SlackHeaderBlock::new(pt!("最近の貸し借り"))),
                some_into(SlackDividerBlock::new())
            ],
            tsukes
                .list_by_user(target_user.id, 20)
                .iter()
                .flat_map(|&x| tsuke(tsukes.users(), target_user, x))
                .collect::<Vec<SlackBlock>>(),
            slack_blocks![some_into(
                SlackActionsBlock::new(vec![register_button().into(), delete_button().into()])
                    .with_block_id(SlackBlockId(target_user.id.to_string()))
            )],
        ]
            .into_iter()
            .flatten()
            .collect(),
    ))
}

pub fn register_modal(users: &Users, target_user_id: i64) -> SlackView {
    let target_user = users
        .find(target_user_id)
        .unwrap();

    SlackView::Modal(
        SlackModalView::new(
            pt!(":money_with_wings: 登録"),
            slack_blocks![
                some_into(SlackInputBlock::new(
                    pt!(":raising_hand: 貸した人"),
                    select_user(users, Some(target_user), SlackActions::RegFromUser).into()
                )),
                some_into(SlackInputBlock::new(
                    pt!(":bow: 借りた人"),
                    select_user(users, Some(target_user), SlackActions::RegToUser).into()
                )),
                some_into(SlackInputBlock::new(
                    pt!(":calendar: 日付"),
                    SlackBlockDatePickerElement::new(SlackActions::RegDate.into(), pt!("日付"))
                        .with_initial_date(Utc::now().format("%Y-%m-%d").to_string())
                        .into()
                )),
                some_into(SlackInputBlock::new(
                    pt!(":yen: 金額"),
                    SlackBlockPlainTextInputElement::new(
                        SlackActions::RegAmount.into(),
                        pt!("1000")
                    )
                    .into()
                )),
                some_into(SlackInputBlock::new(
                    pt!(":balloon: 摘要"),
                    SlackBlockPlainTextInputElement::new(
                        SlackActions::RegDesc.into(),
                        pt!("電気代")
                    )
                    .into()
                ))
            ],
        )
            .with_callback_id(SlackActions::Register.into())
            .with_external_id(target_user.id.to_string())
            .with_submit(pt!("登録"))
            .with_close(pt!("キャンセル")),
    )
}

pub fn delete_modal(tsukes: &Tsukes, target_user_id: i64) -> SlackView {
    let target_user = tsukes
        .users()
        .find(target_user_id)
        .unwrap();

    SlackView::Modal(
        SlackModalView::new(
            pt!(":no_entry_sign: 削除"),
            slack_blocks![some_into(SlackInputBlock::new(
                pt!(":notebook: 明細を選択"),
                SlackBlockRadioButtonsElement::new(
                    SlackActions::DelTsukeId.into(),
                    tsukes
                        .list_by_user(target_user.id, 10)
                        .iter()
                        .map(|x| SlackBlockChoiceItem::new(
                            tsuke_simple(tsukes.users(), target_user, x).into(),
                            x.id.to_string()
                        ))
                        .collect::<Vec<SlackBlockChoiceItem<SlackBlockText>>>(),
                )
                .into()
            ))],
        )
            .with_callback_id(SlackActions::Delete.into())
            .with_external_id(target_user.id.to_string())
            .with_submit(pt!("削除"))
            .with_close(pt!("キャンセル")),
    )
}

fn select_user(users: &Users, selected: Option<&User>, action: SlackActions) -> SlackBlockStaticSelectElement {
    let user_options = users
        .users()
        .iter()
        .map(|x| SlackBlockChoiceItem::new(pt!(x.name.clone()), x.id.to_string()))
        .collect::<Vec<SlackBlockChoiceItem<SlackBlockPlainTextOnly>>>();

    let element =
        SlackBlockStaticSelectElement::new(action.into(), pt!("ユーザーを選択"))
            .with_options(user_options.into_iter().map(|x| x.into()).collect());

    match selected {
        None => element,
        Some(uos) => element
            .with_initial_option(SlackBlockChoiceItem::new(pt!(uos.name.clone()), uos.id.to_string()).into())
    }
}

fn register_button() -> SlackBlockButtonElement {
    SlackBlockButtonElement::new(SlackActions::Register.into(), pt!(":moneybag: 登録"))
        .with_style("primary".to_string())
}

fn delete_button() -> SlackBlockButtonElement {
    SlackBlockButtonElement::new(SlackActions::Delete.into(), pt!(":no_entry_sign: 削除"))
        .with_style("danger".to_string())
}

fn balance(tsukes: &Tsukes, target_user: &User, opponent_user: &User) -> Vec<SlackBlock> {
    let amount = tsukes.amount(target_user.id, opponent_user.id);
    let amount_str = if amount < 0 {
        format!(":small_red_triangle:{}円", -amount)
    } else {
        format!("{}円", amount)
    };
    let opponent_user_slack_data = opponent_user.slack_data_with_default();

    slack_blocks![
        some_into(SlackContextBlock::new(vec![
            SlackBlockImageElement::new(opponent_user_slack_data.image.clone(), opponent_user_slack_data.display_name.clone())
                .into(),
            md!(format!("*{}*", opponent_user_slack_data.display_name.clone()))
        ])),
        some_into(SlackHeaderBlock::new(pt!(amount_str))),
        some_into(SlackContextBlock::new(vec![pt!(" ")]))
    ]
}

fn tsuke(users: &Users, target_user: &User, tsuke: &Tsuke) -> Vec<SlackBlock> {
    let (opponent_user, message) = if tsuke.from_user.id == target_user.id {
        let opponent = users
            .find(tsuke.to_user.id)
            .map(|tu| tu.slack_data_with_default())
            .unwrap();
        (opponent, ":arrow_left:")
    } else {
        let opponent = users
            .find(tsuke.from_user.id)
            .map(|tu| tu.slack_data_with_default())
            .unwrap();
        (opponent, ":arrow_right:")
    };

    slack_blocks![some_into(SlackContextBlock::new(vec![
        md!(format!("*{}*", tsuke.date.format("%Y-%m-%d"))),
        SlackBlockImageElement::new(opponent_user.image.clone(), opponent_user.display_name.clone())
            .into(),
        md!(format!(
            "*{}* {} `{}` 円",
            opponent_user.display_name.clone(),
            message,
            tsuke.amount
        )),
        md!(format!("> {}", tsuke.description)),
    ]))]
}

fn tsuke_simple(users: &Users, target_user: &User, tsuke: &Tsuke) -> SlackBlockPlainText {
    let (opponent_user, message) = if tsuke.from_user.id == target_user.id {
        let opponent = users
            .find(tsuke.to_user.id)
            .map(|tu| tu.slack_data_with_default())
            .unwrap();
        (opponent, "←")
    } else {
        let opponent = users
            .find(tsuke.from_user.id)
            .map(|tu| tu.slack_data_with_default())
            .unwrap();
        (opponent, "→")
    };

    pt!(format!(
        "[{}] {} {} {}円 ({})",
        tsuke.date.format("%Y-%m-%d"),
        opponent_user.display_name,
        message,
        tsuke.amount,
        tsuke.description
    ))
}
