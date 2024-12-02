const fs = require('fs');
const path = require('path');
const input = fs.readFileSync(path.join(__dirname,'./input.txt'),'utf8').split('\n').map(v=>v.trim()).map(v=>v.split(/\s/));
module.exports.part_1 = async()=>{
    let safe = 0;
    for (const report of input) {
        
        const diffs = [];
        for (let i=1;i<report.length;i++) {
            const a = parseInt(report[i-1]);
            const b = parseInt(report[i]);
            diffs.push(a-b)
        }
        
        let is_safe = true;
        for (let i=0;i<diffs.length;i++) {
            if (i > 0) {
                if (Math.sign(diffs[i-1]) != Math.sign(diffs[i])) {
                    is_safe = false;
                    break;
                }
            }
            if (Math.abs(diffs[i]) > 3 || Math.abs(diffs[i]) == 0) {
                is_safe = false;
                break;
            }
        }
        if (is_safe) {
            safe +=1;
        }
    }
    console.log(`${safe} reports are safe`);
};

function is_report_safe(report=[]) {
    const diffs = [];
    for (let i=1;i<report.length;i++) {
        const a = parseInt(report[i-1]);
        const b = parseInt(report[i]);
        diffs.push(a-b)
    }
    
    let is_safe = true;
    for (let i=0;i<diffs.length;i++) {
        if (i > 0) {
            if (Math.sign(diffs[i-1]) != Math.sign(diffs[i])) {
                is_safe = false;
                break;
            }
        }
        if (Math.abs(diffs[i]) > 3 || Math.abs(diffs[i]) == 0) {
            is_safe = false;
            break;
        }
    }
    return is_safe;
}

module.exports.part_2 = async()=>{
    let safe = 0;
    for (const report of input) {
        
        if (is_report_safe(report)) {
            safe += 1;
        } else {
            for (let i=0;i<report.length;i++) {
                const copy = [...report];
                copy.splice(i,1);
                if (is_report_safe(copy)) {
                    safe += 1;
                    break;
                }
            }
            
        }
    }
    console.log(`${safe} reports are safe`);
};