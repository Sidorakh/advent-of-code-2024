const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');

function process_stones(stones,blinks) {
    for (let i=0;i<stones.length;i++) {
        if (stones[i] == 0) {
            stones[i] = 1;
        } else if (`${stones[i]}`.length % 2 == 0) {
            const str = `${stones[i]}`;
            const a = str.slice(0,str.length/2);
            const b = str.slice(str.length/2);
            stones[i] = parseInt(a);
            stones.splice(i+1,0,parseInt(b));
            i += 1;
        } else {
            stones[i] *= 2024;
        }
    }
}


const cache = new Map();
function process_stone(stone) {
    if (!cache.has(stone)) {
        let result;
        if (stone == 0) {
            result = [1];
        } else if (stone.toString().length % 2 == 0) {
            const str = stone.toString();
            const a = parseInt(str.slice(0,str.length/2));
            const b = parseInt(str.slice(str.length/2));
            result = [a,b];
        } else {
            result = [stone * 2024];
        }
        cache.set(stone,result);
    }
    
    return cache.get(stone);
}

function recursive_process(stone, steps) {
    //console.log(steps);
    if (steps == 0) return 1;
    if (!cache.has(`${stone}-${steps}`)) {
        let total = 0;
        for (val of process_stone(stone)) {
            total += recursive_process(val,steps - 1);
        }
        //console.log(`--`);
        cache.set(`${stone}-${steps}`,total);
    }
    return cache.get(`${stone}-${steps}`);
}

module.exports.part_1 = async()=>{
    const stones = input.split(' ').map(v=>parseInt(v));

    const blinks = 25;
    for (let blink=0;blink<blinks;blink++) {
        //console.log(`Blinks: ${blink}\n${stones.join(' ')}`);
        for (let i=0;i<stones.length;i++) {
            if (stones[i] == 0) {
                stones[i] = 1;
            } else if (`${stones[i]}`.length % 2 == 0) {
                const str = `${stones[i]}`;
                const a = str.slice(0,str.length/2);
                const b = str.slice(str.length/2);
                stones[i] = parseInt(a);
                stones.splice(i+1,0,parseInt(b));
                i += 1;
            } else {
                stones[i] *= 2024;
            }
        }
    }
    console.log(`Stones: ${stones.length}`);
};

module.exports.part_2 = async() => {
    const stones = input.split(' ').map(Number);
    let total = 0;
    for (const stone of stones) {
        total += recursive_process(stone, 75)
    }
    console.log(`Total: ${total}`);
}

/*
module.exports.part_2 = async()=>{
    const stones = input.split(' ').map(v=>parseInt(v));
    let stone_lists = [stones];
    let blink = 0;
    let blinks = 75;
    while (blink < blinks) {
        if (stone_lists[0].length > 200000) { // part 1 answer, last quick-ish solve
            // split the lists
            let new_list = [];
            for (const list of stone_lists) {
                const divisor = 20;
                const fraction = Math.floor(stones.length / divisor)
                for (let i=0;i<divisor;i++) {
                    if (i == divisor - 1) {
                        new_list.push(list.slice(i*fraction));
                    } else {
                        new_list.push(list.slice(i*fraction,(i+1)*fraction));
                    }
                }
            }
            for (const list of stone_lists) {
                stone_lists.pop();
            }
            for (const list of new_list) {
                stone_lists.push(list);10
            }
        }
        console.log(`Blinks: ${blink} | ${stone_lists.length}`);
        for (let i=0;i<stone_lists.length;i++) {
            const list = stone_lists[i];
            console.log(`${i}/${stone_lists.length}`);
            process_stones(list);
        }
        blink++;
    }


    console.log(`Stones: ${stone_lists.reduce((acc,v)=>acc+v.length)}`);
};
*/