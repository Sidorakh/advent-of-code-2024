const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');
const Grid = require('../grid.js');

const coord = (x,y)=>`${x}-${y}`;

function parse_input(/** @type {string} */ input) {
    const lines = input.split('\n');
    const coords = [];
    for (const line of lines) {
        const [x,y] = line.split(',').map(v=>parseInt(v));
        coords.push({x,y});
    }

    return coords;
}

module.exports.part_1 = async()=>{
    //console.log(parse_input(input))
    const coords = parse_input(input);
    const to_drop = 1024;
    const w = 71;
    const h = 71;
    const grid = Grid.create(w,h);

    const start = {
        x: 0,
        y: 0,
    };
    const end = {
        x: grid.width()-1,
        y: grid.height()-1
    };

    for (let x=0;x<grid.width();x++) {
        for (let y=0;y<grid.height();y++) {
            grid.set(x,y,'.');
        }
    }

    for (let i=0;i<to_drop;i++) {
        const coord = coords[i];
        grid.set(coord.x,coord.y,'#');
    }

    /** @type {{[key: string]: number}} */
    const visited = {};
    const stack = [{x: start.x,y: start.y,distance:0, path: []}];
    
    let finished = [];
    let minimum = Infinity;

    /** @type {{x: number;y: number;distance: number; path: string[]}} */
    //let node;
    while (stack.length > 0) {
        const node = stack.shift();
        node.path.push(coord(node.x,node.y));
        if (node.x == end.x && node.y == end.y) {
            if (node.distance < minimum) {
                finished = [];
                minimum = node.distance;
            }
            if (node.distance == minimum) {
                finished.push(node);
            }
            continue;
        }

        const key = coord(node.x,node.y);
        if (visited[key] != undefined) {
            continue;
        }
        visited[key] = node.distance;
        if (node.distance > minimum) {
            continue;
        }

        for (let ox=-1;ox<=1;ox++) {
            for (let oy=-1;oy<=1;oy++) {
                // diag + self check
                if (Math.abs(ox) == Math.abs(oy)) {
                    continue;
                }

                const x  = node.x + ox;
                const y = node.y + oy;
                // oob check
                if (x < 0 || y < 0 || x >= grid.width() || y >=grid.height()) {
                    continue;
                }
                if (grid.get(x,y) == '#') {
                    continue;
                }
                if (node.path.includes(coord(x,y))) {
                    continue;
                }
                stack.push({
                    x,
                    y,
                    distance: node.distance + 1,
                    path: [...node.path]
                });
            }
        }
    }
    
    const path = finished.shift();

    if (path) {
        console.log(`Length: ${path.distance}`);
    }



};

module.exports.part_2 = async()=>{
    //console.log(parse_input(input))
    const coords = parse_input(input);
    const to_drop = 1024;
    const w = 71;
    const h = 71;
    const grid = Grid.create(w,h);

    const start = {
        x: 0,
        y: 0,
    };
    const end = {
        x: grid.width()-1,
        y: grid.height()-1
    };

    for (let x=0;x<grid.width();x++) {
        for (let y=0;y<grid.height();y++) {
            grid.set(x,y,'.');
        }
    }

    for (let i=0;i<to_drop;i++) {
        const coord = coords[i];
        grid.set(coord.x,coord.y,'#');
    }
    const time_start = performance.now();
    console.log(`Starting`);
    /** @type {{x: number;y: number;distance: number; path: string[]}} */
    //let node;
    let finished = [];
    for (let i=to_drop;i<coords.length;i++) {
        const coordinate = coords[i];
        grid.set(coordinate.x,coordinate.y,'#');
        //console.log(`Dropped ${coordinate.x},${coordinate.y} (${i+1} of ${coords.length})`);
        
        /** @type {{[key: string]: number}} */
        const visited = {};
        const stack = [{x: start.x,y: start.y,distance:0, path: []}];
        if ((i-to_drop) % 100 == 0) {
            console.log(`Dropped ${i-to_drop} bytes`)
        }
        let reset = false;
        for (const node of finished) {
            if (node.path.includes(coord(coordinate.x,coordinate.y))) {
                reset = true;
            }
        }
        if (finished.length == 0) {
            reset = true;
        }
        if (reset == false) continue;
        finished = [];
        let minimum = Infinity;
        while (stack.length > 0) {
            const node = stack.shift();
            node.path.push(coord(node.x,node.y));
            if (node.x == end.x && node.y == end.y) {
                if (node.distance < minimum) {
                    finished = [];
                    minimum = node.distance;
                }
                if (node.distance == minimum) {
                    finished.push(node);
                }
                continue;
            }

            const key = coord(node.x,node.y);
            if (visited[key] != undefined) {
                continue;
            }
            visited[key] = node.distance;
            if (node.distance > minimum) {
                continue;
            }

            for (let ox=-1;ox<=1;ox++) {
                for (let oy=-1;oy<=1;oy++) {
                    // diag + self check
                    if (Math.abs(ox) == Math.abs(oy)) {
                        continue;
                    }

                    const x  = node.x + ox;
                    const y = node.y + oy;
                    // oob check
                    if (x < 0 || y < 0 || x >= grid.width() || y >=grid.height()) {
                        continue;
                    }
                    if (grid.get(x,y) == '#') {
                        continue;
                    }
                    if (node.path.includes(coord(x,y))) {
                        continue;
                    }
                    stack.push({
                        x,
                        y,
                        distance: node.distance + 1,
                        path: [...node.path]
                    });
                }
            }
        }

        if (finished.length == 0) {
            console.log(`Byte ${i} prevented the ship from escaping - ${coordinate.x},${coordinate.y}`);
            break;
        }
    }
    const time_end = performance.now();
    console.log(`Time taken: ${((time_end-time_start)/1000).toFixed(2)}s`);
};