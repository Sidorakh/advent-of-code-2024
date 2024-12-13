const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');

const coord = (x,y)=>`${x}-${y}`;

function parse_machines(string = '') {
    const machine_descriptions = string.split('\n\n').map(v=>v.split('\n'));
    /** @type {{a: {x: number, y: number}, b: {x: number, y: number}, prize: {x: number, y: number}}[]} */
    const machines = [];
    for (const desc of machine_descriptions) {
        const machine = {
            a: {x: 0,y: 0},
            b: {x: 0,y: 0},
            prize: {x: 0,y: 0},
        }
        for (const line of desc) {
            if (line.startsWith('Button A')) {
                // button a
                const result = line.match(/X(?<x>[\+\-]\d+), Y(?<y>[\+\-]\d+)/);
                if (result && result.groups) {
                    machine.a.x = parseInt(result.groups.x);
                    machine.a.y = parseInt(result.groups.y);
                } else {
                    continue
                }
            }
            if (line.startsWith('Button B')) {
                // button a
                const result = line.match(/X(?<x>[\+\-]\d+), Y(?<y>[\+\-]\d+)/);
                if (result && result.groups) {
                    machine.b.x = parseInt(result.groups.x);
                    machine.b.y = parseInt(result.groups.y);
                } else {
                    continue
                }
            }
            if (line.startsWith('Prize')) {
                // button a
                const result = line.match(/X=(?<x>\d+), Y=(?<y>\d+)/);
                if (result && result.groups) {
                    machine.prize.x = parseInt(result.groups.x);
                    machine.prize.y = parseInt(result.groups.y);
                } else {
                    continue
                }
            }
        }
        machines.push(machine);
    }

    return machines;

}
module.exports.part_1 = async()=>{
    const machines = parse_machines(input);
    
    /** @type {Map<number,{a: number, b: number, cost: number}[]} */
    const solutions = new Map();
    const a_max = 100;
    const b_max = 100;
    const a_cost = 3;
    const b_cost = 1;


    for (let i=0;i<machines.length;i++) {
        const machine = machines[i]
        //console.log(machine);
        solutions.set(i,[]);
        for (let a=0;a<a_max;a++) {
            for (let b=0;b<b_max;b++) {
                const claw_x = a*machine.a.x + b*machine.b.x;
                const claw_y = a*machine.a.y + b*machine.b.y;

                if (claw_x == machine.prize.x && claw_y == machine.prize.y) {
                    solutions.get(i).push({a, b, cost: a*a_cost + b*b_cost});
                }
            }
        }
    }

    let minimum = 0;
    for (const set of solutions.values()) {
        if (set.length > 0) {
            minimum += Math.min(...set.map(v=>v.cost));
        }
    }
    console.log(`Minimum spend: ${minimum}`);

};

module.exports.part_2 = async()=>{
    const machines = parse_machines(input);
    
    /** @type {Map<number,{a: number, b: number, cost: number}[]} */
    const solutions = new Map();
    const a_max = 100;
    const b_max = 100;
    let a_cost = 3;
    let b_cost = 1;
    let tokens = 0;

    const offset = 10000000000000;

    for (let i=0;i<machines.length;i++) {
        //console.log(`Processing machine ${i+1}`)
        const machine = machines[i];
        machine.prize.x += offset;
        machine.prize.y += offset;
    }
    
    for (let i=0;i<machines.length;i++) {
        const machine = machines[i];
        const a_dividend = (machine.b.x * machine.prize.y) - (machine.b.y * machine.prize.x);
        const a_divisor = (machine.a.y * machine.b.x) - (machine.a.x * machine.b.y);

        if (a_dividend % a_divisor != 0) {
            continue;
        }

        const a_times = a_dividend / a_divisor;

        const b_dividend = machine.prize.x - (machine.a.x * a_times);
        const b_divisor = machine.b.x;

        if (b_dividend % b_divisor != 0) {
            continue;
        }

        const b_times = b_dividend / b_divisor;

        tokens += (a_times * a_cost) + (b_times * b_cost); 
    }
    console.log(`Minimum spend: ${tokens}`);
};