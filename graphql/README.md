gql
===

## Update schema

Install npm `graphqurl`.

And Execute the following command:

```shell
$ gq http://localhost:20080/v1/graphql -H "X-Hasura-Admin-Secret: hasura" --introspect > schema.graphql
```
