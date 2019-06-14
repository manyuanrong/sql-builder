# Where

### `Where.from(data: Object)`

Object convert to where conditions

```ts
Where.form({
  name: "foo",
  password: "bar",
  type: 1
});
// (`name` = "foo" AND `password` = "bar" AND `type` = 1)
```

### `Where.expr(expr: string, ...params: any[])`

Replace `placeholder` in `expression`

- `"??"` is an identifier placeholder. It will be replaced by something like "\`value\`"
- `"?"` is a value placeholder. It will be replaced with a value wrapped in a delimiter appropriate for the value type

```ts
Where.expr("?? = ? AND ?? = ?", "name", "foo", "user.age", 10);
// `name` = "foo" AND `user`.`age` = 10
```

### Where.operator(field: string, value(s): any)

Common expression operators. eg. `Where.eq()`

- `eq` => `=`
- `nq` => `!=`
- `gt` => `>`
- `lt` => `<`
- `gte` => `>=`
- `lte` => `<=`
- `isNull` => `IS NULL`
- `notNull` => `NOT NULL`
- `in` => `IN`
- `notIn` => `NOT IN`
- `between` => `BETWEEN ? AND ?`

### Where.filed(field: string)

Operator helper.

```ts
Where.filed("name").eq("foo");
// `name` = "foo"
Where.field("age").gt(18);
// `age` > 18
```

### `Where.and(...conditions: Where[])` | `Where.or(...conditions: Where[])`

Joint multiple conditions

```ts
Where.and(
  Where.field("name").eq("foo"),
  Where.or(Where.field("age").gt(18), Where.field("age").lt(10))
);
// (`name` = "foo" AND (`age` > 18 OR `age` < 10))
```
