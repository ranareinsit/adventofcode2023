const fs = require('node:fs')
const util = require('util');

const data = fs.readFileSync('./4.txt')
    .toString()
    .split('\n')
    .filter(e => e.length > 0)

let stub = [
    'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53',
    'Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19',
    'Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1',
    'Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83',
    'Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36',
    'Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11',
]

const extract_data = line => {
    line = line.slice(4)
    let index = line.indexOf(':')
    index = line.slice(0, index)
    line = line.slice(line.indexOf(':') + 1).trim()
    let [l, r] = line.split(' | ')

    return [index.trim().toString(), {
        'l': l.split(' ').filter(e => e.length > 0),
        'r': r.split(' ').filter(e => e.length > 0),
        'i': index.trim().toString(),
        'a': 1,
        's': 0
    }]
}

const interesct = (l, r) => {
    return r.reduce((a, e) => {
        let r = a.remaining.indexOf(e)
        if (r != -1) {
            a.found.push(a.remaining[r])
            a.remaining[r] = -1
        }
        return a
    }, { found: [], remaining: [...l] }).found
}

const main = (input) => {
    let result = new Map(input.map(e => {
        let r = extract_data(e)
        r[1].j = interesct(r[1].l, r[1].r).map((_, i0) => parseInt(r[1].i) + i0 + 1)
        if (r[1].j.length > 0) {
            r[1].s = Math.pow(2, r[1].j.length) + 1
        }
        return r
    }))

    for (let i = 1; i < result.size + 1; i++) {
        const current = result.get(i.toString());
        const size = current.j.length;
        for (let j = 1; j < size + 1; j++) { // 🤷‍♂️🤷‍♂️🤷‍♂️
            let idx = (j + i).toString()
            let increment = current.a
            let next = result.get(idx)
            next.a += increment
            result.set(idx, next)
        }
    }
    return [...result.values()]
        .map(e => e.a)
        .reduce((a, e) => a + e, 0)

    // bruh
    // let queue = [...result.keys()]
    // while (queue.length > 0) {
    //     let current = queue.shift()
    //     let { l, r, i, a, j, s } = result.get(current)
    //     let temp = j.map(e => e.toString())
    //     queue.push(...temp)
    //     let next = result.get(i)
    //     next.a = next.a + 1
    //     result.set(i, next)
    // }
}

console.log(main(stub)) // 30
console.log(main(data)) // 5329815
