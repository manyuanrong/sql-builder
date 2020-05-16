import { assertEquals } from "../deps.ts";
import { Where } from "../mod.ts";

const { test } = Deno;

test("testWhereEq", function () {
  const sql = '`name` = "foo"';
  assertEquals(Where.expr("?? = ?", "name", "foo").value, sql);
  assertEquals(Where.eq("name", "foo").value, sql);
  assertEquals(Where.field("name").eq("foo").value, sql);
});

test("testWhereNe", function () {
  const sql = '`name` != "foo"';
  assertEquals(Where.expr("?? != ?", "name", "foo").value, sql);
  assertEquals(Where.ne("name", "foo").value, sql);
  assertEquals(Where.field("name").ne("foo").value, sql);
});

test("testWhereGt", function () {
  const sql = "`age` > 10";
  assertEquals(Where.expr("?? > ?", "age", 10).value, sql);
  assertEquals(Where.gt("age", 10).value, sql);
  assertEquals(Where.field("age").gt(10).value, sql);
});

test("testWhereGte", function () {
  const sql = "`age` >= 10";
  assertEquals(Where.expr("?? >= ?", "age", 10).value, sql);
  assertEquals(Where.gte("age", 10).value, sql);
  assertEquals(Where.field("age").gte(10).value, sql);
});

test("testWhereLt", function () {
  const sql = "`age` < 10";
  assertEquals(Where.expr("?? < ?", "age", 10).value, sql);
  assertEquals(Where.lt("age", 10).value, sql);
  assertEquals(Where.field("age").lt(10).value, sql);
});

test("testWhereLte", function () {
  const sql = "`age` <= 10";
  assertEquals(Where.expr("?? <= ?", "age", 10).value, sql);
  assertEquals(Where.lte("age", 10).value, sql);
  assertEquals(Where.field("age").lte(10).value, sql);
});

test("testWhereNotNull", function () {
  const sql = "`age` NOT NULL";
  assertEquals(Where.expr("?? NOT NULL", "age").value, sql);
  assertEquals(Where.notNull("age").value, sql);
  assertEquals(Where.field("age").notNull().value, sql);
});

test("testWhereIsNull", function () {
  const sql = "`age` IS NULL";
  assertEquals(Where.expr("?? IS NULL", "age").value, sql);
  assertEquals(Where.isNull("age").value, sql);
  assertEquals(Where.field("age").isNull().value, sql);
});

test("testWhereIn", function () {
  const sql = "`age` IN (1,2,3,4)";
  assertEquals(Where.expr("?? IN ?", "age", [1, 2, 3, 4]).value, sql);
  assertEquals(Where.in("age", 1, 2, 3, 4).value, sql);
  assertEquals(Where.in("age", [1, 2, 3, 4]).value, sql);
  assertEquals(Where.field("age").in(1, 2, 3, 4).value, sql);
  assertEquals(Where.field("age").in([1, 2, 3, 4]).value, sql);
});

test("testWhereNotIn", function () {
  const sql = "`age` NOT IN (1,2,3,4)";
  assertEquals(Where.expr("?? NOT IN ?", "age", [1, 2, 3, 4]).value, sql);
  assertEquals(Where.notIn("age", 1, 2, 3, 4).value, sql);
  assertEquals(Where.notIn("age", [1, 2, 3, 4]).value, sql);
  assertEquals(Where.field("age").notIn(1, 2, 3, 4).value, sql);
  assertEquals(Where.field("age").notIn([1, 2, 3, 4]).value, sql);
});

test("testWhereLike", function () {
  const sql = '`name` LIKE "%foo%"';
  assertEquals(Where.expr("?? LIKE ?", "name", "%foo%").value, sql);
  assertEquals(Where.like("name", "%foo%").value, sql);
  assertEquals(Where.field("name").like("%foo%").value, sql);
});

test("testWhereBetween", function () {
  const sql = "`age` BETWEEN 18 AND 40";
  assertEquals(Where.expr("?? BETWEEN ? AND ?", "age", 18, 40).value, sql);
  assertEquals(Where.between("age", 18, 40).value, sql);
  assertEquals(Where.field("age").between(18, 40).value, sql);
});

test("testWhereAnd", function () {
  const sql = "(`age1` = 1 AND `age2` = 2 AND `age3` = 3)";
  assertEquals(
    Where.and(
      null, // Will be ignored
      undefined, // Will be ignored
      Where.field("age1").eq(1),
      Where.field("age2").eq(2),
      Where.field("age3").eq(3),
    ).value,
    sql,
  );
});

test("testWhereOr", function () {
  const sql = "(`age` = 1 OR `age` = 2 OR `age` = 3)";
  assertEquals(
    Where.or(
      null, // Will be ignored
      undefined, // Will be ignored
      Where.field("age").eq(1),
      Where.field("age").eq(2),
      Where.field("age").eq(3),
    ).value,
    sql,
  );
});

test("testWhereNesting", function () {
  const sql =
    '((`name` = "foo" AND `age` = 18) OR (`name` = "enok" AND (`age` > 18 AND `age` < 30)) OR `bar` IS NULL)';
  assertEquals(
    Where.or(
      Where.and(Where.field("name").eq("foo"), Where.field("age").eq(18)),
      Where.and(
        Where.field("name").eq("enok"),
        Where.and(Where.field("age").gt(18), Where.field("age").lt(30)),
      ),
      Where.isNull("bar"),
    ).value,
    sql,
  );
});

test("testWhereFrom", function () {
  const sql =
    '((`abc` = 1 AND `name` = "Enok" AND `age` = 18) OR (`id` = 1 AND `name` = "foo"))';
  Where.from({
    abc: 1,
    name: "Enok",
    age: 18,
  });
  assertEquals(
    Where.or(
      Where.from({
        abc: 1,
        name: "Enok",
        age: 18,
      }),
      Where.from({
        id: 1,
        name: "foo",
      }),
    ).value,
    sql,
  );
});
