const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');
const Grid = require('../grid.js');

const fwd_cost = 1;
const turn_cost = 1000;


const coord = (x,y)=>`${x}-${y}`;
function get_smallest_node(/** @type {Map<String,number>}*/ map) {
    let min = '';
    for (const key of map.keys()) {
        if (map.get(key) < map.get(min) || min == '') {
            min = key;
        }
    }
    return min;
}


module.exports.part_1 = async()=>{
    const maze = new Grid(input.split('\n'));
    const start = {
        x: 0,
        y: 0
    };
    const target = {
        x: 0,
        y: 0,
    };
    const directions = [
        {x: 1, y:0},        // east
        {x: 0, y: 1},       // south
        {x: -1, y: 0},      // west
        {x: 0, y: -1},      // north
    ];
    for (let x=0;x<maze.width();x++) {
        for (let y=0;y<maze.height();y++) {
            if (maze.get(x,y) == 'S') {
                start.x = x;
                start.y = y;
                maze.set(x,y,'.');
            }
            if (maze.get(x,y) == 'E') {
                target.x = x;
                target.y = y
                maze.set(x,y,'.');
            }
        }
    }

    const visited = {}
    let stack = [{x: start.x, y: start.y, direction: 0, path: [], score: 0}]
    let finished = [];
    let minimum = Infinity;
    let node;
    while (node = stack.shift()) {
        node.path.push(coord(node.x,node.y));
        if (node.x == target.x && node.y == target.y) {
            if (node.score < minimum) {
                finished = [];
                minimum = node.score;
            };
            if (node.score == minimum) finished.push(node.path);
            continue;
        }

        let key = coord(node.x,node.y) + `-${node.direction}`;
        if (visited[key] < node.score) continue;
        visited[key] = node.score;
        if (node.score > minimum) continue;

        let current = directions[node.direction];
        for (let i=0;i<directions.length;i++) {
            const dir = directions[i];
            // no u-turns allowed!
            if (dir.x == -current.x && dir.y == -current.y) continue;
            const nx = node.x + dir.x;
            const ny = node.y + dir.y;
            if (maze.get(nx,ny) == '#') continue;
            stack.push({
                x: nx,
                y: ny,
                direction: i,
                path: node.path.slice(),
                score: node.score + (i == node.direction ? 1 : 1001)
            });
        };
    }
    console.log(`Minimum score: ${minimum}`);
};

module.exports.part_2 = async()=>{
    const maze = new Grid(input.split('\n'));
    const start = {
        x: 0,
        y: 0
    };
    const target = {
        x: 0,
        y: 0,
    };
    const directions = [
        {x: 1, y:0},        // east
        {x: 0, y: 1},       // south
        {x: -1, y: 0},      // west
        {x: 0, y: -1},      // north
    ];
    for (let x=0;x<maze.width();x++) {
        for (let y=0;y<maze.height();y++) {
            if (maze.get(x,y) == 'S') {
                start.x = x;
                start.y = y;
                maze.set(x,y,'.');
            }
            if (maze.get(x,y) == 'E') {
                target.x = x;
                target.y = y
                maze.set(x,y,'.');
            }
        }
    }

    const visited = {}
    let stack = [{x: start.x, y: start.y, direction: 0, path: [], score: 0}]
    let finished = [];
    let minimum = Infinity;
    let node;
    while (node = stack.shift()) {
        node.path.push(coord(node.x,node.y));
        if (node.x == target.x && node.y == target.y) {
            if (node.score < minimum) {
                finished = [];
                minimum = node.score;
            };
            if (node.score == minimum) finished.push(node.path);
            continue;
        }

        let key = coord(node.x,node.y) + `-${node.direction}`;
        if (visited[key] < node.score) continue;
        visited[key] = node.score;
        if (node.score > minimum) continue;

        let current = directions[node.direction];
        for (let i=0;i<directions.length;i++) {
            const dir = directions[i];
            // no u-turns allowed!
            if (dir.x == -current.x && dir.y == -current.y) continue;
            const nx = node.x + dir.x;
            const ny = node.y + dir.y;
            if (maze.get(nx,ny) == '#') continue;
            stack.push({
                x: nx,
                y: ny,
                direction: i,
                path: node.path.slice(),
                score: node.score + (i == node.direction ? 1 : 1001)
            });
        };
    }

    const points = new Set();
    for (const path of finished) {
        for (const point of path) {
            points.add(point);
        }
    }

    console.log(`Points on most efficient paths: ${points.size}`);
};