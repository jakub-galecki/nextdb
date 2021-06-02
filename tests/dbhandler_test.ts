import {DbHandler} from "../db/DbHandler.ts";
import {assertEquals, assertNotEquals} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import {exists} from "https://deno.land/std@0.97.0/fs/mod.ts";
import {AssertionError} from "https://deno.land/std@0.97.0/testing/asserts.ts";
// Deno.test({
//    name: "createDb",
//    async fn() {
//       const handler: DbHandler = new DbHandler();
//       await handler.createNewDatabase("testing");
//
//       const timeout = (ms: number) => {
//          return new Promise(resolve => setTimeout(resolve, ms));
//       }
//
//       const sleepExists = async () => {
//          await timeout(1000);
//          return exists('./databases/testing.json')
//       }
//
//       const exist = await sleepExists();
//       assertEquals(true, exist);
//    },
//    sanitizeResources: false,
//    sanitizeOps: false,
// });

Deno.test({
   name: "insert",
   async fn() {
      const handler: DbHandler = new DbHandler();
      await handler.insert(15, "test15", "testing");
      assertIsInFile('test15');
   },
   sanitizeResources: false,
   sanitizeOps: false,
})


function assertIsInFile(searchValue: string): void {
   const texxt = Deno.readTextFileSync('./databases/testing.json');
   console.log(texxt);
   if(!texxt.includes(searchValue)){
      throw new AssertionError(searchValue.concat(" could not be found in the file "));
   }
}