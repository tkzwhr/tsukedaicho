ツケ台帳 GraphQL
===

## 必要なソフトウェア

- Node.js
- graphqurl (npm)

## スキーマの更新

下記のコマンドを実行します。

```shell
$ gq http://localhost:20080/v1/graphql -H "X-Hasura-Admin-Secret: hasura" --introspect > schema.graphql
```
