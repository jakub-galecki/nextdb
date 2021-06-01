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
export {
    UndefinedParam,
    DeleteFromEmpty,
    KeyNotFound,
    DbNotFound,
    DbExists,
    EmptyString
}