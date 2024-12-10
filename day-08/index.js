const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');

const Grid = require('../grid.js');

module.exports.part_1 = async()=>{
    const data = input.split('\n').map(v=>v.trim()).map(v=>[...v]);
    const map = new Grid(data);
    // and an antinode map
    const antinodes = new Grid(map.data);

    for (let x=0;x<antinodes.width();x++) {
        for (let y=0;y<antinodes.height();y++) {
            antinodes.set(x,y,'.');
        }
    }

    /** @type {Map<string,{x: number,y: number,type: string}[]} */
    const transmitters = new Map();


    for (let x=0;x<map.width();x++) {
        for (let y=0;y<map.height();y++) {
            const c = map.get(x,y);
            if (c != '.') {
                if (transmitters.get(c) == undefined) {
                    transmitters.set(c,[])
                }
                const array = transmitters.get(c);
                array.push({
                    x,
                    y,
                    type: c,
                });
            }
        }
    }
    //*
    for (const type of transmitters.values()) {
        for (const freq of type) {
            for (const alt of type) {
                const dx = alt.x - freq.x;
                const dy = alt.y - freq.y;

                let ax = 0;
                let ay = 0;

                ax = alt.x + dx;
                ay = alt.y + dy;

                if (!(ax == freq.x && ay == freq.y)) {
                    // antinode found I guess?
                    if (ax < antinodes.width() && ay < antinodes.height() && ax >= 0 && ay >= 0) {
                        antinodes.set(ax,ay,'#')
                    }
                }

            }
        }
    }
    //*/
    // finally, count
    let total = 0;
    for (let x=0;x<antinodes.width();x++) {
        for (let y=0;y<antinodes.height();y++) {
            if (antinodes.get(x,y) == '#') {
                total += 1;
            }
        }
    }
    console.log(`Found ${total} antinodes`);
};

module.exports.part_2 = async()=>{
    const data = input.split('\n').map(v=>v.trim()).map(v=>[...v]);
    const map = new Grid(data);
    // and an antinode map
    const antinodes = new Grid(map.data);

    for (let x=0;x<antinodes.width();x++) {
        for (let y=0;y<antinodes.height();y++) {
            antinodes.set(x,y,'.');
        }
    }

    /** @type {Map<string,{x: number,y: number,type: string}[]} */
    const transmitters = new Map();


    for (let x=0;x<map.width();x++) {
        for (let y=0;y<map.height();y++) {
            const c = map.get(x,y);
            if (c != '.') {
                if (transmitters.get(c) == undefined) {
                    transmitters.set(c,[])
                }
                const array = transmitters.get(c);
                array.push({
                    x,
                    y,
                    type: c,
                });
            }
        }
    }
    //*
    for (const type of transmitters.values()) {
        for (const freq of type) {
            for (const alt of type) {
                const dx = alt.x - freq.x;
                const dy = alt.y - freq.y;

                let ax = 0;
                let ay = 0;
                let i = -map.width();
                while (i<map.width()) {
                    ax = alt.x + dx * i;
                    ay = alt.y + dy * i;

                    if (!(ax == freq.x && ay == freq.y)) {
                        // antinode found I guess?
                        if (ax < antinodes.width() && ay < antinodes.height() && ax >= 0 && ay >= 0) {
                            antinodes.set(ax,ay,'#')
                        }
                    }
                    i+=1;
                }

            }
        }
    }
    //*/
    // finally, count
    let total = 0;
    for (let x=0;x<antinodes.width();x++) {
        for (let y=0;y<antinodes.height();y++) {
            if (antinodes.get(x,y) == '#') {
                total += 1;
            }
        }
    }
    console.log(`Found ${total} antinodes`);
};