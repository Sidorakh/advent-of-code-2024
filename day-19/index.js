const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');
function parse_input(/** @type {string} */ input) {
    const split = input.split('\n\n');

    const towels = split[0].split(', ');
    const patterns = split[1].split('\n');

    return {towels, patterns};
}

function is_pattern_possible(towels, pattern) {
    for (const towel of towels) {
        if (towel == pattern) return true;
        if (pattern.startsWith(towel) && is_pattern_possible(towels,pattern.slice(towel.length))) {
            return true;
        }
    }
    return false;
}


const pattern_cache = new Map();
function find_pattern_combinations(towels,pattern) {
    let combinations = 0;
    for (const towel of towels) {
        if (towel == pattern) {
            combinations += 1;
        }
        if (pattern.startsWith(towel)) {
            const key = pattern.slice(towel.length);
            if (!pattern_cache.has(pattern)) {
                let val = find_pattern_combinations(towels,key);
                pattern_cache.set(key,find_pattern_combinations(towels,key))

            }
            combinations += pattern_cache.get(key);
        }
    }
    return combinations;
}

module.exports.part_1 = async()=>{
    const {towels, patterns} = parse_input(input);

    let possible = 0;
    for (const pattern of patterns) {
        if (is_pattern_possible(towels, pattern)) {
            possible += 1;
        }
    }
    console.log(`${possible} arrangements are possible`)
};

module.exports.part_2 = async()=>{
    const {towels, patterns} = parse_input(input);
    let total = 0;

    for (const pattern of patterns) {
        const combinations = find_pattern_combinations(towels,pattern);
        total += combinations;
    }
    console.log(`${total} combinations were found`)
};

process.on('uncaughtException',()=>{
    console.log(pattern_cache.size);
    process.exit();
})