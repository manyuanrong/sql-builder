import { assertEquals } from "../deps.ts";
import { Order } from "../order.ts";

const { test } = Deno;

test("testOrderBuilder", function () {
  assertEquals(Order.by("name").desc.value, "`name` DESC");
  assertEquals(Order.by("name").asc.value, "`name` ASC");
});
