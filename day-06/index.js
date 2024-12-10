const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');
const Grid = require('../grid.js');

function dir_to_x(dir) {
    if (dir < 0) {
        dir = dir + 360
    }
    if (dir == 90 || dir == 270) {
        return 0;
    }
    if (dir == 180) return -1;
    if (dir == 0) return 1;
}
function dir_to_y(dir) {
    if (dir < 0) {
        dir = dir + 360
    }
    if (dir == 180 || dir == 0) {
        return 0;
    }
    if (dir == 90) return -1;
    if (dir == 270) return 1;
}

module.exports.part_1 = async()=>{
    const data = input.split('\n').map(v=>v.trim()).map(v=>[...v]);
    const map = new Grid(data);

    let guard ={
        x: -1,
        y: -1,
        dir: 90,
    }
    let found = false;
    for (let x=0;x<map.width();x++) {
        for (let y=0;y<map.height();y++) {
            if (map.get(x,y) == '^') {
                guard.x = x;
                guard.y = y;
                guard.dir = 90;
                found = true;
                break;
            }
        }
        if (found == true) break;
    }
    while(true) {
        map.set(guard.x,guard.y,'X');
        const next_x = guard.x + dir_to_x(guard.dir);
        const next_y = guard.y + dir_to_y(guard.dir);

        let next = map.get(next_x,next_y);
        if (next == '#') {
            // wall
            console.log('found a wall')
            guard.dir -= 90;
            if (guard.dir < 0) guard.dir += 360;
            if (guard.dir > 360) guard.dir -= 360;
            continue;
        }
        if (next == undefined) {
            console.log('out of bounds')
            break;
        }
        guard.x = next_x;
        guard.y = next_y;
        const t = map.get(guard.x,guard.y);
        map.set(guard.x,guard.y,'^');
        //map.log();
        //console.log('\n');
        map.set(guard.x,guard.y,t);
    }

    let positions = 0;
    // and now to count unique positions
    for (let x=0;x<map.width();x++) {
        for (let y=0;y<map.height();y++) {
            if (map.get(x,y) == 'X' || map.get(x,y) == '^') {
                positions += 1;
            }
        }
    }
    console.log(`Unqiue positions: ${positions}`)
};

module.exports.part_2 = async()=>{
    const data = input.split('\n').map(v=>v.trim()).map(v=>[...v]);
    const grid = new Grid(data);

    const guard ={
        x: -1,
        y: -1,
        dir: 90,
    }
    const turns = [];

    let found = false;
    for (let x=0;x<grid.width();x++) {
        for (let y=0;y<grid.height();y++) {
            if (grid.get(x,y) == '^') {
                guard.x = x;
                guard.y = y;
                guard.dir = 90;
                found = true;
                break;
            }
        }
        if (found == true) break;
    }
    let positions = 0;
    const guard_init = structuredClone(guard);

    for (let x=0;x<grid.width();x++) {
        for (let y=0;y<grid.height();y++) {
            turns.splice(0,turns.length);
            const map = new Grid(grid.data);
            // can't place on the guard, or on anotehr wall
            if (map.get(x,y) == '#') continue;
            if (map.get(x,y) == '^') continue;
            map.set(x,y,'#');

            let found_loop = false;
            while(true) {
                map.set(guard.x,guard.y,'X');
                const next_x = guard.x + dir_to_x(guard.dir);
                const next_y = guard.y + dir_to_y(guard.dir);
        
                let next = map.get(next_x,next_y);
                if (next == '#') {
                    // wall
                    //console.log('found a wall')
                    guard.dir -= 90;
                    if (guard.dir < 0) guard.dir += 360;
                    if (guard.dir > 360) guard.dir -= 360;
                    for (const turn of turns) {
                        if (turn.x == guard.x && turn.y == guard.y && turn.dir == guard.dir) {
                            found_loop = true;
                        }
                    }
                    if (found_loop == true) break;
                    turns.push({x: guard.x, y: guard.y, dir: guard.dir});
                    continue;
                }
                if (next == undefined) {
                    //console.log('out of bounds')
                    break;
                }
                guard.x = next_x;
                guard.y = next_y;
                const t = map.get(guard.x,guard.y);
                map.set(guard.x,guard.y,'^');
                //map.log();
                //console.log('\n');
                map.set(guard.x,guard.y,t);
            }
            if (found_loop) {
                positions += 1;
            }
            guard.x = guard_init.x;
            guard.y = guard_init.y;
            guard.dir = guard_init.dir;
        }
    }
    console.log(`Loops found: ${positions}`);
};