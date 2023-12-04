const fs = require('node:fs')

let stub = [
    'two1nine',
    'eightwothree',
    'abcone2threexyz',
    'xtwone3four',
    '4nineeightseven2',
    'zoneight234',
    '7pqrstsixteen',
    // 'nineighthreesevenoneightnine' edge case
]

const mapping = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
}

const digitMapping = [
    ['one', 1],
    ['two', 2],
    ['three', 3],
    ['four', 4],
    ['five', 5],
    ['six', 6],
    ['seven', 7],
    ['eight', 8],
    ['nine', 9],
    ['1', 1],
    ['2', 2],
    ['3', 3],
    ['4', 4],
    ['5', 5],
    ['6', 6],
    ['7', 7],
    ['8', 8],
    ['9', 9],
];

// 11000 <= sum <= 99000; 99 >= n >= 11
function main(input) {
    let sum = [];
    for (const line of input) {
        let found = []
        for (let i = 0; i < digitMapping.length; i++) {
            let [key, value] = digitMapping[i]
            let si = line.indexOf(key)
            let ei = line.lastIndexOf(key)
            let pos = si == ei ? [si] : [si, ei]
            if (pos[0] == -1 || pos[1] == -1) {
                continue
            }
            found.unshift({
                key,
                pos
            })
        }
        if (found.length == 0) continue
        // console.log(found)
        let min = found.reduce((a, e) => Math.min(...e.pos) <= Math.min(...a.pos) ? e : a, found[0])
        let max = found.reduce((a, e) => Math.max(...e.pos) >= Math.max(...a.pos) ? e : a, found[0])
        min = mapping[min.key]
        max = mapping[max.key]
        let str = `${min}${max}`
        // console.log(min, max)
        sum.push(parseInt(str))
    }
    return sum.reduce((a, e) => a + e, 0);
}
let data = fs.readFileSync('./input.txt').toString().split('\n')
const result = main(data);
console.log("Sum of all calibration values:", result);

/*
54076

That's the right answer! You are one gold star closer to restoring snow operations.

You have completed Day 1! You can [Share] this victory or [Return to Your Advent Calendar].
*/