import {DbHandler} from "./db/DbHandler.ts";

const handler: DbHandler = new DbHandler();
const texxt = Deno.readTextFileSync('./databases/testing.json');
console.log(texxt);
