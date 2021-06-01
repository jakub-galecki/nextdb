import {BTree} from "../db/btree.ts";
import {assertEquals, assertNotEquals} from "https://deno.land/std@0.97.0/testing/asserts.ts";


Deno.test("search", () => {
    const t = new BTree("");
    Promise.all([t.insert(1, "test1"), t.insert(2, "test2"), t.insert(3, "test3"),
        t.insert(6, "test6"),
        t.insert(4, "test4"), t.insert(8, "test8"), t.insert(5, "test5"), t.insert(7, "test7")]).then(async () => {
        const found1 = await t.search(1);
        assertEquals(found1, "test1");
        const found2 = await t.search(8);
        assertEquals(found2, "test8");
    })
});

Deno.test("delete", () => {
    const t = new BTree("");
    Promise.all([t.insert(1, "test1"), t.insert(2, "test2"), t.insert(3, "test3"),
        t.insert(6, "test6"),
        t.insert(4, "test4"), t.insert(8, "test8"), t.insert(5, "test5"), t.insert(7, "test7")]).then(async () => {
        // todo: change to assertEqualsThrows
        const beforeDelete = t.search(8);
        t.delete(8).then(async () => {
            assertNotEquals(beforeDelete, await t.search(8));
        });

        const beforeDeleteArr = [await t.search(1), await t.search(2), await t.search(3)];
        Promise.all([t.delete(1),
            t.delete(2),
            t.delete(3)]).then(async () => {
            assertNotEquals(beforeDeleteArr, [await t.search(1), await t.search(2), await t.search(3)])
        })

    })
});