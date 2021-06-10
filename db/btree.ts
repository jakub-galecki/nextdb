// Sources:
//  - Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein. 2009.
//        Introduction to Algorithms, Third Edition (3rd. ed.). The MIT Press.

import {BTreeNode} from "./btreeNode.ts";
import {Globals} from "./globals.ts"
import {Data} from "./data.ts";
import {DeleteFromEmpty} from './Error.ts';



export class BTree {
    fname: string;
    globals: Globals = new Globals();
    // @ts-ignore
    root: BTreeNode = null;

    constructor(fname: string) {
        this.fname = fname;
    }

    async search(k: number, x: BTreeNode = this.root): Promise<string> {
        let i = 0;
        while (i < x.n && k > x.data[i].key) {
            i = i + 1;
        }
        if (i < x.n && k == x.data[i].key) {
            return x.data[i].value;
        } else if (x.leaf) {
            return ""; // throw error
        }
        return this.search(k, x.c[i]);
    }

    async insert(key: number, value: string): Promise<void> {
        const dataToInsert = new Data(key, value);
        if (this.root === null) {
            this.root = new BTreeNode(0, true);
            this.root.data[0] = dataToInsert;
            this.root.n += 1;
        } else {
            const r = this.root;
            const {n} = this.root;
            if (n === (2 * this.globals.t) - 1) {
                const s = new BTreeNode(0, false);
                this.root = s;
                s.c[0] = r;
                this.splitChild(s, 0, r);
                this.insertNonFull(s, dataToInsert);
            } else {
                this.insertNonFull(r, dataToInsert);
            }
        }
    }

    print(x: BTreeNode = this.root): void {
        let i = 0;
        for (; i < x.n; i++) {
            if (!x.leaf) {
                this.print(x.c[i]);
            }
            console.log("%v: %v",x.data[i].key, x.data[i].value);
        }

        if (x.leaf == false) {
            this.print(x.c[i]);
        }
    }

    async delete(key: number): Promise<void> {
        if (this.root == null) {
            throw new DeleteFromEmpty("Trying to delete key " + key + " from empty tree");
        }

        await this.root.deleteKey(key);

        if (this.root.n === 0) {
            if (this.root.leaf) {
                // @ts-ignore
                this.root = null;
            } else {
                this.root = this.root.c[0];
            }
        }
    }

    splitChild(x: BTreeNode, i: number, y: BTreeNode): void {
        let t = this.globals.t
        let z = new BTreeNode(t - 1, y.leaf);
        // y = x.c[i]; ?
        for (let j = 0; j < t - 1; j++) {
            z.data[j] = y.data[j + t];
        }

        if (!y.leaf) {
            for (let j = 0; j < t; j++) {
                z.c[j] = y.c[j + t];
            }
        }
        y.n = t - 1;
        for (let j = x.n; j >= i + 1; j--) {
            x.c[j + 1] = x.c[j];
        }
        x.c[i + 1] = z;
        for (let j = x.n; j >= i; j--) {
            x.data[j + 1] = x.data[j];
        }
        x.data[i] = y.data[t - 1];
        x.n = x.n + 1;
    }

     insertNonFull(x: BTreeNode, d: Data) {
        let i = x.n - 1;
        if (x.leaf) {
            while (i >= 0 && d.key < x.data[i].key) {
                x.data[i + 1] = x.data[i];
                i -= 1;
            }
            x.data[i + 1] = d;
            x.n += 1;
        } else {
            while (i >= 0 && d.key < x.data[i].key) {
                i -= 1;
            }
            i += 1;
            if (x.c[i].n === (2 * this.globals.t) - 1) {
                this.splitChild(x, i, x.c[i]);
                if (d.key > x.data[i].key) {
                    i += 1;
                }
            }
            this.insertNonFull(x.c[i], d);
        }
    }
}