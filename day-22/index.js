const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');

function parse_input(/** @type {string} */ input) {
    const lines = input.split('\n').map(v=>v.trim()).map(v=>BigInt(v));
    return lines;
}

const cache = new Map();
function increment_secret(secret) {
    if (cache.has(secret)) {
        return cache.get(secret);
    }
    const orig = secret;
    const mul = secret * 64n;
    secret = secret ^ mul;
    const mul_prune = secret % 16777216n;
    const div = mul_prune / 32n;
    secret = mul_prune ^ div;
    const div_prune = secret % 16777216n;
    const mul_2048 = div_prune * 2048n;
    secret = mul_2048 ^ div_prune;
    secret = secret % 16777216n;

    
    cache.set(orig,secret);
    return secret;

}


module.exports.part_1 = async()=>{
    const secrets = parse_input(input);

    let total = 0n;

    for (let secret of secrets) {
        for (let i=0;i<2000;i++) {
            secret = increment_secret(secret);
        }
        total += secret;
    }
    console.log(`Total: ${total}`);
};

function get_ones_digit(num) {
    return parseInt(`${num}`.slice(-1));
}

module.exports.part_2 = async()=>{
    const secrets = parse_input(input);

    const iterations = 2000;

    const seq_totals = new Map();

    for (const code of secrets) {
        const series = [code];
        const differences = [];

        for (let i=1;i<=iterations;i++) {
            series.push(increment_secret(series[i-1]));
            differences.push(get_ones_digit(series[i])-get_ones_digit(series[i-1]));
        }
        const checked = new Set();

        for (let j=3;j<differences.length;j++) {
            const key = differences.slice(j-3,j+1).join(',');
            if (!checked.has(key)) {
                if (!seq_totals.has(key)) {
                    seq_totals.set(key,0);
                }
                seq_totals.set(key,seq_totals.get(key)+get_ones_digit(series[j+1]));
            }
            checked.add(key);
        }
    }

    const entries = [...seq_totals.entries()];

    const max = entries.sort((a,b)=>b[1]-a[1])[0];
    console.log(`${max[0]}: ${max[1]}`);


};

