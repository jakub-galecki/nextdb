import {Request} from "./Request.ts";
import {Response} from "./Response.ts";
// import {EvalError} from "./Error.ts";
import {DbHandler} from "./DbHandler.ts";

export class Evaluator {
    async evaluate(req: Request): Promise<Response> {
        let resMessage: string;
        let found = '';
        if(req.isValid()){
            try {
                const handler: DbHandler = new DbHandler();
                switch (req.command) {
                    case "update": {
                        await handler.update(parseInt(req.key), req.value, req.dbname);
                        break;
                    }
                    case "insert": {
                        await handler.insert(parseInt(req.key), req.value, req.dbname);
                       break;
                    }
                    case "search": {
                        found = await handler.search(parseInt(req.key), req.dbname);
                        break;
                    }
                    case "delete": {
                        await handler.delete(parseInt(req.key), req.dbname);
                        break
                    }
                    case "createDb": {
                        await handler.createNewDatabase(req.dbname);
                        break
                    }
                    case "deleteDb": {
                        await handler.deleteDatabase(req.dbname);
                        break
                    }
                }
                resMessage = "OK";
            } catch (e) {
                resMessage = e;
            }
        } else {
            resMessage = "ERROR: invalid request";
        }
        return new Response(resMessage, found);
    }
}