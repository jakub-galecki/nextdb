// Sources:typescript
//  - Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein. 2009.
//        Introduction to Algorithms, Third Edition (3rd. ed.). The MIT Press.

import {BTreeNode} from "./btreeNode.ts";
import {Globals} from "./globals.ts"
import {Data} from "./data.ts";
import {DeleteFromEmpty, KeyNotFound} from './Error.ts';

export class BTree {
    fname: string;
    globals: Globals = new Globals();
    // @ts-ignore
    root: BTreeNode = null;

    constructor(fname: string) {
        this.fname = fname;
    }

    search(k: number, x: BTreeNode = this.root): string {
        let i = 0;
        while (i < x.n && k > x.data[i].key) {
            i = i + 1;
        }
        if (i < x.n && k == x.data[i].key) {
            return x.data[i].value;
        } else if (x.leaf) {
            return ""; // TODO: reject.
        }
        return this.search(k, x.c[i]);
    }

    insert(key: number, value: string): void {
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

    delete(key: number): void {
        if (this.root == null) {
            throw new DeleteFromEmpty("Trying to delete key " + key + " from empty tree");
        }

        this.deleteFromTree(this.root, key);

        if (this.root.n === 0) {
            if (this.root.leaf) {
                // @ts-ignore
                this.root = null;
            } else {
                this.root = this.root.c[0];
            }
        }
    }

    deleteFromTree(treeNode: BTreeNode,key: number): void {
        const i = this.findInTree(treeNode, key);

        if (treeNode.n > i && treeNode.data[i].key == key) {
            if (treeNode.leaf) {
                this.deleteFromLeaf(treeNode, i);
            } else {
                this.deleteFromNonLeaf(treeNode, i);
            }
        } else {
            if (treeNode.leaf) {
                throw new KeyNotFound("Error in delete: could not find the key " + key + " in the tree");
            }
            const end = i === treeNode.n;

            if (treeNode.c[i].n < treeNode.globals.t) {
                this.fill(treeNode, i);
            }

            if (end && i > treeNode.n) {
                this.deleteFromTree(treeNode.c[i - 1], key);
            } else {
                this.deleteFromTree(treeNode.c[i],key);

            }
        }
    }


    private deleteFromNonLeaf(treeNode: BTreeNode,i: number): void {
        const k: Data = treeNode.data[i];

        if (treeNode.c[i].n >= treeNode.globals.t) {
            const pred: Data = this.getPredecessor(treeNode, i);
            treeNode.data[i] = pred;
            this.deleteFromTree(treeNode.c[i],pred.key);
        } else if (treeNode.c[i + 1].n >= treeNode.globals.t) {
            const succ: Data = this.getSuccessor(treeNode, i);
            treeNode.data[i] = succ;
            this.deleteFromTree(treeNode.c[i + 1],succ.key);
        } else {
            this.merge(treeNode,i);
            this.deleteFromTree(treeNode.c[i], k.key);
        }
    }

    private deleteFromLeaf(treeNode: BTreeNode, i: number): void {
        for (let j = i + 1; j < treeNode.n; j++) {
            treeNode.data[j - 1] = treeNode.data[j];
        }
        treeNode.n -= 1;
    }

    splitChild(x: BTreeNode, i: number, y: BTreeNode): void {
        const t = this.globals.t
        const z = new BTreeNode(t - 1, y.leaf);
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

    private getSuccessor(treeNode: BTreeNode,i: number): Data {
        let current = treeNode.c[i + 1];
        while (!current.leaf) {
            current = current.c[0];
        }
        return current.data[0];
    }

    private getPredecessor(treeNode: BTreeNode,i: number): Data {
        let current = treeNode.c[i];
        while (!current.leaf) {
            current = current.c[current.n];
        }
        return current.data[current.n - 1];
    }

    private fill(treeNode: BTreeNode,i: number): void {
        if (i != 0 && treeNode.c[i - 1].n >= treeNode.globals.t) {
            this.borrowFromPrevious(treeNode,i);
        } else if (i != treeNode.n && treeNode.c[i + 1].n >= treeNode.globals.t) {
            this.borrowFromNext(treeNode, i);
        } else {
            if (i != treeNode.n) {
                this.merge(treeNode,i);
            } else {
                this.merge(treeNode,i - 1);
            }
        }
    }

    private borrowFromPrevious(treeNode: BTreeNode,i: number): void {
        const child = treeNode.c[i];
        const sib = treeNode.c[i - 1];

        for (let j = child.n - 1; j >= 0; j--) {
            child.data[j + 1] = child.data[j];
        }

        if (!child.leaf) {
            for (let j = child.n; j >= 0; j--) {
                child.c[j + 1] = child.c[j];
            }
        }

        child.data[0] = treeNode.data[i - 1];

        if (!child.leaf) {
            child.c[0] = sib.c[sib.n];
        }

        treeNode.data[i - 1] = sib.data[sib.n - 1];

        child.n += 1;
        sib.n -= 1;
    }

    private borrowFromNext(treeNode: BTreeNode,i: number): void {
        const child = treeNode.c[i];
        const sib = treeNode.c[i + 1];

        child.data[child.n] = treeNode.data[i];

        if (!child.leaf) {
            child.c[child.n + 1] = sib.c[0];
        }

        treeNode.data[i] = sib.data[0];

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

    private merge(treeNode: BTreeNode,i: number): void {
        const child = treeNode.c[i];
        const sib = treeNode.c[i + 1];

        child.data[treeNode.globals.t - 1] = treeNode.data[i];

        for (let j = 0; j < sib.n; j++) {
            child.data[j + treeNode.globals.t] = sib.data[j];
        }

        if (!child.leaf) {
            for (let j = 0; j <= sib.n; j++) {
                child.c[j + treeNode.globals.t] = sib.c[j];
            }
        }

        for (let j = i + 1; j < treeNode.n; j++) {
            treeNode.data[j - 1] = treeNode.data[j];
        }

        for (let j = i + 2; j <= treeNode.n; j++) {
            treeNode.c[j - 1] = treeNode.c[j];
        }

        child.n += sib.n + 1;
        treeNode.n -= 1;
    }

    private findInTree(treeNode: BTreeNode,key: number): number {
        let i = 0;
        while (i < treeNode.n && key > treeNode.data[i].key) {
            i += 1;
        }
        return i;
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
