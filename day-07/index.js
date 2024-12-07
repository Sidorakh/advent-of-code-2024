

const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');

function* generate_combinations(chars, length) {
    //Generate for each word length
    for (i = 0; i <= length; i++) {
        word = (chars[0] || '').repeat(i);
        yield word;

        for (j = 1; j < Math.pow(chars.length, i); j++) {

            //Make iteration for all indices of the word
            for(k = 0; k < i; k++) {

                //check if the current index char need to be flipped to the next char.
                    if(!(j % Math.pow(chars.length, k))) {
                    // Flip the current index char to the next
                    let charIndex = chars.indexOf(word[k]) + 1;
                    char = chars[charIndex < chars.length ? charIndex : 0];
                    word = word.substr(0, k) + char + word.substr(k + char.length);
                }
            }
            yield word;
        }
    }
}

module.exports.part_1 = async()=>{
    const statements = input.split('\n').map(v=>v.split(':')).map(v=>({target: parseInt(v[0]), components: v[1].trim().split(' ').map(v=>parseInt(v))}));
    let total = 0;
    for (const statement of statements) {
        const len = statement.components.length-1;
        const combinations = generate_combinations('+*',len,len);
        let combo = null;
        while (combo = combinations.next()) {
            //console.log(combo.value);
            if (combo.done) break;
            const combination = combo.value;
            let result = statement.components[0];
            for (let i=0;i<combination.length;i++) {
                if (combination[i] == '+') {
                    result += statement.components[i+1];
                } else if (combination[i] == '*') {
                    result *= statement.components[i+1];
                }
            }
            if (result == statement.target) {
                total += result;
                break;
            }

        }

    }
    console.log(`Total: ${total}`);
};

module.exports.part_2 = async()=>{
    const statements = input.split('\n').map(v=>v.split(':')).map(v=>({target: parseInt(v[0]), components: v[1].trim().split(' ').map(v=>parseInt(v))}));
    let total = 0;
    for (const statement of statements) {
        const len = statement.components.length-1;
        const combinations = generate_combinations('+*|',len,len);
        let combo = null;
        while (combo = combinations.next()) {
            //console.log(combo.value);
            if (combo.done) break;
            const combination = combo.value;
            let result = statement.components[0];
            for (let i=0;i<combination.length;i++) {
                if (combination[i] == '+') {
                    result += statement.components[i+1];
                } else if (combination[i] == '*') {
                    result *= statement.components[i+1];
                } else if (combination[i] == '|') {
                    result = parseInt(`${result}${statement.components[i+1]}`);
                }
            }
            if (result == statement.target) {
                total += result;
                break;
            }

        }

    }
    console.log(`Total: ${total}`);
};