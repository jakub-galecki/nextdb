import {Client, parse, Response, NextDb} from "./depts.ts";

const c = new Client();

const passed_arguments = parse(Deno.args);

if(passed_arguments.hasOwnProperty('r') && passed_arguments.r == "true"){
    await c.runWithRepl();
}

export function query(obj: Object): Promise<Response> {
    return NextDb.query(obj);
}