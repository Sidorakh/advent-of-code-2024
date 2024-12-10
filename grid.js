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


module.exports = Grid;