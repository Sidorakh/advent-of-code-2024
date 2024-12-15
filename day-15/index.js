const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');
const Grid = require('../grid');
const coord = (x,y)=>`${x}-${y}`;

function parse_input() {
    let [map_data,moves] = input.split('\n\n');
    const map = new Grid(map_data.split('\n'));
    moves = moves.replace('\n','');
    return {
        map,
        moves,
    }
}
function parse_input_part2() {
    let [map_data,moves] = input.split('\n\n');
    let real_map_data = '';
    for (const line of map_data.split('\n')) {
        for (const char of line) {
            if (char == '#') {
                real_map_data += '##';
            }
            if (char == '.') {
                real_map_data += '..';
            }
            if (char == '@') {
                real_map_data += '@.';
            }
            if (char == 'O') {
                real_map_data += '[]';
            }
        }
        real_map_data += '\n';
    }

    const map = new Grid(real_map_data.split('\n'));
    moves = moves.replace('\n','');
    return {
        map,
        moves,
    }
}


function make_move(x,y,/** @type {Grid} */ map) {

}

module.exports.part_1 = async()=>{
    const { map,moves } = parse_input();

    const robot = {
        x: -1,
        y: -1,
    }
    for (let x=0;x<map.width();x++) {
        for (let y=0;y<map.height();y++) {
            if (map.get(x,y) == '@') {
                robot.x = x;
                robot.y = y;
                map.set(x,y,'.');
                break;
            }
        }
    }
    for (const move of moves) {
        let ox = 0;
        let oy = 0;
        if (move == '^') {
            oy = -1;
        }
        if (move == 'v') {
            oy = 1;
        }
        if (move == '<') {
            ox = -1;
        }
        if (move == '>') {
            ox = 1;
        }

        if (map.get(robot.x+ox,robot.y+oy) == 'O') {
            //console.log('Attempt to push');
            let i=2;
            let can_push = false;
            while (true) {
                const tile = map.get(robot.x+ox*i,robot.y+oy*i);
                if (tile == '.') {
                    can_push = true;
                    break;
                }
                if (tile == '#') {
                    break;
                }
                
                i+=1;
            }
            //console.log(`Can push: ${can_push}`);
            if (can_push) {
                map.set(robot.x+ox,robot.y+oy,'.')
                map.set(robot.x+ox*i,robot.y+oy*i,'O');
            }
        }
        if (map.get(robot.x+ox,robot.y+oy) == '.') {
            robot.x += ox;
            robot.y += oy;
        }
        // const c = map.get(robot.x,robot.y);
        // map.set(robot.x,robot.y,'@');
        // console.log(move);
        // map.log();
        // console.log('\n');
        // map.set(robot.x,robot.y,c);
    }

    let total = 0;
    for (let x=0;x<map.width();x++) {
        for (let y=0;y<map.height();y++) {
            if (map.get(x,y) == 'O') {
                total += y * 100 + x;
            }
        }
    }

    console.log(`Total: ${total}`);
};

module.exports.part_2 = async()=>{
    const { map,moves } = parse_input_part2();

    const robot = {
        x: -1,
        y: -1,
    }
    for (let x=0;x<map.width();x++) {
        for (let y=0;y<map.height();y++) {
            if (map.get(x,y) == '@') {
                robot.x = x;
                robot.y = y;
                map.set(x,y,'.');
                break;
            }
        }
    }

    // const c = map.get(robot.x,robot.y);
    // map.set(robot.x,robot.y,'@');
    // console.log('start');
    // map.log();
    // console.log('\n');
    // map.set(robot.x,robot.y,c);
    
    for (const move of moves) {
        let ox = 0;
        let oy = 0;
        if (move == '^') {
            oy = -1;
        }
        if (move == 'v') {
            oy = 1;
        }
        if (move == '<') {
            ox = -1;
        }
        if (move == '>') {
            ox = 1;
        }

        const next_tile = map.get(robot.x + ox, robot.y + oy);
        
        if (next_tile == '[' || next_tile == ']') {
            console.log('Attempt to push');
            if (ox != 0) {
                // HORIZONTAL PUSH ONLY
                let i=1;
                let can_push = false;
                while (true) {
                    const tile = map.get(robot.x+ox*i,robot.y+oy*i);
                    if (tile == '.') {
                        can_push = true;
                        break;
                    }
                    if (tile == '#') {
                        break;
                    }
                    
                    i+=1;
                }

                console.log(`Can push: ${can_push} | ${i}`)
                if (can_push) {
                    
                    for (let j=i;j > 1;j--) {
                        const t = map.get(robot.x + ox*(j-1),robot.y);
                        map.set(robot.x+ox*(j),robot.y,t);
                    }
                    map.set(robot.x+ox,robot.y,'.');
                }
            } else {
                // veritcal pushing requires more effort, sadly
                const to_check = [{x: robot.x, y: robot.y + oy}];
                const checked = new Map();
                /** @type {Map<string,{x: number, y: number}} */
                const to_push = new Map();
                let can_push = true;
                while (to_check.length > 0) {
                    console.log(to_check.length);
                    const el = to_check.shift();
                    const c = map.get(el.x,el.y);
                    checked.set(coord(el.x,el.y),true);

                    // if wall - early exit
                    if (c == '#') {
                        can_push = false;
                        break;
                    }
                    if (c == '.') {
                        continue;
                    }
                    if (c == ']' || c == '[') {
                        to_push.set(coord(el.x,el.y),{x:el.x,y:el.y});
                    }
                    if (c == '[') {
                        if (!checked.has(coord(el.x+1,el.y))) {
                            to_check.push({x: el.x+1,y: el.y})
                        }
                    }
                    if (c == ']') {
                        if (!checked.has(coord(el.x-1,el.y+oy))) {
                            to_check.push({x: el.x-1,y: el.y})
                        }
                    }
                    if (!checked.has(coord(el.x,el.y+oy))) {
                        to_check.push({x: el.x, y: el.y+oy});
                    }
                }
                console.log(`Can push: ${can_push} : ${to_push.size}`);
                if (can_push == true) {
                    const boxes = [...to_push.values()];
                    const s = -Math.sign(boxes[0].y - robot.y);
                    boxes.sort((a,b)=>(a.y-b.y)*s);

                    console.log(boxes.map(v=>`${v.x},${v.y}`).join('\n'))

                    for (const box of boxes) {
                        const b = map.get(box.x,box.y);
                        map.set(box.x,box.y+oy,b);
                        map.set(box.x,box.y,'.');
                    }


                }
            }
        }
        if (map.get(robot.x+ox,robot.y+oy) == '.') {
            robot.x += ox;
            robot.y += oy;
        }
        // const c = map.get(robot.x,robot.y);
        // map.set(robot.x,robot.y,'@');
        // console.log(move);
        // map.log();
        // console.log('\n');
        // map.set(robot.x,robot.y,c);
        // console.log(map.get(robot.x+ox,robot.y+oy));
        
    }


    let total = 0;
    for (let x=0;x<map.width();x++) {
        for (let y=0;y<map.height();y++) {
            if (map.get(x,y) == '[') {
                total += y * 100 + x;
            }
        }
    }

    console.log(`Total: ${total}`);
};