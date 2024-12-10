const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');

const Grid = require('../grid.js');


function coord(x,y) {
    return `${x}-${y}`;
}

function recursive_walk_p1(/** @type {Grid} */ map, /** @type {number}*/ x, /** @type {number}*/ y, /** @type {Map<string,{x: number, y: number}} */ peaks=[],history=undefined,) {
    if (history == undefined) {
        //console.log(`Creating history map`);
        history = new Map();
    }

    history.set(coord(x,y),true);
    //console.log(`${x},${y}`)
    const current = map.get(x,y);
    for (let ox=-1;ox<=1;ox++) {
        for (let oy=-1;oy<=1;oy++) {
            if (Math.abs(ox) == Math.abs(oy)) continue;
            const tile = map.get(x+ox,y+oy);
            if (tile == undefined) continue;
            if (tile != current+1) continue;
            if (history.get(coord(x+ox,y+oy)) == true) {
                continue;
            };

            if (tile == 9) {
                if (peaks.find(v=>v.x == (x+ox) && v.y == (y+oy))) {
                    continue;
                };
                peaks.push({x: x+ox, y: y+oy});
                history.set(coord(x+ox,y+oy),true);
                continue;
            }

            recursive_walk_p1(map,x+ox,y+oy,peaks,history);
        }
    }
    return peaks;
}

function recursive_walk_p2(/** @type {Grid} */ map, /** @type {number}*/ x, /** @type {number}*/ y, /** @type {Map<string,{x: number, y: number}} */ peaks=[]) {
    

    const current = map.get(x,y);
    for (let ox=-1;ox<=1;ox++) {
        for (let oy=-1;oy<=1;oy++) {
            if (Math.abs(ox) == Math.abs(oy)) continue;
            const tile = map.get(x+ox,y+oy);
            if (tile == undefined) continue;
            if (tile != current+1) continue;
            

            if (tile == 9) {
                peaks.push({x: x+ox, y: y+oy});
                continue;
            }

            recursive_walk_p2(map,x+ox,y+oy,peaks);
        }
    }
    return peaks;
}


module.exports.part_1 = async()=>{
    const start = performance.now();
    const map = new Grid(input.split('\n').map(v=>v.trim().split('').map(n=>parseInt(n))));

    const start_points = [];
    for (let y=0;y<map.height();y++) {
        for (let x=0;x<map.width();x++) {
            if (map.get(x,y) == 0) {
                start_points.push({x,y});
            }
        }
    }

    //console.log(start_points);
    let total_score = 0;
    for (const point of start_points) {
        const peaks = recursive_walk_p1(map,point.x,point.y);
        //console.log(`Trail score: ${peaks.length} (${point.x}.${point.y})`);
        total_score += peaks.length;
    }

    console.log(`Trail score sum: ${total_score}`);
    console.log(`Time taken: ${(performance.now()-start)}ms`);
};

module.exports.part_2 = async()=>{
    const start = performance.now();
    const map = new Grid(input.split('\n').map(v=>v.trim().split('').map(n=>parseInt(n))));

    const start_points = [];
    for (let y=0;y<map.height();y++) {
        for (let x=0;x<map.width();x++) {
            if (map.get(x,y) == 0) {
                start_points.push({x,y});
            }
        }
    }

    //console.log(start_points);
    let total_score = 0;
    for (const point of start_points) {
        const peaks = recursive_walk_p2(map,point.x,point.y);
        //console.log(`Trail score: ${peaks.length} (${point.x}.${point.y})`);
        total_score += peaks.length;
    }

    console.log(`Trail score sum: ${total_score}`);
    console.log(`Time taken: ${(performance.now()-start)}ms`);
};