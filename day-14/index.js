const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');
const Grid = require('../grid');
const coord = (x,y)=>`${x}-${y}`;

function parse_input(string) {
    /** @type { { position: { x: number, y: number, }, velocity: { x: number, y: number, } }[]} */
    const robots = [];
    const list = string.split('\n');
    for (const item of list) {
        let [pos,vel] = item.split(' ');
        pos = pos.replace('p=','');
        vel = vel.replace('v=','');
        const [px,py] = pos.split(',').map(v=>parseInt(v));
        const [vx,vy] = vel.split(',').map(v=>parseInt(v));
        robots.push({
            position: {
                x: px,
                y: py,
            },
            velocity: {
                x: vx,
                y: vy,
            }
        });
    }
    return robots;
}

module.exports.part_1 = async()=>{
    // 11w and 7h for test data
    const width = 101;
    const height = 103;

    const robots = parse_input(input);

    const steps = 100;

    for (let i=0;i<steps;i++) {
        for (const robot of robots) {
            robot.position.x += robot.velocity.x;
            robot.position.y += robot.velocity.y;

            if (robot.position.x >= width) {
                robot.position.x -= width;
            }
            if (robot.position.y >= height) {
                robot.position.y -= height;
            }
            if (robot.position.x < 0) {
                robot.position.x += width;
            }
            if (robot.position.y < 0) {
                robot.position.y += height;
            }
        }
    }

    // and now, quadrants!

    const mid_x = Math.floor(width / 2);
    const mid_y = Math.floor(height / 2);

    const quadrants = {
        top_left: 0,
        top_right: 0,
        bottom_left: 0,
        bottom_right: 0,
    };

    for (const robot of robots) {
        if (robot.position.x < mid_x) {
            if (robot.position.y < mid_y) {
                quadrants.top_left += 1;
            }
            if (robot.position.y > mid_y) {
                quadrants.bottom_left += 1;
            }
        }
        if (robot.position.x > mid_x) {
            if (robot.position.y < mid_y) {
                quadrants.top_right += 1;
            }
            if (robot.position.y > mid_y) {
                quadrants.bottom_right += 1;
            }
        }
    }

    console.log(`Safety factor product: ${Object.values(quadrants).reduce(((acc,v)=>v*acc),1)}`);
    

};

module.exports.part_2 = async()=>{
    // 11w and 7h for test data
    const width = 101;
    const height = 103;

    const robots = parse_input(input);

    const steps = 100;

    let i = 0;
    while (true) {
        i++;
        const visited = new Map();
        for (const robot of robots) {
            robot.position.x += robot.velocity.x;
            robot.position.y += robot.velocity.y;

            if (robot.position.x >= width) {
                robot.position.x -= width;
            }
            if (robot.position.y >= height) {
                robot.position.y -= height;
            }
            if (robot.position.x < 0) {
                robot.position.x += width;
            }
            if (robot.position.y < 0) {
                robot.position.y += height;
            }
            visited.set(coord(robot.position.x,robot.position.y))
        }
        if (visited.size == robots.length) {
            break;
        }
    }

    let map = Grid.create(width,height,'.');

    for (const robot of robots) {
        map.set(robot.position.x,robot.position.y,'X');
    }

    console.log(map.stringify());
    console.log(i);



};