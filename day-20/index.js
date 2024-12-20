const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');
const Grid = require('../grid');

function parse_input(/** @type {string}*/ input) {
    return new Grid(input.split('\n'));
}

const coord = (x,y)=>`${x}-${y}`;

const directions = [
    {x: 1, y:0},        // east
    {x: 0, y: 1},       // south
    {x: -1, y: 0},      // west
    {x: 0, y: -1},      // north
];

module.exports.part_1 = async()=>{
    const grid = parse_input(input);
    const start = {
        x: 0,
        y: 0,
    }
    const target = {
        x: 0,
        y: 0,
    }
    

    for (let x=0;x<grid.width();x++) {
        for (let y=0;y<grid.height();y++) {
            if (grid.get(x,y) == 'S') {
                start.x = x;
                start.y = y;
                grid.set(x,y,'.');
            }
            if (grid.get(x,y) == 'E') {
                target.x = x;
                target.y = y;
                grid.set(x,y,'.');
            }
        }
    }

    const visited  = {};

    let stack = [{x: start.x, y: start.y, path: [], score: 0}];
    let finished = [];
    let minimum = Infinity;
    /** @type {{x: number;y: number;direction: number;path: string[];score: number;}} */

    while (stack.length > 0) {
        const node = stack.shift();
        node.path.push(coord(node.x,node.y));
        if (node.x == target.x && node.y == target.y) {
            finished.push(node.path);
            continue;
        }

        for (const direction of directions) {
            const x = direction.x;
            const y = direction.y;
            const nx = node.x + x;
            const ny = node.y + y;
            //console.log(`${coord(node.x,node.y)} - ${coord(nx,ny)} - ${node.path.includes(coord(nx,ny))}`);
            if (node.path.includes(coord(nx,ny))) continue;
            if (nx < 0 || ny < 0 || nx >= grid.width() || ny >= grid.height()) continue;
            if (grid.get(nx,ny) == '#') continue;
            //console.log(`pushing to the stack`);
            stack.push({
                x: nx, y: ny, 
                path: [...node.path], score: node.score + 1,
            })
        }
        //console.log(stack.length)
    }

    console.log(finished.length);

    let cheats = new Map();
    let threshold = 100;

    for (const path of finished) {
        const map = Grid.create(grid.width(),grid.height());
        for (let x=0;x<map.width();x++) {
            for (let y=0;y<map.height();y++) {
                map.set(x,y,'#');
            }
        }
        for (let i=0;i<path.length;i++) { 
            const point = path[i];
            const [x,y] = point.split('-').map(v=>parseInt(v));
            map.set(x,y,i);
        }
        
        for (let i=0;i<path.length;i++) { 
            const point = path[i];
            const [x,y] = point.split('-').map(v=>parseInt(v));
            for (const direction of directions) {
                const ox = direction.x;
                const oy = direction.y;
                if (map.get(x+ox,y+oy) == '#') {
                    if (map.get(x+ox*2,y+oy*2) != '#') {
                        const diff = map.get(x+ox*2,y+oy*2) - map.get(x,y);
                        if (diff > threshold) {
                            if (cheats.get(diff) == undefined) {
                                cheats.set(diff,0);
                            }
                            cheats.set(diff,cheats.get(diff)+1);
                        }
                    }
                }
            }
        }
    }

    console.log(`Cheats: ${[...cheats.values()].reduce((acc,v)=>v+acc,0)}`)

};

module.exports.part_2 = async()=>{
    const grid = parse_input(input);
    const start = {
        x: 0,
        y: 0,
    }
    const target = {
        x: 0,
        y: 0,
    }
    

    for (let x=0;x<grid.width();x++) {
        for (let y=0;y<grid.height();y++) {
            if (grid.get(x,y) == 'S') {
                start.x = x;
                start.y = y;
                grid.set(x,y,'.');
            }
            if (grid.get(x,y) == 'E') {
                target.x = x;
                target.y = y;
                grid.set(x,y,'.');
            }
        }
    }

    
    let finished = [];
    const visited  = {};
    let minimum = Infinity;
    
    
    const stack = [{x: start.x,y: start.y, path: [], cost: 0}]
    
    while (stack.length > 0) {
        const node = stack.shift();
        node.path.push(coord(node.x,node.y));
        if (node.x == target.x && node.y == target.y) {
            finished = node.path;
            break;
        }

        for (const dir of directions) {
            const nx = node.x + dir.x;
            const ny = node.y + dir.y;
            if (node.path.includes(coord(nx,ny))) continue;
            if (grid.get(nx,ny) == '#') continue;

            stack.push({
                x: nx, y: ny, path: [...node.path], cost: node.cost+1
            })

        }
    }

    const threshold = 100;
    let found_cheats = 0;
    
    const points = [];
    for (const point of finished) {
        const [x,y] = point.split('-').map(v=>parseInt(v));
        points.push({x,y})
    }

    for (let i=0;i<points.length-1;i++) {
        const p1 = {
            x: 0,
            y: 0,
        };
        const p2 = {
            x: 0,
            y: 0,
        };
        p1.x = points[i].x;
        p1.y = points[i].y;
        for (let j=i+1;j<points.length;j++) {
            p2.x = points[j].x;
            p2.y = points[j].y;
            const manhattan = Math.abs(p2.x-p1.x) + Math.abs(p2.y-p1.y);
            const difference = j-i;
            if (manhattan <= 20) {
                //cheats.set(finished[j]+','+finished[i],distance);
                if ((difference - manhattan) >= threshold)
                found_cheats += 1;
            }
        }
        //console.log(found_cheats);
    }

    
    console.log(`Found ${found_cheats} cheats`);
    

};