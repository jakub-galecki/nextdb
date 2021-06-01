class UndefinedParam extends Error {
    constructor(m: string) {
        super(m);
        this.name = "UndefinedParameter"
    }
}

class DeleteFromEmpty extends Error{
    constructor(m: string) {
        super(m);
        this.name = "DeleteFromEmpty";
    }
}

class KeyNotFound extends Error{
    constructor(m: string) {
        super(m);
        this.name="KeyNotFound"
    }
}

export {
    UndefinedParam,
    DeleteFromEmpty,
    KeyNotFound
}