import {DbInterface} from "../DbInterface.ts"
import {BTree} from "../btree.ts";
import {DbFileHandler} from "./DbFileHandler.ts";

export class DbHandler implements DbInterface {
     fhandler: DbFileHandler = new DbFileHandler();

     insert(key: number, value: string): void{

     }

     delete(key: number): void{

     }

     update(key: number, newValue: string): void{

     }

     search(key: number): void{

     }

     async createNewDatabase(fname: string): Promise<void>{
          const b = new BTree(fname);
          return await this.fhandler.createNewDbFile(b, fname);
     }
}