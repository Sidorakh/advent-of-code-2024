const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');

class Grid {
    data = [];
    #width = 0;
    #height = 0;
    constructor(grid) {
        this.data = [];
        for (const row of grid) {
            const new_row = [...row]
            this.data.push(new_row);
            this.#width = Math.max(this.#width,new_row.length);
        }
        this.#height = this.data.length;
    }
    get(x,y) {
        if (x < 0 || x >= this.width() || y < 0 || y >= this.height()) return undefined;
        return this.data[y][x];
    }
    set(x,y,v) {
        if (x < 0 || y < 0) {
            return false;
        }
        if (y >= this.height()) {
            this.data[y] = [];
        }
        //if (x >= this.width()) {
        this.data[y][x] = v;
        //}
        return true;
    }
    width() {
        return this.#width;
    }
    height() {
        return this.#height;
    }
    log() {
        console.log(this.data.map(v=>v.join('')).join('\n'));
    }
}

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