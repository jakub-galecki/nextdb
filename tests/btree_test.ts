import {BTree} from "../db/btree.ts";
import { assertEquals, assertNotEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";


Deno.test("search", () => {
    const t = new BTree();
    t.insert(1, "test1");
    t.insert(2, "test2");
    t.insert(3, "test3");
    t.insert(4, "test4");
    t.insert(5, "test5");
    t.insert(6, "test6");
    t.insert(7, "test7");
    t.insert(8, "test8");
    const found1 = t.search(1);
    assertEquals(found1, "test1");
    const found2 = t.search(8);
    assertEquals(found2, "test8");
});

Deno.test("delete", () => {

    const t = new BTree();

    t.insert(1, "test1");
    t.insert(2, "test2");
    t.insert(3, "test3");
    t.insert(6, "test6");
    t.insert(4, "test4");
    t.insert(8, "test8");
    t.insert(5, "test5");
    t.insert(7, "test7");
    // todo: change to assertEqualsThrows
    const beforeDelete = t.search(8);
    t.delete(8);
    assertNotEquals(beforeDelete, t.search(8));

    const beforeDeleteArr = [t.search(1), t.search(2), t.search(3)];
    t.delete(1);
    t.delete(2);
    t.delete(3);
    assertNotEquals(beforeDeleteArr, [t.search(1), t.search(2), t.search(3)])
});