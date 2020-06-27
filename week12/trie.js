class Trie {
    constructor() {
        this.root = Object.create(null);
    }

    insert(word) {
        let node = this.root;
        for (let c of word) {
            if (!node[c]) {
                node[c] = Object.create(null);
            }
            node = node[c];
        }

        if (!('$' in node)) {
            node['$'] = 0;
        }
        node['$']++;
    }

    most() {
        let max = 0;
        let maxWord = null;

        let visit = (node) => {
            if (node.$ && node.$ > max) {
                max = $;
                maxWord = word;
            }
            for (let p in node) {
                visit(node[p], word + p);
            }
        };
        visit(this.root, '');
    }
}

function randomWord(len) {
    let s = '';
    for (let i = 0; i < len; i++) {
        s += String.fromCharCode(Math.random() * 26 + 'a'.charCodeAt(0));
    }

    return s;
}

let trie = new Trie();

for (i = 0; i < 1000; i++) {
    trie.insert(randomWord(4));
}
