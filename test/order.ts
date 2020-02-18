import { assertEquals } from "../deps.ts";
import { Order } from "../order.ts";

Deno.test(function testOrderBuilder() {
  assertEquals(Order.by("name").desc.value, "`name` DESC");
  assertEquals(Order.by("name").asc.value, "`name` ASC");
});
