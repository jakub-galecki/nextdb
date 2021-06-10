export class Request {
    dbname: string;
    key: string ;
    value: string;
    command: string;

    constructor(dbname: string, key: string | undefined, value: string | undefined, command: string) {
        this.dbname = dbname;
        this.key = key === undefined ? "" : key;
        this.value = value === undefined ? "" : value;
        this.command = command;
    }

    isValid(): boolean {
        if (this.dbname !== undefined && this.dbname.length > 0 && this.command !== undefined && this.command.length > 0) {
            switch (this.command) {
                case "update":
                case "insert": {
                    return this.key !== undefined && this.key.length > 0 &&
                        this.value !== undefined && this.value.length > 0;
                }
                case "search":
                case "delete": {
                    return this.key !== undefined && this.key.length > 0;
                }
                case "createDb": {
                    return true;
                }
                case "deleteDb": {
                    return true;
                }
                default: {
                    return false;
                }
            }
        } else {
            return false;
        }
    }
}