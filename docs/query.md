# Query

SQL Query Builder

### table(name: string)

set table name

### order(...orders: Order[])

set orders

### where(where:Where|string)

add where condition by sql string or Where object

### having(where:Where|string)

add having condition by sql string or Where object

### limit(start:number,end:number)

set limit range

### groupBy(...fields: string[])

set group by fields

### join(join: Join | string) {

add join

### select(...fields: string[])

set select fields

```ts
new Query()
  .table("articles")
  .select("articles.*", "users.name")
  .join(Join.left("users").on("users.id", "articles.user_id"))
  .where(Where.field("type").eq(1))
  .order(Order.by("articles.created_at").desc)
  .limit(0, 10)
  .build();
// SELECT `articles`.*, `users`.`name` FROM `articles` LEFT OUTER JOIN `users` ON `users`.`id` = `articles`.`user_id` WHERE `type` = 1 ORDER BY `articles`.`created_at` DESC LIMIT 0, 10
```

## insert(data: Object[] | Object)

set one or more insert data object(s)

```ts
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

// INSERT INTO `users` (`name`,`password`,`id`) VALUES ("Enok","foo",1) ("Man","bar",2)
```

### update(data: Object)

set update data

```ts
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

// UPDATE `users` SET `name` = "Enok", `password` = "foo", `id` = 1 WHERE `id` = 1 AND `name` LIKE "%n%"
```

### delete()

set sql type to delete

```ts
const builder = new Query();
const sql = builder
  .table("users")
  .where(Where.field("id").eq(1))
  .where(Where.field("name").like("%n%"))
  .delete()
  .build();

//DELETE FROM `users` WHERE `id` = 1 AND `name` LIKE "%n%"
```

### build(): string

Generate and return SQL
