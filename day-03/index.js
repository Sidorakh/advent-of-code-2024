const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');
module.exports.part_1 = async()=>{
    let sum = 0;
    const matches = input.match(/(mul\(\d+,\d+\))/g);
    for (const call of matches) {
        const parts = call.match(/mul\((\d+),(\d+)\)/);
        const a = parseInt(parts[1]);
        const b = parseInt(parts[2]);
        sum += a*b;
    }
    console.log(`Sum: ${sum}`)
};

module.exports.part_2 = async()=>{
    let sum = 0;
    let mul_enabled = true;
    let cursor = 0;
    let next = 0;
    console.log(input.length);
    while (next != -1) {
        let fin = false;
        const next_do = input.indexOf('do()',cursor);
        const next_dont = input.indexOf('don\'t()',cursor);
        if (next_do != -1 && next_dont != -1) {
            if (next_do < next_dont) {
                next = next_do + 'do()'.length;
            } else {
                next = next_dont + 'don\'t()'.length;
            }
        } else if (next_do > -1 && next_dont == -1) {
            next = next_do;
        } else if (next_dont > -1 && next_do == -1) {
            next = next_dont;
        } else {
            fin = true;
            next = input.length + 1;
        }


        if (mul_enabled) {
            const  copy = input.slice(cursor,next);
            const matches = copy.match(/(mul\(\d+,\d+\))/g);
            if (matches) {
                for (const call of matches) {
                    const parts = call.match(/mul\((\d+),(\d+)\)/);
                    const a = parseInt(parts[1]);
                    const b = parseInt(parts[2]);
                    sum += a*b;
                }
            } else {
                console.log('no matches found')
                console.log(`copy: ||| ${copy} |||`)
                console.log(`cursor: ${cursor}\nnext: ${next}\nnext_do: ${next_do}\nnext_dont: ${next_dont}`);
                break
            }
        }

        if (next_do < next_dont) {
            mul_enabled = true;
        } else {
            mul_enabled = false;
        }
        cursor = next;
        if (fin == true) break;
    }
    console.log(`Sum: ${sum}`)
};