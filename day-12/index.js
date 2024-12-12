const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');
const Grid = require('../grid.js');


const coord = (x,y) => `${x}-${y}`;

function flood_fill(x,y,grid,visited) {
    const stack = [];
    stack.push({x,y});
    const type = grid.get(x,y);
    const region = new Map();
    region.set(coord(x,y),true);

    while (stack.length > 0) {
        const node = stack.shift();
        
        for (let ox=-1;ox<=1;ox++) {
            for (let oy=-1;oy<=1;oy++) {
                // skip diagonals
                if (Math.abs(ox) === Math.abs(oy)) continue;
                // bounds check
                if ((node.x + ox) < 0 || (node.y + oy) < 0 || (node.x + ox) >= grid.width() || (node.y + oy) >= grid.height) continue;
                // exclude visited nodes
                if (visited.get(coord(node.x+ox,node.y+oy)) == true) continue;
                // type check
                if (type != grid.get(node.x+ox,node.y+oy)) continue;

                // mark as visited
                visited.set(coord(node.x+ox,node.y+oy),true);
                // mark in region
                region.set(coord(node.x+ox,node.y+oy),true);
                // push onto stack
                stack.push({x: node.x+ox,y: node.y + oy});

            }
        }
    }
    return region;
}

module.exports.part_1 = async()=>{
    let visited = new Map();
    const grid = new Grid(input.split('\n'));

    let total = 0;

    let regions = [];
    for (let x=0;x<grid.width();x++) {
        for (let y=0;y<grid.height();y++) {
            if (visited.get(coord(x,y)) == true) continue;
            const region = flood_fill(x,y,grid,visited);
            regions.push({type: grid.get(x,y),region});
        }
    }

    //console.log([...visited.keys()]);
    console.log(`Found ${regions.length} regions`);

    console.log([...regions[0].region.keys()]);
    
    for (const {type,region} of regions) {
        //console.log([...region.keys()]);
        const points = [...region.keys()];
        let area = points.length;
        let perimeter = 0;


        for (const point of points) {
            const [x,y] = point.split('-').map(v=>parseInt(v));
            for (ox=-1;ox<=1;ox++) {
                for (oy=-1;oy<=1;oy++) {
                    if (Math.abs(ox) == Math.abs(oy)) continue;
                    
                    if (grid.get(x+ox,y+oy) != type) {
                        perimeter += 1;
                    }
                }
            }
        }

        console.log(`${type}: ${area} x ${perimeter}`)
        total += area * perimeter;
    }

    console.log(`Cost: $${total}`);

};


/*
// A failed attempt
module.exports.part_2 = async()=>{
    const visited = new Map();
    const grid = new Grid(input.split('\n'));

    let total = 0;

    let regions = [];
    for (let x=0;x<grid.width();x++) {
        for (let y=0;y<grid.height();y++) {
            if (visited.get(coord(x,y)) == true) continue;
            const region = flood_fill(x,y,grid,visited);
            regions.push({type: grid.get(x,y),region});
        }
    }

    //console.log([...visited.keys()]);
    console.log(`Found ${regions.length} regions`);

    console.log([...regions[0].region.keys()]);

    for (const {type,region} of regions) {
        //console.log([...region.keys()]);
        const points = [...region.keys()];
        let area = points.length;
        let sides = 0;
        const visited = new Map();

        for (const point of points) {
            const [x,y] = point.split('-').map(v=>parseInt(v));
            // left
            if (visited.get(coord(x,y))) continue;
            visited.set(coord(x,y),true);
            if (grid.get(x-1,y) != type) {
                // vert/left
                let i=0;
                while (true) {
                    i += 1;
                    let cur;
                    let side;
                    let top_break = false;
                    let bot_break = false
                    cur = grid.get(x,y-i);
                    side = grid.get(x-1,y-i);

                    if (cur == type && side != type) {
                        visited.set(coord(x,y-i));
                    } else {
                        top_break = true;
                    }
                    
                    cur = grid.get(x,y+i);
                    side = grid.get(x-1,y+i);
                    if (cur == type && side != type) {
                        visited.set(coord(x,y+i));
                    } else {
                        bot_break = true;
                    }

                    if (top_break && bot_break) {
                        break;
                    }
                }
                sides += 1;
            }
            if (grid.get(x+1,y) != type) {
                // vert/right
                let i = 0;
                while (true) {
                    i += 1;
                    let cur;
                    let side;
                    let top_break = false;
                    let bot_break = false
                    cur = grid.get(x,y-i);
                    side = grid.get(x+1,y-i);

                    if (cur == type && side != type) {
                        visited.set(coord(x,y-i));
                    } else {
                        top_break = true;
                    }
                    
                    cur = grid.get(x,y+i);
                    side = grid.get(x+1,y+i);
                    if (cur == type && side != type) {
                        visited.set(coord(x,y+i));
                    } else {
                        bot_break = true;
                    }

                    if (top_break && bot_break) {
                        break;
                    }
                }
                sides += 1;
            }

            if (grid.get(x,y-1) != type) {
                // hor/top
                let i=0;
                while (true) {
                    i+= 1;
                    let cur;
                    let side;
                    let left_break = false;
                    let right_break = false;

                    cur = grid.get(x-i,y);
                    side = grid.get(x-i,y-1);

                    if (cur == type && side != type) {
                        visited.set(coord(x-i,y));
                    } else {
                        left_break = true;
                    }
                    

                    cur = grid.get(x+i,y);
                    side = grid.get(x+i,y-1);

                    if (cur == type && side != type) {
                        visited.set(coord(x-i,y));
                    } else {
                        right_break = true;
                    }

                    if (left_break && right_break) {
                        break;
                    }
                    
                }
                sides += 1;
            }

            
            if (grid.get(x,y+1) != type) {
                // hor/bot
                let i=0;
                while (true) {
                    i+= 1;
                    let cur;
                    let side;
                    let left_break = false;
                    let right_break = false;

                    cur = grid.get(x-i,y);
                    side = grid.get(x-i,y+1);

                    if (cur == type && side != type) {
                        visited.set(coord(x-i,y));
                    } else {
                        left_break = true;
                    }
                    

                    cur = grid.get(x+i,y);
                    side = grid.get(x+i,y+1);

                    if (cur == type && side != type) {
                        visited.set(coord(x+i,y));
                    } else {
                        right_break = true;
                    }

                    if (left_break && right_break) {
                        break;
                    }
                    
                }
                sides += 1;
            }

        }

        console.log(`${type} : ${area} x ${sides} = ${area * sides}`);

        total += area*sides;
    }
    console.log(`Total : $${total}`);
};
*/


module.exports.part_2 = async()=>{
    const visited = new Map();
    const grid = new Grid(input.split('\n'));

    let total = 0;

    let regions = [];
    for (let x=0;x<grid.width();x++) {
        for (let y=0;y<grid.height();y++) {
            if (visited.get(coord(x,y)) == true) continue;
            const region = flood_fill(x,y,grid,visited);
            regions.push({type: grid.get(x,y),region});
        }
    }

    //console.log([...visited.keys()]);
    //console.log(`Found ${regions.length} regions`);

    //console.log([...regions[0].region.keys()]);

    for (const {type,region} of regions) {
        const points = [...region.keys()].map(v=>v.split('-').map(n=>parseInt(n))).map(v=>({x: v[0], y: v[1]}));
        let min_x = points[0].x;
        let min_y = points[0].y;
        let max_x = points[0].x;
        let max_y = points[0].y;
        let area = points.length;
        let sides = 0;
        // find min x and y 

        for (const point of points) {
            if (point.x < min_x) {
                min_x = point.x;
            }
            if (point.y < min_y) {
                min_y = point.y;
            }
            if (point.x > max_x) {
                max_x = point.x;
            }
            if (point.y > max_y) {
                max_y = point.y;
            }
        }

        // run through every row/col twice
        // once for each checked side
        // each continuous run is a side

        // left
        for (let x=min_x;x<=max_x;x++) {
            let edge = region.get(coord(x,min_y)) && !region.get(coord(x-1,min_y));
            if (edge) {
                sides += 1;
            }
            for (let y=min_y;y<=max_y;y++) {
                
                const p_edge = edge;
                edge = region.get(coord(x,y)) && !region.get(coord(x-1,y));
                if (edge && !p_edge) {
                    sides += 1;
                }
            }
        }

        // right
        for (let x=min_x;x<=max_x;x++) {
            let edge = region.get(coord(x,min_y)) && !region.get(coord(x+1,min_y));
            if (edge) {
                sides += 1;
            }
            for (let y=min_y;y<=max_y;y++) {
                
                const p_edge = edge;
                edge = region.get(coord(x,y)) && !region.get(coord(x+1,y));
                if (edge && !p_edge) {
                    sides += 1;
                }
            }
        }

        // top 
        for (let y=min_y;y<=max_y;y++) {
            let edge = region.get(coord(min_x,y)) && !region.get(coord(min_x,y-1));
            if (edge) {
                sides += 1;
            }
            
            for (let x=min_x;x<=max_x;x++) {
                
                const p_edge = edge;
                edge = region.get(coord(x,y)) && !region.get(coord(x,y-1));
                if (edge && !p_edge) {
                    sides += 1;
                }
            }
        }

        // bottom
        for (let y=min_y;y<=max_y;y++) {
            let edge = region.get(coord(min_x,y)) && !region.get(coord(min_x,y+1));
            if (edge) {
                sides += 1;
            }
            
            for (let x=min_x;x<=max_x;x++) {
                
                const p_edge = edge;
                edge = region.get(coord(x,y)) && !region.get(coord(x,y+1));
                if (edge && !p_edge) {
                    sides += 1;
                }
            }
        }

        
        console.log(`${type} : ${area} x ${sides} = ${area * sides}`);
        //process.exit();
        total += area * sides;
    }

    console.log(`Total: $${total}`);

}