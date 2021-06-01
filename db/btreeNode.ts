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

    delete(key: number): void {
        let i = this.findInTree(key);

        if (this.n > i && this.data[i].key == key) {
            if (this.leaf) {
                this.deleteFromLeaf(i);
            } else {
                this.deleteFromNonLeaf(i);
            }
        } else {
            if (this.leaf) {
                throw new KeyNotFound("Error in delete: could not find the key " + key + " in the tree");
            }
            const end = i === this.n;

            if (this.c[i].n < this.globals.t) {
                this.fill(i);
            }

            if (end && i > this.n) {
                this.c[i - 1].delete(key);
            } else {
                this.c[i].delete(key);
            }
        }
    }

    private deleteFromLeaf(i: number): void {
        for (let j = i + 1; j < this.n; j++) {
            this.data[j - 1] = this.data[j];
        }
        this.n -= 1;
    }

    private deleteFromNonLeaf(i: number): void {
        let k: Data = this.data[i];

        if (this.c[i].n >= this.globals.t) {
            const pred: Data = this.getPredecessor(i);
            this.data[i] = pred;
            this.c[i].delete(pred.key);
        } else if (this.c[i + 1].n >= this.globals.t) {
            const succ: Data = this.getSuccessor(i);
            this.data[i] = succ;
            this.c[i + 1].delete(succ.key);
        } else {
            this.merge(i);
            this.c[i].delete(k.key);
        }
    }

    private getSuccessor(i: number): Data {
        let current = this.c[i + 1];
        while (!current.leaf) {
            current = current.c[0];
        }
        return current.data[0];
    }

    private getPredecessor(i: number): Data {
        let current = this.c[i];
        while (!current.leaf) {
            current = current.c[current.n];
        }
        return current.data[current.n - 1];
    }

    private fill(i: number): void {
        if (i != 0 && this.c[i - 1].n >= this.globals.t) {
            this.borrowFromPrevious(i);
        } else if (i != this.n && this.c[i + 1].n >= this.globals.t) {
            this.borrowFromNext(i);
        } else {
            if (i != this.n) {
                this.merge(i);
            } else {
                this.merge(i - 1);
            }
        }
    }

    private borrowFromPrevious(i: number): void {
        let child = this.c[i];
        let sib = this.c[i - 1];

        for (let j = child.n - 1; j >= 0; j--) {
            child.data[j + 1] = child.data[j];
        }

        if (!child.leaf) {
            for (let j = child.n; j >= 0; j--) {
                child.c[j + 1] = child.c[j];
            }
        }

        child.data[0] = this.data[i - 1];

        if (!child.leaf) {
            child.c[0] = sib.c[sib.n - 1];
        }

        this.data[i - 1] = sib.data[sib.n - 1];

        child.n += 1;
        sib.n -= 1;
    }


    private borrowFromNext(i: number): void {
        let child = this.c[i];
        let sib = this.c[i + 1];

        child.data[child.n] = this.data[i];

        if (!child.leaf) {
            child.c[child.n + 1] = sib.c[0];
        }

        this.data[i] = sib.data[0];

        for (let j = 1; j < sib.n; i++) {
            sib.data[j - 1] = sib.data[j];
        }

        if (!sib.leaf) {
            for (let j = 1; j <= sib.n; j++) {
                sib.c[j - 1] = sib.c[j];
            }
        }

        child.n += 1;
        sib.n -= 1;
    }

    private merge(i: number): void {
        let child = this.c[i];
        let sib = this.c[i + 1];

        child.data[this.globals.t - 1] = this.data[i];

        for (let j = 0; j < sib.n; j++) {
            child.data[j + this.globals.t] = sib.data[j];
        }

        if (!child.leaf) {
            for (let j = 0; j <= sib.n; j++) {
                child.c[j + this.globals.t] = sib.c[j];
            }
        }

        for (let j = i + 1; j < this.n; j++) {
            this.data[j - 1] = this.data[j];
        }

        for (let j = i + 2; j <= this.n; j++) {
            this.c[j - 1] = this.c[j];
        }

        child.n += sib.n + 1;
        this.n -= 1;
    }

    private findInTree(key: number): number {
        let i = 0;
        while (i < this.n && key > this.data[i].key) {
            i += 1;
        }
        return i;
    }

}


export {
    BTreeNode
}