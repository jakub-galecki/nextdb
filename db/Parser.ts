// input :
//         - dbname.insert(key, value)
//         - dbname.delete(key)
//         - dbname.update(key, newValue)
//         - dbname.search(key)
//         ===============================
//         - dbname.createDb
//         - dbname.deleteDb
//         return Object {comm: <command>, params: <params>}
import {Request} from "./Request.ts";
import {ParseError} from "./Error.ts";


export class Parser {
    parseString(str: string) {
        const arr: string[] = str.split('.');
        const dbname: string = arr[0];
        const params: string = arr[1].split('(').slice(1).toString().replace(")", "");
        const command: string = arr[1].split('(').slice(0, 1).toString();

        if (dbname.length !== 0) {
            const tmp: string[] = params.split(',');
            const key: string | undefined = tmp[0];
            const value: string | undefined = tmp[1];
            return new Request(dbname, key, value, command);
        } else {
            throw  new ParseError("Invalid command");
        }
    }

    // {
    //   dbname: "dbname",
    //   command: "someCommand",
    //   key: "key",
    //   value: "value"
    //  }

    parseObject(str: string) {
        if(str) {
            try {
                const obj: Object = JSON.parse(str);
                const properties: string[] = ["dbname", "key", "value", "command"];
                properties.forEach((property) => {
                    if(!obj.hasOwnProperty(property)){
                        throw new  ParseError("Invalid object: couldn't find " + property);
                    }
                });
                // @ts-ignore
                const {key, value, command, dbname} = obj;
                return new Request(dbname, key,value, command);
            } catch (e) {
                throw new ParseError(e.parseString());
            }
        } else {
            throw  new ParseError("Received empty request");
        }
    }
}
