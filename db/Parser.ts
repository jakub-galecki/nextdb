// input :
//         - dbname.insert(key, value)
//         - dbname.delete(key)
//         - dbname.update(key, newValue)
//         - dbname.search(key)
//         ===============================
//         - dbname.createDb
//         - dbname.deleteDb
//         return Object {comm: <command>, params: <params>}

export class Parser {
    parse(str: string) {
        const arr: string[] = str.split('.');
        const allowedCommand: string[] = ["insert", "delete", "update", "search", "createDb", "deleteDb"];
        if ((arr.length === 2) && allowedCommand.includes(arr[0])) {
            const newTxt = arr[1].split('(');
            let res: string = '';
            for (let i = 1; i < newTxt.length; i++) {
                res = newTxt[i].split(')')[0];
            }
            if (res === '') {
                return {
                    comm: arr[1],
                    dbname: arr[0],
                }
            } else {
                const params: string[] = res.split(',');
                return {
                    comm: arr[1],
                    dbname: arr[0],
                    key: params[0],
                    value: params[1],
                }
            }
        }
    }
}
