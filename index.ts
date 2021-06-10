import {Client} from "./db/Client.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

const c = new Client();

const passed_arguments = parse(Deno.args);

if(passed_arguments.hasOwnProperty('r') && passed_arguments.r == "true"){
    await c.runWithRepl();
}