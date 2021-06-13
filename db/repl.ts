import { readLines } from "https://deno.land/std@0.79.0/io/bufio.ts";
import {Parser} from "./Parser.ts";
import {Request} from "./Request.ts";

export class Repl {
    parser: Parser = new Parser();
    async read() : Promise<string> {
        const encoder = new TextEncoder();
        await Deno.stdout.write(encoder.encode("$ "));
        return (await readLines(Deno.stdin).next()).value.trim()

    }
}
