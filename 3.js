const fs = require('node:fs')
const data = fs.readFileSync('./3.txt').toString().split('\n')/* bruh */.filter(e => e.length > 0)
let stub = [
    '467..114..', // 114 (top right)
    '...*......',
    '..35..633.',
    '......#...',
    '617*......',
    '.....+.58.', //  58 (middle right)
    '..592.....',
    '......755.',
    '...$.*....',
    '.664.598..',
]
let stub2 = [
    '12.......*..',
    '+.........34',
    '.......-12..',
    '..78........',
    '..*....60...',
    '78.........9',
    '.5.....23..$',
    '8...90*12...',
    '............',
    '2.2......12.',
    '.*.........*',
    '1.1..503+.56',
]

let stub3 = [
    '12.......*..',
    '+.........34',
    '.......-12..',
    '..78........',
    '..*....60...',
    '78..........',
    '.......23...',
    '....90*12...',
    '............',
    '2.2......12.',
    '.*.........*',
    '1.1.......56',
]

let stub4 = [
    '.......5......',
    '..7*..*.....4*',
    '...*13*......9',
    '.......15.....',
    '..............',
    '..............',
    '..............',
    '..............',
    '..............',
    '..............',
    '21............',
    '...*9.........',
]

let stub5 = [
    '....11',
    '......',
    '....22',
    '33+...',
    '......',
    '44+.44',
    '......',
    '+55.55',
    '.....+',
]


// char in 48-57 range
const isNumber = ch => /[0-9]/.test(ch);
// empty symbol
const isPeriod = ch => ch == '.'
// any non reserved symbol
const isSymbol = ch => false == isNumber(ch) && false == isPeriod(ch)
// 
const findNumbers = line => {
    let found = [];
    let current = {} // start, value
    for (let i = 0; i < line.length; i++) {
        let ch = line[i]
        if (isNumber(ch)) {
            if ('start' in current == false) current.start = i
            if ('value' in current == false) current.value = []
            current.value.push(ch)
        }
        if (!isNumber(ch) && 'value' in current && current.value.length > 0) {
            current.value = current.value.join('')
            found.push(current)
            current = {}
        }
    }
    if ('value' in current && current.value.length > 0) {
        current.value = current.value.join('')
        found.push(current)
    }
    return found;
}

// if no access, return empty (dot) space symbol
const access2DIndex = (a, y, x) => {
    try {
        let row = a[y]
        if (row == undefined) return '.'
        let cell = row[x]
        if (cell == undefined) return '.'
        return cell
    } catch (error) {
        return '.'
    }
}
const searchAround = (lines, data) => {
    let { start, length, value, line } = data;
    let top = [], mid = [], bot = [];
    for (let i = start - 1; i <= start + length; i++) {
        let t = access2DIndex(lines, line - 1, i);
        let m = access2DIndex(lines, line + 0, i);
        let b = access2DIndex(lines, line + 1, i);
        top.push(t);
        mid.push(m);
        bot.push(b);
    }
    let around = [top, mid, bot].some(row => row.some(isSymbol));

    /*
    console.log([top, mid, bot].map(row => row.join('')).join('\n'))
    console.log('result:', around)
    console.log('\n')
 
    example of output for each number:
    ....
    .78.
    .*..
    result: true
    
    ....
    .60.
    ....
    result: false
    */
    return around;
};
// number centric approach
const main = (input) => {
    let numbers = []
    // grab all numbers
    for (let i = 0; i < input.length; i++) {
        let line = input[i]
        let temp = findNumbers(line)
        if (temp.length == 0) continue
        numbers.push(...temp.map(e => {
            let { start, value } = e
            let temp = {
                start,
                value,
                length: value.length,
                line: i,
            }
            temp.around = searchAround(input, temp)
            return temp
        }))
    }
    // select only with non-restricted symbol in area, then sum up
    return numbers
    .filter(e => e.around == true)
    .reduce((a, e) => a + parseInt(e.value), 0)
}
// console.log(main(stub)) // 4361
// console.log(main(stub2)) // 925
// console.log(main(stub3)) // 413
// console.log(main(stub4)) // 62 
// console.log(main(stub5)) // 187
console.log(main(data)) // 507214
// 