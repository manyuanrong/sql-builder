## Deno SQL QueryBuilder

[![Build Status](https://www.travis-ci.org/manyuanrong/sql-builder.svg?branch=master)](https://www.travis-ci.org/manyuanrong/sql-builder)
![GitHub](https://img.shields.io/github/license/manyuanrong/sql-builder.svg)
![GitHub release](https://img.shields.io/github/release/manyuanrong/sql-builder.svg)
![(Deno)](https://img.shields.io/badge/deno-1.0.0-green.svg)

### Docs

More Useage see:

- [Query](./docs/query.md)
- [Where](./docs/where.md)
- [Order](./docs/order.md)
- [Join](./docs/join.md)

### [Changes Log](./CHANGELOG.MD)

### Example

```ts
import { assertEquals, runTests, test } from "./deps.ts";
import { Query } from "https://deno.land/x/sql_builder/mod.ts";

test(function testQueryInsert() {
  const builder = new Query();
  const records = [
    {
      name: "Enok",
      password: "foo",
      id: 1
    },
    {
      id: 2,
      name: "Man",
      password: "bar"
    }
  ];

  const sql = builder
    .table("users")
    .insert(records)
    .build();

  assertEquals(
    sql.trim(),
    'INSERT INTO `users` (`name`,`password`,`id`) VALUES ("Enok","foo",1) ("Man","bar",2)'
  );
});

test(function testQueryUpdate() {
  const builder = new Query();
  const record = {
    name: "Enok",
    password: "foo",
    id: 1
  };

  const sql = builder
    .table("users")
    .update(record)
    .build();

  assertEquals(
    sql.trim(),
    'UPDATE `users` SET `name` = "Enok", `password` = "foo", `id` = 1'
  );
});

test(function testQueryUpdateWithWhere() {
  const builder = new Query();
  const record = {
    name: "Enok",
    password: "foo",
    id: 1
  };

  const sql = builder
    .table("users")
    .where("id", "=", 1)
    .where("name", "like", "%n%")
    .update(record)
    .build();

  assertEquals(
    sql.trim(),
    'UPDATE `users` SET `name` = "Enok", `password` = "foo", `id` = 1 WHERE `id` = 1 AND `name` like "%n%"'
  );
});

test(function testQueryDelete() {
  const builder = new Query();

  const sql = builder
    .table("users")
    .delete()
    .build();

  assertEquals(sql.trim(), "DELETE FROM `users`");
});

test(function testQueryDeleteWithWhere() {
  const builder = new Query();

  const sql = builder
    .table("users")
    .where("id", "=", 1)
    .where("name", "like", "%n%")
    .delete()
    .build();

  assertEquals(
    sql.trim(),
    'DELETE FROM `users` WHERE `id` = 1 AND `name` like "%n%"'
  );
});

test(function testQuerySelectSimple() {
  const builder = new Query();

  const sql = builder
    .table("users")
    .select("name", "id")
    .build();

  assertEquals(sql.trim(), "SELECT `name`, `id` FROM `users`");
});

test(function testQuerySelectWhere() {
  const builder = new Query();

  const sql = builder
    .table("users")
    .where("id", ">", 1)
    .where("name", "like", "%n%")
    .select("name", "id")
    .build();

  assertEquals(
    sql.trim(),
    'SELECT `name`, `id` FROM `users` WHERE `id` > 1 AND `name` like "%n%"'
  );
});

test(function testQuerySelectOrder() {
  const builder = new Query();

  const sql = builder
    .table("users")
    .where("id", ">", 1)
    .where("name", "like", "%n%")
    .select("name", "id")
    .order("id", "DESC")
    .order("name", "asc")
    .build();

  assertEquals(
    sql.trim(),
    'SELECT `name`, `id` FROM `users` WHERE `id` > 1 AND `name` like "%n%" ORDER BY `id` DESC, `name` ASC'
  );
});

test(function testQuerySelectJoin() {
  const builder = new Query();

  const sql = builder
    .table("users")
    .where("id", ">", 1)
    .where("name", "like", "%n%")
    .select("users.id", "users.name", "`uses`.`avatar` as `uavatar`")
    .join("LEFT JOIN posts ON posts.id = users.id")
    .build();

  assertEquals(
    sql.trim(),
    'SELECT `users`.`id`, `users`.`name`, `uses`.`avatar` as `uavatar` FROM `users` LEFT JOIN posts ON posts.id = users.id WHERE `id` > 1 AND `name` like "%n%"'
  );
});

test(function testQuerySelectLimit() {
  const builder = new Query();

  const sql = builder
    .table("users")
    .where("id", ">", 1)
    .where("name", "like", "%n%")
    .select("*")
    .limit(0, 10)
    .build();

  assertEquals(
    sql.trim(),
    'SELECT * FROM `users` WHERE `id` > 1 AND `name` like "%n%" LIMIT 0, 10'
  );
});

runTests();
```
