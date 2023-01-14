ツケ台帳 インフラ
===

## 必要なソフトウェア

- Docker
- Docker Compose
- Hasura CLI

## 導入

Dockerを起動した状態でコンテナを立ち上げます。

```shell
$ docker compose up -d
```

Hasuraにアクセスできるようになります。管理パスワードに `hasura` を入れてログインします。

- http://localhost:20080/
- http://localhost:20081/ テスト用

## テーブル定義変更

テスト用DBにテーブルが作成できているか、テーブル数でチェックしているので、
テーブル数を書き換える必要があります。

`docker-compose.yml`

> test: ["CMD-SHELL", "test `psql -U postgres tsukedaicho_test -c '\\dt' -t | wc -l` = %HERE%"]

- `%HERE%` をテーブル数+1にする

データベース更新のためにDockerを立ち上げ直します。

```shell
$ docker-compose down && docker-compose up -d
```

下記のコマンドでメタデータを更新します。

```shell
$ cd hasura
$ hasura md export
```
