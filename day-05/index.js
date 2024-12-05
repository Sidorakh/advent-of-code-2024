const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');
module.exports.part_1 = async()=>{
    const split = input.split('\n\n');
    const rules = split[0].split('\n').map(v=>v.split('|').map(v=>parseInt(v)));
    const updates = split[1].split('\n').map(v=>v.split(',').map(v=>parseInt(v)));
    let total = 0;

    for (const update of updates) {
        let ordered = true;
        for (const rule of rules) {
            const first = update.indexOf(rule[0]);
            const second = update.indexOf(rule[1]);
            
            if (first != -1 && second != -1) {
                if (first > second) {
                    ordered = false;
                    break;
                }
            }
        }
        if (ordered) {
            //console.log(update);
            const middle = Math.floor(update.length / 2);
            total += update[middle];
        }
        
    }
    console.log(`Total: ${total}`);

};

module.exports.part_2 = async()=>{
    const split = input.split('\n\n');
    const rules = split[0].split('\n').map(v=>v.split('|').map(v=>parseInt(v)));
    const updates = split[1].split('\n').map(v=>v.split(',').map(v=>parseInt(v)));
    const unordered = [];
    let total = 0;

    // find out-of-order updates
    for (const update of updates) {
        let ordered = true;
        for (const rule of rules) {
            const first = update.indexOf(rule[0]);
            const second = update.indexOf(rule[1]);
            
            if (first != -1 && second != -1) {
                if (first > second) {
                    ordered = false;
                    break;
                }
            }
        }
        if (!ordered) {
            //console.log(update);
            unordered.push(update);
        }
        
    }
    //console.log(`Total: ${total}`);

    // and now to fix them
    const ordered = [];
    for (const update of unordered) {
        for (let i=0;i<update.length;i++) {
            for (const rule of rules) {
                const first = update.indexOf(rule[0]);
                const second = update.indexOf(rule[1]);

                // if the rule applies
                if (first != -1 && second != -1) {
                    // if the rule is broken
                    if (first > second) {
                        const s = update[second];
                        update[second] = update[first];
                        update[first] = s;
                    }
                }
            }
        }
        const middle = Math.floor(update.length / 2);
        total += update[middle];
    }

    console.log(`Total: ${total}`);
};