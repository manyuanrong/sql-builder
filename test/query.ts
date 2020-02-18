import { assertEquals } from "../deps.ts";
import { Join } from "../join.ts";
import { Order, Query, Where } from "../mod.ts";

Deno.test(function testQueryInsert() {
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

Deno.test(function testQueryUpdate() {
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

Deno.test(function testQueryUpdateWithWhere() {
  const builder = new Query();
  const record = {
    name: "Enok",
    password: "foo",
    id: 1
  };

  const sql = builder
    .table("users")
    .where(Where.field("id").eq(1))
    .where(Where.field("name").like("%n%"))
    .update(record)
    .build();

  assertEquals(
    sql.trim(),
    'UPDATE `users` SET `name` = "Enok", `password` = "foo", `id` = 1 WHERE `id` = 1 AND `name` LIKE "%n%"'
  );
});

Deno.test(function testQueryDelete() {
  const builder = new Query();

  const sql = builder
    .table("users")
    .delete()
    .build();

  assertEquals(sql.trim(), "DELETE FROM `users`");
});

Deno.test(function testQueryDeleteWithWhere() {
  const builder = new Query();

  const sql = builder
    .table("users")
    .where(Where.field("id").eq(1))
    .where(Where.field("name").like("%n%"))
    .delete()
    .build();

  assertEquals(
    sql.trim(),
    'DELETE FROM `users` WHERE `id` = 1 AND `name` LIKE "%n%"'
  );
});

Deno.test(function testQuerySelectSimple() {
  const builder = new Query();

  const sql = builder
    .table("users")
    .select("name", "id")
    .build();

  assertEquals(sql.trim(), "SELECT `name`, `id` FROM `users`");
});

Deno.test(function testQuerySelectGroupBy() {
  const builder = new Query();

  const sql = builder
    .table("users")
    .select("name", "id", "type")
    .groupBy("type")
    .having(Where.field("type").notIn(1, 2))
    .build();

  assertEquals(
    sql.trim(),
    "SELECT `name`, `id`, `type` FROM `users` GROUP BY `type` HAVING `type` NOT IN (1,2)"
  );
});

Deno.test(function testQuerySelectWhere() {
  const builder = new Query();

  const sql = builder
    .table("users")
    .where(Where.and(Where.field("id").gt(1), Where.field("name").like("%n%")))
    .select("name", "id")
    .build();

  assertEquals(
    sql.trim(),
    'SELECT `name`, `id` FROM `users` WHERE (`id` > 1 AND `name` LIKE "%n%")'
  );
});

Deno.test(function testQuerySelectOrder() {
  const builder = new Query();

  const sql = builder
    .table("users")
    .where(Where.field("id").gt(1))
    .where(Where.field("name").like("%n%"))
    .select("name", "id")
    .order(Order.by("id").desc, Order.by("name").asc)
    .build();

  assertEquals(
    sql.trim(),
    'SELECT `name`, `id` FROM `users` WHERE `id` > 1 AND `name` LIKE "%n%" ORDER BY `id` DESC, `name` ASC'
  );
});

Deno.test(function testQuerySelectJoin() {
  const builder = new Query();

  const sql = builder
    .table("users")
    .where(Where.field("id").gt(1))
    .where(Where.field("name").like("%n%"))
    .select("users.id", "users.name", "`uses`.`avatar` as `uavatar`")
    .join(Join.left("posts").on("posts.id", "users.id"))
    .build();

  assertEquals(
    sql.trim(),
    'SELECT `users`.`id`, `users`.`name`, `uses`.`avatar` as `uavatar` FROM `users` LEFT OUTER JOIN `posts` ON `posts`.`id` = `users`.`id` WHERE `id` > 1 AND `name` LIKE "%n%"'
  );
});

Deno.test(function testQuerySelectLimit() {
  const builder = new Query();

  const sql = builder
    .table("users")
    .where(Where.field("id").gt(1))
    .where(Where.field("name").like("%n%"))
    .select("*")
    .limit(0, 10)
    .build();

  assertEquals(
    sql.trim(),
    'SELECT * FROM `users` WHERE `id` > 1 AND `name` LIKE "%n%" LIMIT 0, 10'
  );
});
