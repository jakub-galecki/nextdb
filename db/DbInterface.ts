abstract class DbInterface {
    abstract insert(key: number, value: string): void;

    abstract delete(key: number): void;

    abstract update(key: number, newValue: string): void; // delete old value and insert new
    abstract search(key: number): void;

    abstract createNewDatabase(fname: string): void;
}
