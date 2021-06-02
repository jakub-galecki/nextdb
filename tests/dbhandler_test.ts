import {DbHandler} from "../db/DbHandler.ts";
import {assertEquals} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import {exists} from "https://deno.land/std@0.97.0/fs/mod.ts";
import {AssertionError} from "https://deno.land/std@0.97.0/testing/asserts.ts";

Deno.test({
   name: "createDb",
   async fn() {
      const handler: DbHandler = new DbHandler();
      await handler.createNewDatabase("testing");

      const exist = await sleep(exists, './databases/testing.json');
      assertEquals(true, exist);
   },
   sanitizeResources: false,
   sanitizeOps: false,
});

async function sleep(fn: Function, ...args: any[]){
   const timeout = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
   }
   await timeout(1000);
   return fn(...args);
}
Deno.test({
   name: "insert",
   async fn() {
      const handler: DbHandler = new DbHandler();
      await handler.insert(15, "test15", "testing");
      await sleep(assertIsInFile, "test15");
   },
   sanitizeResources: false,
   sanitizeOps: false,
})


Deno.test({
   name: "search",
   async fn() {
      const handler: DbHandler = new DbHandler();
      const res = await handler.search(15, "testing");
      assertEquals("test15", res);
   },
   sanitizeResources: false,
   sanitizeOps: false,
})

Deno.test({
   name: "delete",
   async fn() {
      const handler: DbHandler = new DbHandler();
      await handler.insert(15, "test15", "testing");
      await sleep(assertIsNotInFile, "test15");
   },
   sanitizeResources: false,
   sanitizeOps: false,
});


Deno.test({
   name: "deleteDb",
   async fn(){
      const handler: DbHandler = new DbHandler();
      await handler.deleteDatabase("testing");
      const exist = await sleep(exists, './databases/testing.json');
      assertEquals(false, exist);
   },
   sanitizeResources: false,
   sanitizeOps: false,
})

function assertIsInFile(searchValue: string): void {
   const texxt = Deno.readTextFileSync('./databases/testing.json');
   if(!texxt.includes(searchValue)){
      throw new AssertionError(searchValue.concat(" could not be found in the file "));
   }
}
function assertIsNotInFile(searchValue: string): void {
   const texxt = Deno.readTextFileSync('./databases/testing.json');
   if(!texxt.includes(searchValue)){
      throw new AssertionError(searchValue.concat(" could not be found in the file "));
   }
}

