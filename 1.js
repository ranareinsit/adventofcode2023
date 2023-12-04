const fs = require('node:fs')

function main(lines) {
    let sum = 0;
    for (const line of lines) {
        const firstDigitMatch = line.match(/\d/);
        const lastDigitMatch = line.match(/\d(?=\D*$)/);
        if (firstDigitMatch && lastDigitMatch) {
            const firstDigit = parseInt(firstDigitMatch[0]);
            const lastDigit = parseInt(lastDigitMatch[0]);
            sum += parseInt(`${firstDigit}${lastDigit}`);
        }
    }
    return sum;
}


let data = fs.readFileSync('./input.txt').toString().split('\n')
const result = main(data);
console.log("Sum of all calibration values:", result);
// answer: 54561
// That's the right answer! You are one gold star closer to restoring snow operations. [Continue to Part Two]