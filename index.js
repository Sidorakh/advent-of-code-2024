const readline = require('readline-sync');
const fs = require('fs');

const days = fs.readdirSync(__dirname).filter(v=>v.startsWith('day-'));
days.push('quit');

(async()=>{
    const opt = readline.questionInt('What day? (1-24, 0 to quit) : ')
    if (opt == 0) {
        return;
    }
    try {
        const day = require(`./day-${opt.toString().padStart(2,'0')}`);
        const part = readline.questionInt('What part? : ');
        if (part == 1) {
            const result = await day.part_1();
        } else {
            const result = await day.part_2();
        }
    } catch(e) {
        console.error(e);
    }
})()