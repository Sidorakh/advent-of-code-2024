const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');
module.exports.part_1 = async()=>{
    const left = [], right = [];
    const list = input.split('\n').map(v=>v.trim());
    for (const item of list) {
        const lr = item.split(/\s+/);
        left.push(lr[0]);
        right.push(lr[1]);
    }
    left.sort((a,b)=>a-b);
    right.sort((a,b)=>a-b);
    let distance = 0;
    for (let i=0;i<left.length;i++) {
        const diff = Math.max(left[i],right[i])-Math.min(left[i],right[i]);
        distance += diff;
    }
    console.log(`Distance: ${distance}`);
};

module.exports.part_2 = async()=>{
    const left = [], right = [];
    const list = input.split('\n').map(v=>v.trim());
    for (const item of list) {
        const lr = item.split(/\s+/);
        left.push(lr[0]);
        right.push(lr[1]);
    }
    let similarity = 0;
    for (const location of left) {
        const num = right.filter(v=>v==location).length;
        similarity += location * num;
    }
    console.log(`Similarity: ${similarity}`)
};