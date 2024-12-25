const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');
const Grid = require('../grid');
function parse_input(/** @type {string} */ input) {
    const items = input.split('\n\n');
    const locks = [];
    const keys = [];
    for (const item of items) {
        const grid = new Grid(item.split('\n'));
        if (grid.get(0,0) == '#') {  // lock
            const lock = [];
            for (let x=0;x<grid.width();x++) {
                for (let y=0;y<grid.height();y++) {
                    if (grid.get(x,y) == '.') {
                        lock.push(y-1);
                        break;
                    } 
                }
            }
            locks.push(lock);
        } else {                    // key
            const key = [];
            for (let x=0;x<grid.width();x++) {
                for (let y=grid.height()-1;y>=0;y--) {
                    if (grid.get(x,y) == '.') {
                        key.push((grid.height()-y)-2);
                        break;
                    } 
                }
            }
            keys.push(key);
        }
    }
    return {locks,keys};
}

module.exports.part_1 = async()=>{
    const {locks,keys} = parse_input(input);
    console.log(locks.map(v=>v.join(',')).join('\n'));
    console.log(' ');
    console.log(keys.map(v=>v.join(',')).join('\n'));

    let num = 0;
    for (const key of keys) {
        for (const lock of locks) {
            let fits = true;
            for (let x=0;x<lock.length;x++) {
                if (lock[x] + key[x] > 5) {
                    fits = false;
                    break;
                }
            }
            if (fits) {
                num += 1;
            }
        }
    }
    console.log(`Working pairs: ${num}`)
};

module.exports.part_2 = async()=>{

};