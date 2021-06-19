import { BTree } from "./btree.ts";
import { readJsonSync, writeJson } from "https://deno.land/std@0.67.0/fs/mod.ts";
import { plainToClass } from "https://jspm.dev/class-transformer";
import { ensureFile, exists } from "https://deno.land/std@0.97.0/fs/mod.ts";
import { DbExists, DbNotFound, EmptyString } from "./Error.ts";
import { Backup } from "./Backup.ts";

// import {Data} from "./data.ts";

export class DbFileHandler {
    async saveDbToFile(db: BTree, fname: string): Promise<void> {
        fname = DbFileHandler.prepareFile(fname);
        const backup = new Backup();
        const exist = await exists('./databases/'.concat(fname));
        if (exist) {
            return new Promise((resolve) => {
                backup.makeBackup(fname).then(async () => {
                    await writeJson('./databases/'.concat(fname), db);
                });
                resolve();
            });
        } else {
            return Promise.reject(new DbNotFound("Error while saving database file: could not find the database " + fname));
        }
    }

    private static prepareFile(fname: string): string {
        if (!(fname.length === 0)) {
            const jsonRegex = new RegExp('.*\.json$');
            if (!jsonRegex.test(fname)) {
                fname = fname.concat('.json');
            }
            return fname;
        } else {
            throw new EmptyString("File name cannot be empty");
        }
    }

    async readDbFromFile(fname: string): Promise<BTree> {
        fname = DbFileHandler.prepareFile(fname);
        const exist = await exists('./databases/'.concat(fname));
        if (exist) {
            return new Promise((resolve) => {
                resolve(plainToClass(BTree, readJsonSync('./databases/'.concat(fname))));
            });
        } else {
            return Promise.reject(new DbNotFound("Error while reading database file: could not find the database " + fname));
        }
    }

    async createNewDbFile(db: BTree, fname: string): Promise<void> {
        fname = DbFileHandler.prepareFile(fname);
        const exist = await exists('./databases/'.concat(fname));
        if (!exist) {
            console.log("in");
            return new Promise((resolve) => {
                ensureFile('./databases/'.concat(fname)).then(async () => {
                    await writeJson('./databases/'.concat(fname), db);
                });
                resolve();
            })
        } else {
            return Promise.reject(new DbExists("Error while creating new db file: db with the name " + fname + " already exists."));
        }
    }

    async deleteDbFile(fname: string): Promise<void> {
        fname = DbFileHandler.prepareFile(fname);
        const exist = await exists('./databases/'.concat(fname));
        if (exist) {
            Deno.remove('./databases/'.concat(fname));
            return Promise.resolve();
        } else {
            return Promise.reject(new DbExists("Error while deleting db file: db with the name " + fname + " does not exists."));
        }
    }
}