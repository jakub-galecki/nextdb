class UndefinedParam extends Error {
    constructor(m: string) {
        super(m);
        this.name = "UndefinedParameter"
    }
}

class DeleteFromEmpty extends Error {
    constructor(m: string) {
        super(m);
        this.name = "DeleteFromEmpty";
    }
}

class KeyNotFound extends Error {
    constructor(m: string) {
        super(m);
        this.name = "KeyNotFound"
    }
}
class ParseError extends  Error {
    constructor(m: string) {
        super(m);
        this.name = "ParseError";
    }
}

class DbNotFound extends Error {
    constructor(m: string) {
        super(m);
        this.name = "DbNotFound";
    }
}

class DbExists extends Error {
    constructor(m: string) {
        super(m);
        this.name = "DbAlreadyExists";
    }
}

class EmptyString extends Error {
    constructor(m: string) {
        super(m);
        this.name="EmptyString"
    }
}

class EvalError extends  Error {
    constructor(m: string) {
        super(m);
        this.name="EvalError"
    }
}
export {
    EvalError,
    ParseError,
    UndefinedParam,
    DeleteFromEmpty,
    KeyNotFound,
    DbNotFound,
    DbExists,
    EmptyString
}