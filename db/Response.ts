export class Response{
    status: string;
    found: string;
    constructor(status: string, found: string) {
        this.status = status;
        this.found = found;
    }
}