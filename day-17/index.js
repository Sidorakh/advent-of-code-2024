const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');
/**
 * @typedef Registers 
 * @property {number} a 
 * @property {number} b 
 * @property {number} c
 */

/**
 * @typedef {number[]} Program
 */

function parse_input(/** @type {string} */ input) {
    const lines = input.split('\n');
    const registers = {
        a: 0,
        b: 0,
        c: 0,
    }
    /** @type {number[]} */
    const program = [];
    for (const line of lines) {
        if (line.startsWith('Register')) {
            const [lhs,rhs] = line.replace('Register','').trim().split(': ').map(v=>v.toLowerCase());
            registers[lhs] = parseInt(rhs);
        } else if (line.startsWith('Program')) {
            const program_string = line.replace('Program: ','').split(',').map(v=>parseInt(v));
            program.push(...program_string);
        }
    }
    return {
        registers,
        program,
    }
}

const instructions = [
    'adv',  // divide - A / 2 ** c -> A
    'bxl',  // bitwise xor - B ^ l -> B
    'bst',  // c mod 8 -> B
    'jnz',  // if a == 0, no - else jump to literal
    'bxc',  // B ^ C -> B
    'out',  // console.log(c mod 8)
    'bdv',  // divide - A / 2 ** c -> B
    'cdv',  // divide - A / 2 ** c -> C

]



const ops = {
    adv: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {number}*/ arg,/** @type {number}*/ i)=>{
        const num = registers.a;
        let den = combo(arg,registers);
        registers.a = Math.floor(num/(2**den));
        return {
            jump: null,
            out: null,
        }
    },
    bxl: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {number}*/ arg,/** @type {number}*/ i)=>{
        registers.b = registers.b ^ arg;
        return {
            jump: null,
            out: null,
        }
    },
    bst: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {number}*/ arg,/** @type {number}*/ i)=>{
        arg = combo(arg,registers);
        registers.b = arg % 8;
        return {
            jump: null,
            out: null,
        }
    },
    jnz: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {number}*/ arg,/** @type {number}*/ i)=>{
        if (registers.a == 0) {
            return {
                jump: null,
                out: null,
            }
        }
        return {
            jump: arg,
            out: null,
        }
    },
    bxc: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {number}*/ arg,/** @type {number}*/ i)=>{
        registers.b = registers.b ^ registers.c;
        return {
            jump: null,
            out: null,
        }
    },
    out: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {number}*/ arg,/** @type {number}*/ i)=>{
        arg = combo(arg,registers);
        const out = arg % 8;
        return {
            jump: null,
            out: out,
        }
    },
    bdv: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {number}*/ arg,/** @type {number}*/ i)=>{
        const num = registers.a;
        let den = combo(arg,registers);
        registers.b = Math.floor(num/(2**den));
        return {
            jump: null,
            out: null,
        }
    },
    cdv: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {number}*/ arg,/** @type {number}*/ i)=>{
        const num = registers.a;
        let den = combo(arg,registers);
        registers.c = Math.floor(num/(2**den));
        return {
            jump: null,
            out: null,
        }
    }

};


const bigint_ops = {
    adv: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {BigInt}*/ arg,/** @type {BigInt}*/ i)=>{
        const num = registers.a;
        let den = bigint_combo(arg,registers);
        registers.a = (num/(2n**den));
        return {
            jump: null,
            out: null,
        }
    },
    bxl: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {number}*/ arg,/** @type {BigInt}*/ i)=>{
        registers.b = registers.b ^ arg;
        return {
            jump: null,
            out: null,
        }
    },
    bst: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {number}*/ arg,/** @type {BigInt}*/ i)=>{
        arg = bigint_combo(arg,registers);
        registers.b = arg % 8n;
        return {
            jump: null,
            out: null,
        }
    },
    jnz: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {number}*/ arg,/** @type {BigInt}*/ i)=>{
        if (registers.a == 0n) {
            return {
                jump: null,
                out: null,
            }
        }
        return {
            jump: arg,
            out: null,
        }
    },
    bxc: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {number}*/ arg,/** @type {BigInt}*/ i)=>{
        registers.b = registers.b ^ registers.c;
        return {
            jump: null,
            out: null,
        }
    },
    out: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {number}*/ arg,/** @type {BigInt}*/ i)=>{
        arg = bigint_combo(arg,registers);
        const out = arg % 8n;
        return {
            jump: null,
            out: Number(out),
        }
    },
    bdv: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {number}*/ arg,/** @type {BigInt}*/ i)=>{
        const num = registers.a;
        let den = bigint_combo(arg,registers);
        registers.b = (num/(2n**den));
        return {
            jump: null,
            out: null,
        }
    },
    cdv: (/** @type {Registers} */ registers,/** @type {Program}*/ program,/** @type {number}*/ arg,/** @type {BigInt}*/ i)=>{
        const num = registers.a;
        let den = bigint_combo(arg,registers);
        registers.c = (num/(2n**den));
        return {
            jump: null,
            out: null,
        }
    }

};

function combo(/** @type {number} */ num,/** @type {Registers} */ registers) {
    if (num <= 3) return num;
    if (num == 4) return registers.a;
    if (num == 5) return registers.b;
    if (num == 6) return registers.c;
}


function bigint_combo(/** @type {BigInt} */ num,/** @type {Registers} */ registers) {
    if (num <= 3n) return num;
    if (num == 4n) return registers.a;
    if (num == 5n) return registers.b;
    if (num == 6n) return registers.c;
}

module.exports.part_1 = async()=>{
    const {registers,program} = parse_input(input);
    
    const output = [];

    //console.log(registers);
    //console.log(program);

    for (let i=0;i<program.length;i++) {
        // read instruction + arg
        const op = program[i];
        const arg = program[i+1];
        i+=1;

        //console.log(`${i}-${instructions[op]}-${arg}`);
        const result = ops[instructions[op]](registers,program,arg,i);

        if (result.jump != null) {
            i = result.jump -1;
        }
        if (result.out != null) {
            output.push(result.out);
        }
    }
    console.log(output.join(','));
};

module.exports.part_2 = async()=>{
    const {registers,program} = parse_input(input);
    let output = [];

    // for (let i=0;i<program.length;i+=2) {
    //     console.log(`${instructions[program[i]]}: ${program[i+1]}`)
    // }
    
    const run = (a)=>{
        const {registers,program} = parse_input(input);
    
        registers.a = BigInt(a);
        registers.b = BigInt(registers.b);
        registers.c = BigInt(registers.c);

        const output = [];

        registers.a = a;

        for (let i=0n;i<BigInt(program.length);i++) {
            // read instruction + arg
            const op = BigInt(program[i]);
            const arg = BigInt(program[i+1n]);
            i+=1n;

            //console.log(`${i}-${instructions[op]}-${arg}`);
            const result = bigint_ops[instructions[op]](registers,program,arg,i);

            if (result.jump != null) {
                i = result.jump - 1n;
            }
            if (result.out != null) {
                output.push(result.out);
            }
        }
        return output;
    }
    

    // check every 3 bits! 
    //
    let a = 0n
    while (true) {
        const expected_output = program.join(',');
        const result = run(a);

        if (result.join(',') == expected_output) {
            // we have it!
            break;
        }

        if (expected_output.endsWith(result.join(','))) {
            // if it's on the right track
            a = a * 8n;
        } else {
            // try the next one
            a++;
        }
        
    }

    console.log(a);
    
};