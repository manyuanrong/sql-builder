# Join

### Where.`JoinType`(tableName: string, alias?: string).on(fieldA: string, fieldB: string)

JoinType:

- `inner`
- `left`
- `right`
- `full`

example:

```ts
Join.inner("tabelB").on("tableA.id", "tableB.id");
// INNER JOIN `tableB` ON `tableA`.`id` = `tableB`.`id`
Join.left("tabelB", "users").on("tableA.id", "users.id");
// LEFT OUTER JOIN `tableB` `users` ON `tableA`.`id` = `users`.`id`
```
