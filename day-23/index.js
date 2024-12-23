const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');
function parse_input (/** @type {string} */ input) {
    const lines = input.split('\n').map(v=>v.trim());
    /** @type {Map<string,string[]>} */
    const connections = new Map();
    for (const line of lines) {
        const [lhs,rhs] = line.split('-');
        if (!connections.has(lhs)) {
            connections.set(lhs,[]);
        }
        connections.get(lhs).push(rhs);
        if (!connections.has(rhs)) {
            connections.set(rhs,[]);
        }
        connections.get(rhs).push(lhs);
    }
    return connections;
}


function parse_input_sets (/** @type {string} */ input) {
    const lines = input.split('\n').map(v=>v.trim());
    /** @type {Map<string,Set<string>} */
    const connections = new Map();
    for (const line of lines) {
        const [lhs,rhs] = line.split('-');
        if (!connections.has(lhs)) {
            connections.set(lhs,new Set());
        }
        connections.get(lhs).add(rhs);
        if (!connections.has(rhs)) {
            connections.set(rhs,new Set());
        }
        connections.get(rhs).add(lhs);
    }
    return connections;
}

module.exports.part_1 = async()=>{
    const connections = parse_input(input);
    let num = 0;
    const groups = [];
    for (const pc_a of connections.keys()) {
        for (let i=0;i<connections.get(pc_a).length;i++) {
            for (let j=0;j<connections.get(pc_a).length;j++) {
                const pc_b = connections.get(pc_a)[i];
                const pc_c = connections.get(pc_a)[j];
                if (connections.get(pc_b).includes(pc_c) || connections.get(pc_c).includes(pc_b)) {
                    const group = [pc_a,pc_b,pc_c].sort();
                    const key = group.join(',');
                    if (groups.find(v=>v.key == key) == undefined) {
                        groups.push({key, group});
                    }
                    
                }
                
            }
        }
    }

    //console.log(groups.map(v=>v.key).sort().join('\n'));

    for (const group of groups) {
        for (const pc of group.group) {
            if (pc.startsWith('t')) {
                num ++;
                break;
            }
        }
    }
    
    console.log(`${num} groups found`)
};

function bron_kerbosch(
    /** @type {Set<string} */ clique,
    /** @type {Set<string} */ potential,
    /** @type {Set<string} */ excluded,
    /** @type {Map<string,string[]>}*/ connections,
    /** @type {Set<string} */ max_clique) {
    if (potential.size == 0 && excluded.size == 0) {
        if (clique.size > max_clique.size) {
            max_clique.clear();
            for (const item of clique.values()) {
                max_clique.add(item);
            }
        }
        return;
    }
    for (const item of potential.values()) {
        clique.add(item);
        const neighbours = connections.get(item) || new Set();
        bron_kerbosch(
            clique,
            new Set([...potential.values()].filter(v=>neighbours.has(v))),
            new Set([...excluded.values()].filter(v=>neighbours.has(v))),
            connections,
            max_clique
        );
        clique.delete(item);
        potential.delete(item);
        excluded.add(item);
    }
}

function max_clique(/** @type {Map<string,string[]>}*/ connections) {
    const max = new Set();
    bron_kerbosch(new Set(), new Set(connections.keys()), new Set(), connections, max);
    return max;
}

module.exports.part_2 = async()=>{
    const connections = parse_input_sets(input);
    const computers = [...max_clique(connections).values()];
    
    

    console.log(computers.sort().join(','));
};