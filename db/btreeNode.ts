// Sources:
//  - Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein. 2009.
//        Introduction to Algorithms, Third Edition (3rd. ed.). The MIT Press.
// - https://www.geeksforgeeks.org/delete-operation-in-b-tree/

import {KeyNotFound, UndefinedParam} from './Error.ts';
import {Globals} from "./globals.ts";
import {Data} from "./data.ts";

class BTreeNode {
    globals: Globals = new Globals();
    n: number;
    leaf: boolean;
    c: BTreeNode[] = [];
    data: Data[] = [];

    constructor(n: number, leaf: boolean) {
        if (n !== undefined && leaf !== undefined) {
            this.n = n;
            this.leaf = leaf;
        } else {
            throw new UndefinedParam("Passed undefined parameter to BTreeNode constructor");
        }
    }
}


export {
    BTreeNode
}
