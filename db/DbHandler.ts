import {DbInterface} from "./DbInterface.ts"
import {BTree} from "./btree.ts";
import {DbFileHandler} from "./DbFileHandler.ts";

export class DbHandler implements DbInterface {
     fhandler: DbFileHandler = new DbFileHandler();

     async insert(key: number, value: string, dbname: string): Promise<void>{
          const b =  await this.fhandler.readDbFromFile(dbname);
          b.insert(key, value).then(async () => {
               await this.fhandler.saveDbToFile(b, dbname);
          });
     }

     async delete(key: number, dbname: string): Promise<void>{
          const b =  await this.fhandler.readDbFromFile(dbname);
          b.delete(key).then(async () => {
               return await this.fhandler.saveDbToFile(b, dbname);
          });
     }

     async update(key: number, newValue: string, dbname: string): Promise<void>{
          const b =  await this.fhandler.readDbFromFile(dbname);
          Promise.all([await b.delete(key), await b.insert(key, newValue)]).then(async () => {
               return await this.fhandler.saveDbToFile(b, dbname);
          });
     }

     async search(key: number, dbname: string): Promise<string>{
          const b =  await this.fhandler.readDbFromFile(dbname);
          return b.search(key);
     }

     async createNewDatabase(dbname: string): Promise<void>{
          const b = new BTree(dbname);
          await this.fhandler.createNewDbFile(b, dbname);
     }
}