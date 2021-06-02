abstract class DbInterface {
    abstract insert(key: number, value: string): Promise<void>;

    abstract delete(key: number): Promise<void>;

    abstract update(key: number, newValue: string): Promise<void>; // delete old value and insert new
    abstract search(key: number): Promise<void>;

    abstract createNewDatabase(fname: string): Promise<void>;
    abstract deleteDatabase(fname: string): Promise<void>;
}
