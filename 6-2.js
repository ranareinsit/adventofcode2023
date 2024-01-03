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
        .map(line => [line[0], line[1].trim().split(/\s+/).join('')])
        .reduce((a, e) => (
            a[e[0].toLowerCase()] = parseInt(e[1]),
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
    return calculate(unwrapped.time, unwrapped.distance)
}

console.log(main(stub)) // 71503
console.log(main(load_dataset())) // 36749103
