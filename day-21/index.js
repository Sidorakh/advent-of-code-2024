const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');

function parse_input(/** @type {string}*/ input) {
    return input.split('\n');
}
const coord = (x,y)=>`${x}-${y}`;
const directions = [
    {x: 0, y:-1, c: '^'},
    {x: 0, y: 1, c: 'v'},
    {x:-1, y: 0, c: '<'},
    {x: 1, y: 0, c: '>'},
]

const numpad =  {
    'X': {x: 0, y: 3},
    '0': {x: 1, y: 3},
    'A': {x: 2, y: 3},
    '1': {x: 0, y: 2},
    '2': {x: 1, y: 2},
    '3': {x: 2, y: 2},
    '4': {x: 0, y: 1},
    '5': {x: 1, y: 1},
    '6': {x: 2, y: 1},
    '7': {x: 0, y: 0},
    '8': {x: 1, y: 0},
    '9': {x: 2, y: 0}
}

const dirpad = {
    'X': {x: 0, y: 0},
    '^': {x: 1, y: 0},
    'A': {x: 2, y: 0},
    '<': {x: 0, y: 1},
    'v': {x: 1, y: 1},
    '>': {x: 2, y: 1},
}

function keypad_distance(keypad,start,end) {
    const queue = [{x: keypad[start].x, y: keypad[start].y,path:''}];
        
    let paths = [];
    const distances = new Map();
    if (start == end) {
        return ['A'];
    }
    while (queue.length > 0) {
        const node = queue.shift();
        
        if (node.x == keypad[end].x && node.y == keypad[end].y) {
            paths.push(node.path + 'A');
            continue;
        }
        if ((distances.get(coord(node.x,node.y) ?? Infinity) < node.path.length)) {
            continue;
        }

        distances.set(coord(node.x,node.y),node.path.length);

        for (const dir of directions) {
            const nx = node.x + dir.x;
            const ny = node.y + dir.y;
            if (keypad.X.x == nx && keypad.X.y == ny) {
                continue;
            }

            const btn = Object.values(keypad).find(v=>v.x == nx && v.y == ny);
            if (btn) {
                queue.push({
                    x: nx, y: ny,
                    path: node.path + dir.c,
                })
            }
        }
    }
    return paths;
}

const cache = new Map()
function get_presses(pad,code,robot) {
    const key = `${robot}-${code}`;
    if (cache.get(key) != undefined) return cache.get(key);

    let btn = 'A'
    let length = 0;
    for (const char of code) {
        const move_list = keypad_distance(pad,btn,char);
        if (robot == 0) {
            length += move_list[0].length;
        } else {
            const move_mapped = move_list.map(v=>get_presses(dirpad, v, robot-1));
            length += Math.min(...move_mapped);
        }
        btn = char;

    }
    cache.set(key,length);
    return length;
    
}

module.exports.part_1 = async()=>{
    const codes = parse_input(input);

    let complexity_total = 0;
    for (const code of codes) {
        const num = parseInt(code.slice(0,-1));
        const keys = get_presses(numpad,code,2);
        complexity_total += num * keys;
    }

    console.log(`Total complexity: ${complexity_total}`);
};

module.exports.part_2 = async()=>{
    const codes = parse_input(input);

    let complexity_total = 0;
    for (const code of codes) {
        const num = parseInt(code.slice(0,-1));
        const keys = get_presses(numpad,code,25);
        complexity_total += num * keys;
    }

    console.log(`Total complexity: ${complexity_total}`);
};