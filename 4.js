const fs = require('node:fs')
const util = require('util');

const data = fs.readFileSync('./4.txt')
    .toString()
    .split('\n')
    .filter(e => e.length > 0)

let stub = [
    'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53', // 48, 83, 17, and 86) are winning numbers!  worth 8 points (1 for the first match, then doubled three times for each of the three matches after the first).
    'Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19',
    'Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1',
    'Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83',
    'Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36',
    'Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11',
]

const extract_data = line => {
    let header = /Card [0-9]+: /;
    line = line.replace(header, '')
    let [l, r] = line.split(' | ')
    return [
        l.split(' ').filter(e => e.length > 0),
        r.split(' ').filter(e => e.length > 0)
    ]
}

const main = (input) => {
    let r = 0
    // left - win | right - have
    for (let i = 0; i < input.length; i++) {
        let result = (0)
        let [win, have] = extract_data(input[i])
        let { found } = have.reduce((a, e, i) => {
            let r = a.remaining.indexOf(e)
            if (r != -1) {
                a.found.push(a.remaining[r])
                a.remaining[r] = -1
            }
            return a

        }, { found: [], remaining: [...win] })
        // console.log(found)
        for (let i = 1; i <= found.length; i++) {
            if (i == 1) result++
            if (i > 1) {
                result *= 2
            }
        }
        r += result
    }
    // console.log(result)
    return r
}

console.log(main(stub)) // 13
console.log(main(data)) // 21105