import fs from 'node:fs';
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";

interface Graph {
    filePaths: string;
    deps: string[];
}
function createAssets(filePath: string) {
    const assets = fs.readFileSync(filePath, 'utf8');
    const ast = parser.parse(assets, {
        sourceType: 'unambiguous',
    });
    const deps: string[] = []
    traverse(ast, {
        ImportDeclaration(path) {
            deps.push(path.node.source.value)
        }
    })
    return {
        filePath,
        deps,
    }
}
// const graph = createAssets('./a.js')

function creatGraph(path: string) {
    const graph = createAssets(path)
    const queue = [graph]
    for (const assets of queue) {
        assets.deps.forEach((deps) => {
            const child = createAssets(deps)
            queue.push(child)
        })
    }
    return queue
}

creatGraph('./a.js')
