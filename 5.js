const fs = require('node:fs')
const { inspect } = require('util');
const print = (data, ...args) => {
    console.log(inspect(
        data,
        { compact: true, depth: null, breakLength: 120, colors: true }
    ))
    console.log(...args)
}

const keys = [
    `seeds:`,
    `seed-to-soil map:`,
    `soil-to-fertilizer map:`,
    `fertilizer-to-water map:`,
    `water-to-light map:`,
    `light-to-temperature map:`,
    `temperature-to-humidity map:`,
    `humidity-to-location map:`,
].map((e, i) => i == 0 ? e.slice(0, -1) : e.slice(0, -5))

const pipeline = keys.slice(1)

const data = fs.readFileSync('./5.txt')
    .toString()
    .split('\n')
    .reduce((a, e, i) => {
        if (e == '') {
            a.unshift([])
            return a
        }
        a[0].push(e)
        return a
    }, [[]])
    .reverse()
    .slice(0, -1)
    .reduce((a, e, i, o) => {
        if (i == 0) {
            a[keys[i]] = e[0].split(': ')[1].split(' ')
            return a
        }
        a[keys[i]] = e.slice(1).map(e => e.split(' '))
        return a
    }, {})

const stub = {
    'seeds': ['79', '14', '55', '13'], // NOT OK: // OK: '79','14', '55','13'
    //
    'seed-to-soil': [
        ['50', '98', '2'], // range , source , length // [[50,51], [98,99]] // 98->50, 99-> 51
        ['52', '50', '48'] // [ 52:99, 50:97 ] 
    ],
    'soil-to-fertilizer': [
        ['0', '15', '37'],
        ['37', '52', '2'],
        ['39', '0', '15']
    ],
    'fertilizer-to-water': [
        ['49', '53', '8'],
        ['0', '11', '42'],
        ['42', '0', '7'],
        ['57', '7', '4']
    ],
    'water-to-light': [
        ['88', '18', '7'],
        ['18', '25', '70']
    ],
    'light-to-temperature': [
        ['45', '77', '23'],
        ['81', '45', '19'],
        ['68', '64', '13']
    ],
    'temperature-to-humidity': [
        ['0', '69', '1'],
        ['1', '0', '69']
    ],
    'humidity-to-location': [
        ['60', '56', '37'],
        ['56', '93', '4']
    ]
}

// seed -> soil                                  -> fertilizer                   -> water   -> light           -> temperature -> humidity -> location
// 79   -> 79 in (50+48) => 79+2 in (52+48) = 81 -> 81 -> not in -> 81 = 81      ->   81    ->     74          ->     78      ->   78     ->   82    
// 14   -> 14 not in => 14                  = 14 ->                              ->         ->                 ->             ->          ->         
// 55   -> 55 in (50+48) => 55+2 in (52+48) = 57 ->                              ->         ->                 ->             ->          ->         
// 13   -> 13 not in => 13                  = 13 ->                              ->         ->                 ->             ->          ->         

const transform = (group, name) => {
    let [destination, source, length] = group.map(e => parseInt(e))
    let result = {}
    result.destination = {
        min: destination,
        max: destination + length - 1
    }
    result.source = {
        min: source,
        max: source + length - 1
    }

    result.length = length
    result.name = name
    return result
}

const between = (itm, min, max) => {
    return itm >= min && itm <= max
}

const correlate = (value, row) => {
    let diff = row.destination.min - row.source.min
    let result = value + diff
    return result
}

/*
Any source numbers that aren't mapped correspond to the same destination number. 
So, seed number 10 corresponds to soil number 10.
*/
const solve = (data, seed) => {
    let queue = [...pipeline]
    let last = seed
    while (queue.length > 0) {
        let key = queue.shift()
        let current = data[key]
        for (let row of current) {
            let in_source = between(last, row.source.min, row.source.max)
            if (in_source) {
                let res = correlate(last, row)
                if (res !== null) {
                    last = res
                    break
                }
            }
        }
    }

    return last
}


const main = (input) => {
    let unwrapped = {}
    for (let map in input) {
        if (map == 'seeds') {
            unwrapped[map] = input[map].map(e => parseInt(e))
            continue
        }
        let groups = input[map]
        let result = groups.map(group => transform(group, map))
        unwrapped[map] = result
    }
    // print(unwrapped)
    let result = unwrapped.seeds.map(seed => solve(unwrapped, seed))
    return Math.min(...result)
}

console.log(main(stub)) // 35
console.log(main(data)) // 650599855
