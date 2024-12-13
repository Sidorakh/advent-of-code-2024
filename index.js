require('dotenv').config();
const readline = require('readline-sync');
const fs = require('fs');
const path = require('path');

const args = [...process.argv];
args.shift();
args.shift();


(async()=>{
    if (args.includes('--fetch-inputs') || args.includes('-f')) {
        const files = fs.readdirSync('./');
        for (const file of files) {
            if (fs.statSync(file).isDirectory()) {
                if (file.startsWith('day')) {
                    //console.log(file);
                    const input = path.join('./',file,'input.txt');
                    console.log(input);
                    if (!fs.existsSync(`./${input}`)) {
                        try {
                            const result = await fetch(`https://adventofcode.com/2024/day/${file.replace('day-','')}/input`,{
                                method: "GET",
                                headers: {
                                    cookie: `session=${process.env.SESSION_TOKEN}`
                                }
                            });
                            fs.writeFileSync(`./${input}`, await result.text());
                        } catch(e) {
                            console.error(e);
                            process.exit();
                            console.log(`Fetch failed: ${e.toString()}`);
                        }
                    }
                }
            }
        }
    }

    const days = fs.readdirSync(__dirname).filter(v=>v.startsWith('day-'));
    days.push('quit');

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