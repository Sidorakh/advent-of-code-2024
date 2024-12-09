const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8');

module.exports.part_1 = async()=>{
    const time_start = performance.now();
    let structure = [];
    let file_id = 0;
    for (let i=0;i<input.length;i++) {
        if (i % 2 == 0) {
            for (let j=0;j<parseInt(input[i]);j++) {
                structure.push(file_id);
            }
            file_id += 1;
        } else {
            for (let j=0;j<parseInt(input[i]);j++) {
                structure.push('.');
            }
            
        }
    }
    // structure built, now to process it
    const time_built_at = performance.now();
    console.log(`Structure built: ${time_built_at-time_start}ms`);
    for (let i=structure.length-1;i>0;i--) {
        for (let j=0;j<i;j++) {
            if (structure[j] == '.') {
                structure[j] = structure[i];
                structure[i] = '.';
                break;
            }
        }
    }
    const time_processed_at = performance.now();
    console.log(`Structure processed: ${time_processed_at-time_built_at}ms`);

    //console.log(structure.join(''));

    // and now, checksum

    let checksum = 0;
    for (let i=0;i<structure.length;i++) {
        if (structure[i] == '.') continue;
        // and now it'll definitely be a number
        checksum += parseInt(structure[i]) * i;
    }

    console.log(`Checksum: ${checksum}`);
    const time_finish = performance.now();
    console.log(`Time: ${time_finish-time_built_at}ms (${time_finish-time_start}ms)`);
};

module.exports.part_2 = async()=>{
    const time_start = performance.now();

    let structure = [];
    let file_id = 0;
    for (let i=0;i<input.length;i++) {
        if (i % 2 == 0) {
            for (let j=0;j<parseInt(input[i]);j++) {
                structure.push(file_id);
            }
            file_id += 1;
        } else {
            for (let j=0;j<parseInt(input[i]);j++) {
                structure.push('.');
            }
        }
    }

    // structure buiilt, now to compact it
    const time_built_at = performance.now();
    console.log(`Structure built: ${time_built_at-time_start}ms`);
    //console.log(structure.join(''));
    
    for (let i=structure.length-1;i>0;i--) {
        // start on a file
        while (structure[i] == '.') {
            i -= 1;
        }

        const c = structure[i];
        const end = i;
        while (c == structure[i]) {
            i -= 1;
        }
        i+=1;
        //console.log(`${i},${end},${end-i}`)
        
        let start = 0;
        for (let j=0;j<i;j++) {
            if (structure[j] == '.') {  // if blank space
                start = j;
                while (structure[j] == '.') {
                    j += 1;
                }
                if ((j-start) > (end-i)) {
                    //console.log(`${start},${j}`);
                    for (let k=0;k<=(end-i);k++) {
                        structure[start+k] = structure[i+k];
                        structure[i+k] = '.';
                    }
                    break;
                }
                

            }
        }
        //console.log(structure.join(''));
    }

    const time_processed_at = performance.now();
    console.log(`Structure processed: ${time_processed_at-time_built_at}ms`);


    //console.log(structure.join(''));
    // and now, checksum

    let checksum = 0;
    for (let i=0;i<structure.length;i++) {
        if (structure[i] == '.') continue;
        // and now it'll definitely be a number
        checksum += parseInt(structure[i]) * i;
    }

    console.log(`Checksum: ${checksum}`);
    const time_finish = performance.now();
    console.log(`Time: ${time_finish-time_built_at}ms (${time_finish-time_start}ms)`);


};