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
            return;
        }
        if (y >= this.height()) {
            this.data[y] = [];
        }
        if (x >= this.width()) {
            this.data[y][x] = v;
        }
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
    const grid = new Grid(data);
    //grid.log();
    let total = 0;
    // word to find
    const word = 'XMAS';


    for (let x=0;x<grid.width();x++) {
        for (y=0;y<grid.height();y++) {
            // if not first letter, continue
            if (grid.get(x,y) != word[0]) continue;

            // for (let i=0;i<=1;i++) {
            //     for (let j=0;j<=1;j++) {
            //         let found = true;
            //         for (let c=1;c<word.length;c++) {
            //             if (grid.get(x+i*c,y+j*c) != word[c]) {
            //                 found = false;
            //                 continue;
            //             }
            //         } 
            //         if (found) {
            //             total += 1;
            //             console.log(`start @ ${x}-${y}`)
            //         }
            //     }
            // }

            // brute force time

            let found;

            // up
            found = true;
            for (let c=1;c<word.length;c++) {
                if (grid.get(x,y-c) != word[c]) {
                    found = false;
                    break;
                }
            }
            if (found) total += 1;

            // down
            found = true;
            for (c=1;c<word.length;c++) {
                if (grid.get(x,y+c) != word[c]) {
                    found = false;
                    break;
                }
            }
            if (found) total += 1;

            // left
            found = true;
            for (c=1;c<word.length;c++) {
                if (grid.get(x-c,y) != word[c]) {
                    found = false;
                    break;
                }
            }
            if (found) total += 1;
            
            // right
            found = true;
            for (c=1;c<word.length;c++) {
                if (grid.get(x+c,y) != word[c]) {
                    found = false;
                    break;
                }
            }
            if (found) total += 1;

            // up-left
            found = true;
            for (c=1;c<word.length;c++) {
                if (grid.get(x-c,y-c) != word[c]) {
                    found = false;
                    break;
                }
            }
            if (found) total += 1;
            
            // up-right
            found = true;
            for (c=1;c<word.length;c++) {
                if (grid.get(x+c,y-c) != word[c]) {
                    found = false;
                    break;
                }
            }
            if (found) total += 1;

            // down-left
            found = true;
            for (c=1;c<word.length;c++) {
                if (grid.get(x-c,y+c) != word[c]) {
                    found = false;
                    break;
                }
            }
            if (found) total += 1;
            
            // down-right
            found = true;
            for (c=1;c<word.length;c++) {
                if (grid.get(x+c,y+c) != word[c]) {
                    found = false;
                    break;
                }
            }
            if (found) total += 1;

        }
    }
    console.log(`Located ${total} instances`);
};

module.exports.part_2 = async()=>{
    const data = input.split('\n').map(v=>v.trim()).map(v=>[...v]);
    const grid = new Grid(data);
    let total = 0;

    for (let x=0;x<grid.width();x++) {
        for (let y=0;y<grid.height();y++) {
            if (grid.get(x,y) == 'A') {
                const ld = (grid.get(x-1,y-1) == 'M' && grid.get(x+1,y+1) == 'S') || (grid.get(x-1,y-1) == 'S' && grid.get(x+1,y+1) == 'M');
                const ru = (grid.get(x-1,y+1) == 'M' && grid.get(x+1,y-1) == 'S') || (grid.get(x-1,y+1) == 'S' && grid.get(x+1,y-1) == 'M');
                if (ld && ru) {
                    total += 1;
                }
                
            }
        }
    }
    console.log(`${total} X-mas's found`)
};