import {Response} from "./Response.ts";
import {Evaluator} from "./Eval.ts";
import {Parser} from "./Parser.ts";

export class NextDb {
    static async query(obj: object) : Promise<Response> {
        const evaluator = new Evaluator();
        const parser = new Parser();
        return await evaluator.evaluate(parser.parseObject(JSON.stringify(obj)));
    }
}