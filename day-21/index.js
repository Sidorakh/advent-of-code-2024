const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');

function parse_input(/** @type {string}*/ input) {
    return input.split('\n');
}

function numpad_to_dpad(/** @type {string} */ code) {
    const char_positions = {
        'A': {x: 2, y: 3},
        '0': {x: 1, y: 3},
        '1': {x: 0, y: 2},
        '2': {x: 1, y: 2},
        '3': {x: 2, y: 2},
        '4': {x: 0, y: 1},
        '5': {x: 1, y: 1},
        '6': {x: 2, y: 1},
        '7': {x: 0, y: 0},
        '8': {x: 1, y: 0},
        '9': {x: 2, y: 0},
    }
    let x = char_positions.A.x;
    let y = char_positions.A.y;
    /** @type {string[]} */
    const out = [];
    for (const char of code) {
        const dest = char_positions[char];
        // if at bottom, do y-up first
        if (y == 3) {
            while (y > dest.y) {
                y -= 1
                out.push('^');
            }
        }
        while (x < dest.x) {
            x += 1;
            out.push('>');
        }
        while (x > dest.x) {
            x -= 1;
            out.push('<');
        }
        while (y < dest.y) {
            y += 1;
            out.push('v');
        }
        // and repeat this - should be harmless
        while (y > dest.y) {
            y -= 1
            out.push('^');
        }
        out.push('A');
    }
    return out.join('');
}

function dpad_to_dpad(/** @type {string} */ code) {
    const char_positions = {
        '^': {x: 1, y: 0},
        'A': {x: 2, y: 0},
        '<': {x: 0, y: 1},
        'v': {x: 1, y: 1},
        '>': {x: 2, y: 1},
    }

    let x = char_positions.A.x;
    let y = char_positions.A.y;
    const out = [];

    for (const char of code) {
        const dest = char_positions[char];
        // if top, do y first
        if (y == 0) {
            while (y < dest.y) {
                y += 1;
                out.push('v');
            }
        }
        while (x < dest.x) {
            x += 1;
            out.push('>');
        }
        while (x > dest.x) {
            x -= 1;
            out.push('<');
        }
        while (y > dest.y) {
            y -= 1;
            out.push('^');
        }
        while (y < dest.y) {
            y += 1;
            out.push('v');
        }
        out.push('A');
    }
    return out.join('');
}

module.exports.part_1 = async()=>{
    const codes = parse_input(input);

    let complexity_total = 0;
    for (const code of codes) {
        const combo = (dpad_to_dpad(dpad_to_dpad(numpad_to_dpad(code))));
        complexity_total += combo.length * parseInt(code.slice(0,-1));
    }

    console.log(`Total complexity: ${complexity_total}`);
};

module.exports.part_2 = async()=>{

};