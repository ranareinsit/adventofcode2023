const fs = require('node:fs')
const util = require('util');

const data = fs.readFileSync('./3.txt').toString().split('\n')/* bruh */.filter(e => e.length > 0)
let stub = [
    '467..114..', // 467 *
    '...*......', // 35  = 16345
    '..35..633.',
    '......#...',
    '617*......',
    '.....+.58.',
    '..592.....',
    '......755.', // 755
    '...$.*....', // *
    '.664.598..', // 598 = 451490
]

// char in 48-57 range
const isNumber = ch => /[0-9]/.test(ch);
// empty symbol
const isPeriod = ch => ch == '.'
// any non reserved symbol
const isSymbol = ch => false == isNumber(ch) && false == isPeriod(ch)
// is asterisk
const isAsterisk = ch => ch == '*'
// 
const findNumbers = line => {
    let found = [];
    let current = {} // p, v
    for (let i = 0; i < line.length; i++) {
        let ch = line[i]
        if (isNumber(ch)) {
            if ('p' in current == false) current.p = i
            if ('v' in current == false) current.v = []
            current.v.push(ch)
        }
        if (!isNumber(ch) && 'v' in current && current.v.length > 0) {
            current.v = current.v
            found.push(current)
            current = {}
        }
    }
    if ('v' in current && current.v.length > 0) {
        current.v = current.v
        found.push(current)
    }
    return found;
}

const findAsterisk = line => {
    let found = [];
    for (let i = 0; i < line.length; i++) {
        if (line[i] == '*') {
            found.push({ p: i, v: '*' })
        }
    }
    return found;
}

const access2DIndex = (a, y, x) => {
    try {
        let row = a[y]
        if (row == undefined) return [-1, -1]
        let cell = row[x]
        if (cell == undefined) return [-1, -1]
        return [y, x]
    } catch (error) {
        return [-1, -1]
    }
}

const searchAsteriskAround = (lines, y, x) => {
    let top = [], mid = [], bot = [];
    for (let i = x - 1; i <= x + 1; i++) {
        let t = access2DIndex(lines, y - 1, i);
        let m = access2DIndex(lines, y + 0, i);
        let b = access2DIndex(lines, y + 1, i);
        top.push({ v: t, p: lines[t[0]][t[1]] });
        mid.push({ v: m, p: lines[m[0]][m[1]] });
        bot.push({ v: b, p: lines[b[0]][b[1]] });
    }
    let around = [top, mid, bot]
    return around;
};

const searchNumberAround = (lines, li, data) => {
    let { start, value } = data;
    let length = value.length
    let line = lines[li]
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
    console.log([top, mid, bot])

    return around;
};

function matchNumber(map, index) {

}
// Asterisk centric approach
const main = (input) => {
    let found = []
    let numbers = []
    let asterisks = []
    for (let i = 0; i < input.length; i++) {
        let line = input[i]
        let temp_a = findAsterisk(line).map(el => {
            el.i = i
            el.e = el.p + el.v.length
            return el
        })
        let temp_n = findNumbers(line).map(el => {
            el.i = i
            el.e = el.p + el.v.length
            return el
        })
        temp_a.length > 0 && asterisks.push(...temp_a)
        temp_n.length > 0 && numbers.push(...temp_n)
    }
    let affected_area = asterisks.map((current) => {
        let { p, v, i, e } = current
        let around = searchAsteriskAround(input, i, p)
        return around.flat()//.map(e => e.v)
    })

    numbers = numbers.map((e, i) => {
        let coords = e.v.map((e0, i) => [e.i, e.p + i])
        return { p: coords, v: e.v.join('') }
    })

    for (let i = 0; i < affected_area.length; i++) {
        let zone = affected_area[i]
        let found_in_zone = {}
        for (let j = 0; j < zone.length; j++) {
            let pos = zone[j].v

            for (let k = 0; k < numbers.length; k++) {
                let number = numbers[k].p
                if (number.some(coord => coord[0] == pos[0] && coord[1] == pos[1])) {
                    found_in_zone[numbers[k].v] = numbers[k]
                }
            }
        }
        found.push(found_in_zone)
    }
    return found
        .filter(e => Object.keys(e).length == 2)
        .map(e => Object.keys(e).reduce((a, e) => a * parseInt(e), 1))
        .reduce((a, e) => a + e, 0)

}
console.log(main(stub)) // 467835  // 16345 + 
console.log(main(data)) // 72553319
