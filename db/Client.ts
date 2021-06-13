import {Repl} from "./repl.ts";
import {Parser} from "./Parser.ts";
import {Evaluator} from "./Eval.ts";

export class Client {
    async runWithRepl(): Promise<void> {
        const r: Repl = new Repl();
        const p = new Parser();
        const e = new Evaluator();

        while (true) {
            let req = await r.read();
            let parsed =  p.parseString(req);
            // console.log(parsed);
            console.log(await e.evaluate(parsed));
        }
    }
}
