const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');

function parse_input(/** @type {string} */ input) {
    const [wire_lines,gate_lines] = input.split('\n\n').map(v=>v.split('\n'));
    /** @type {Map<string,number>} */
    const wires = new Map();
    /** @type {{left: string, operator: 'XOR'|'AND'|'OR', right: string, destination: string}[]} */
    const gates = [];

    for (const wire of wire_lines) {
        //console.log(wire);
        const [lhs, rhs] = wire.split(': ');
        wires.set(lhs,parseInt(rhs));
    }

    for (const gate of gate_lines) {
        const match = gate.match(/(?<left>\w+) (?<operator>\w+) (?<right>\w+) \-\> (?<destination>\w+)/);
        if (match && match.groups) {
            const {left, operator, right, destination} = match.groups;
            gates.push({
                left,right,operator,destination
            });
        }
    }

    return {wires, gates};
    
}

function perform_operation(/** @type {number} */ left,/** @type {number} */ right,/** @type {'XOR'|'AND'|'OR'} */ operation) {
    opertation = operation.toUpperCase();
    if (operation == 'XOR') {
        return left ^ right;
    }
    if (operation == 'AND') {
        return left & right;
    }
    if (operation == 'OR') {
        return left | right;
    }
    throw "Incorrect operation";
}

function is_input(/** @type {{left: string, operator: 'XOR'|'AND'|'OR', right: string, destination: string}} */ gate) {
    return (gate.left.startsWith('x') || gate.right.startsWith('x'));
}

function is_output(/** @type {{left: string, operator: 'XOR'|'AND'|'OR', right: string, destination: string}} */ gate) {
    return gate.destination.startsWith('z');
    
}

module.exports.part_1 = async(log=true)=>{
    const {wires, gates} = parse_input(input);

    //console.log(wires);
    //console.log(gates);

    const stack = [...gates];

    while (stack.length > 0) {
        const node = stack.shift();
        if (!wires.has(node.left) || !wires.has(node.right)) {
            stack.push(node);
            continue;
        }
        if (wires.has(node.destination)) {
            continue;
        }
        const result = perform_operation(wires.get(node.left), wires.get(node.right), node.operator);
        wires.set(node.destination,result);
    };

    const keys = [...wires.keys()].filter(v=>v.startsWith('z')).sort().reverse();
    const num = keys.map(v=>wires.get(v)).join('')
    if (log) {
        console.log(`Result: ${parseInt(num,2)}`);
        console.log(`Result: ${num}`);
    }
    return num;
}

module.exports.part_2 = async()=>{
    const {wires, gates} = parse_input(input);

    //console.log(wires);
    //console.log(gates);

    const x_keys = [...wires.keys()].filter(v=>v.startsWith('x')).sort().reverse();
    const x = parseInt(x_keys.map(v=>wires.get(v)).join(''),2);
    const y_keys = [...wires.keys()].filter(v=>v.startsWith('y')).sort().reverse();
    const y = parseInt(y_keys.map(v=>wires.get(v)).join(''),2);
    
    const real_total = x+y;
    
    // console.log(real_bits);
    // console.log(z);

    // potential errornous gates
    const flagged = new Set();

    const input_xor_gates = gates.filter(is_input).filter(v=>v.operator == 'XOR');
    // XOR gates with x/y inputs can't output z (except for the first one) - all other XOR gates must output to z
    for (const gate of input_xor_gates) {
        if (gate.left == 'x00' || gate.right == 'x00') {
            if (gate.destination != 'z00') {
                flagged.add(gate.destination);
            }
            continue;
        } else if (gate.destination == 'z00') {
            flagged.add(gate.destination);
        }

        if (gate.destination.startsWith('z')) {
            flagged.add(gate.destination);
        }
    }

    // All other XOR gates must output to z
    const indirect_xor_gates = gates.filter(v=>v.operator == 'XOR').filter(v=>!is_input(v));
    for (const gate of indirect_xor_gates) {
        if (!is_output(gate)) {
            flagged.add(gate.destination);
        }
    }

    // output gates should be left XOR right -> out (except for last, should be OR)
    const output_gates = gates.filter(v=>is_output(v));
    for (const gate of output_gates) {
        // checks if it's the last out-bit
        if (gate.destination == `z45`) {    // probbaly shouldn't hardcode this
            if (gate.operator != 'OR') {
                flagged.add(gate.destination);
            }
            continue;
        } else if (gate.operator != 'XOR') {
            flagged.add(gate.destination);
        }
    }

    // gates from step 1 (input_xor_gates) should output to (indirect_xor_gates)


    const found_gates = [];
    for (const gate of input_xor_gates) {
        // skip if we've checked this one
        if (flagged.has(gate.destination)) continue;

        // z00 is safe - would have been flagged if problematic earlier
        if (gate.destination == 'z00') continue;

        const filtered = indirect_xor_gates.filter(v=>v.left == gate.destination || v.right == gate.destination);
        if (filtered.length == 0) {
            found_gates.push(gate);
            flagged.add(gate.destination);
        }
    }

    for (const gate of found_gates) {
        // - should output zXX (X = num)
        const correct_destination = `z${gate.left.slice(1)}`;

        const matches = indirect_xor_gates.filter(v=>v.destination == correct_destination);
        
        const match = matches[0];
        
        const components = [match.left,match.right];

        const found_or_gate = gates.find(v=>v.operator == 'OR' && components.includes(v.destination));

        flagged.add(components.find(v=>v!=found_or_gate.destination));
    }
    

    console.log([...flagged].sort().join(','));
    
};