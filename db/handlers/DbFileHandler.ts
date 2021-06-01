import {BTree} from "../btree.ts";
import {readJsonSync, writeJson} from "https://deno.land/std@0.67.0/fs/mod.ts";
import {plainToClass} from "https://jspm.dev/class-transformer@0.2.3";
import {ensureFile, exists} from "https://deno.land/std@0.97.0/fs/mod.ts";
import {DbExists, DbNotFound, EmptyString} from "../Error.ts";

export class DbFileHandler {
    async saveDbToFile(db: BTree, fname: string): Promise<void> {
        fname = this.prepareFile(fname);
        if (exists('./databases/'.concat(fname))) {
            return writeJson(fname, db);
        } else {
            throw new DbNotFound("Error while saving database file: could not find the database " + fname);
        }
    }

    private prepareFile(fname: string): string {
        if (!(fname.length === 0)) {
            const jsonRegex: RegExp = new RegExp('.*\.json$');
            if (!jsonRegex.test(fname)) {
                fname = fname.concat('.json');
            }
            return fname;
        } else {
            throw new EmptyString("File name cannot be empty");
        }
    }

    async readDbFromFile(fname: string): Promise<BTree> {
        fname = this.prepareFile(fname);
        if (exists('./databases/'.concat(fname))) {
            return plainToClass(BTree, readJsonSync(fname));
        } else {
            throw new DbNotFound("Error while reading database file: could not find the database " + fname);
        }
    }

    async createNewDbFile(db: BTree, fname: string): Promise<void> {
        fname = this.prepareFile(fname);
        if (!exists('./databases/'.concat(fname))) {
            ensureFile('./databases/'.concat(fname)).then(async () => {
                return writeJson('./databases/'.concat(fname), db);
            });
        } else {
            throw new DbExists("Error while creating new db file: db with the name " + fname + " already exists.");
        }
    }

    async deleteDbFile(fname: string): Promise<void> {
        fname = this.prepareFile(fname);
        if (!exists('./databases/'.concat(fname))) {
            return Deno.remove('./databases/'.concat(fname));
        } else {
            throw new DbExists("Error while deleting db file: db with the name " + fname + " already exists.");
        }
    }
}