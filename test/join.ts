import { assertEquals } from "../deps.ts";
import { Join } from "../join.ts";

const { test } = Deno;

test("testInnerJoin", function () {
  assertEquals(
    Join.inner("users").on("other.id", "users.id").value,
    "INNER JOIN `users` ON `other`.`id` = `users`.`id`",
  );
  assertEquals(
    Join.inner("users", "u").on("other.id", "u.id").value,
    "INNER JOIN `users` `u` ON `other`.`id` = `u`.`id`",
  );
});

test("testLeftJoin", function () {
  assertEquals(
    Join.left("users").on("other.id", "users.id").value,
    "LEFT OUTER JOIN `users` ON `other`.`id` = `users`.`id`",
  );
  assertEquals(
    Join.left("users", "u").on("other.id", "u.id").value,
    "LEFT OUTER JOIN `users` `u` ON `other`.`id` = `u`.`id`",
  );
});

test("testRightJoin", function () {
  assertEquals(
    Join.right("users").on("other.id", "users.id").value,
    "RIGHT OUTER JOIN `users` ON `other`.`id` = `users`.`id`",
  );
  assertEquals(
    Join.right("users", "u").on("other.id", "u.id").value,
    "RIGHT OUTER JOIN `users` `u` ON `other`.`id` = `u`.`id`",
  );
});

test("testFullJoin", function () {
  assertEquals(
    Join.full("users").on("other.id", "users.id").value,
    "FULL OUTER JOIN `users` ON `other`.`id` = `users`.`id`",
  );
  assertEquals(
    Join.full("users", "u").on("other.id", "u.id").value,
    "FULL OUTER JOIN `users` `u` ON `other`.`id` = `u`.`id`",
  );
});
