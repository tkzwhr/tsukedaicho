ツケ台帳 Slack
===

## 必要なソフトウェア

- Rust
- ngrok (ローカル確認用)

## 導入

ローカルで起動するには、この `README.md` と同じディレクトリに `.env` ファイルを作成する必要があります。

```.env
HASURA_URL=http://localhost:20080/v1/graphql
HASURA_SECRET=hasura
SLACK_SIGNING_SECRET=<your slack signing secret here>
SLACK_BOT_TOKEN=<your slack bot token here>
```

ファイルを作成したら起動します。

```shell
$ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.08s
     Running `target/debug/tsukedaicho-slack-api`
[2000-01-01][12:00:00][tsukedaicho_slack_api][INFO] Loading server: 0.0.0.0:3000
```

ngrokを起動します。

```shell
$ ngrok http 3000
```

Session Statusがonlineになるまで待ちます。

onlineになったらForwadingに表示されているドメインをSlackのApp管理画面に設定します。

- Interactivity & Shortcuts
  - Interactivity をonにする
  - Request URL に `https://<ngrokのForwardingのドメイン>/interaction` を入力して `[Save Changes]` を押す
- Event Subscriptions
  - Enable Eventsをonにする
  - Request URL の `[Change]` を押す
  - New Request URL に `https://<ngrokのForwardingのドメイン>/push` を入力して `Verify` を押す

## テスト

テストはリポジトリのみ書いてあります。
シングルスレッドで行う必要があります。

```shell
$ cargo test -- --test-threads=1
```
