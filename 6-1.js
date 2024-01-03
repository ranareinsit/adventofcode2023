const fs = require('node:fs')
const { inspect } = require('util');
const load_dataset = () => fs.readFileSync('./6.txt').toString()
const print = (data, ...args) => {
    console.log(inspect(
        data,
        { compact: true, depth: null, breakLength: 120, colors: true }
    ))
    console.log(...args)
}
// 
const stub = `
Time:      7  15   30
Distance:  9  40  200
`.trim()

const parse_data = (input) => {
    input = input.split(/\n/gi)
    input = input
        .map(line => line.split(':'))
        .map(line => [line[0], line[1].trim().split(/\s+/)])
        .reduce((a, e) => (
            a[e[0].toLowerCase()] = e[1].map(Number),
            a
        ), {})
    return input
}

function calculate(time, distance) {
    let result = 0
    for (let holdDuration = 0; holdDuration <= time; holdDuration++) {
        if (holdDuration * (time - holdDuration) > distance) result++
    }
    return result
}

const main = input => {
    const unwrapped = parse_data(input)
    return unwrapped.time
        .map((e, i) => calculate(e, unwrapped.distance[i]))
        .reduce((a, e) => a * e, 1)
}

console.log(main(stub))
console.log(main(load_dataset()))
