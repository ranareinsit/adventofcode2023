// file:///E:/Books/John%20O.%20S.%20Kennedy%20(auth.)%20-%20Dynamic%20Programming_%20Applications%20to%20Agriculture%20and%20Natural%20Resources-Springer%20Netherlands%20(1986).pdf
const fs = require('node:fs')
const { inspect } = require('util');

const parse_name = raw_name => raw_name.replace(' map:', '').split('-').slice(-1)[0]
const parse_values = value_row => {
    let [output, input, size] = value_row.trim().split(' ').map(e => parseInt(e))
    return {
        input: {
            min: input,
            max: input + size,
            size
        },
        output: {
            min: output,
            max: output + size,
            size
        },
        size,
    }
}
const parse_data = (input) => {
    const result = {}
    const raw_lines = input.trim().split('\n')
    let seeds = raw_lines.shift().split(':')[1].trim().split(' ').map(e => parseInt(e))
    result['seeds'] = []
    for (let i = 0; i < seeds.length - 1; i += 2) {
        result['seeds'].push({
            start: seeds[i],
            end: seeds[i] + seeds[i + 1],
            size: seeds[i + 1]
        })
    }
    raw_lines.shift() // remove empty line
    // traverse "maps"
    let group = []
    while (raw_lines.length > 0) {
        let current = raw_lines.shift()
        if (current.length == 0) {
            let [key, values] = [group[0], group.slice(1)]
            result[parse_name(key)] = values.map(e => parse_values(e))
            group = []
            continue
        }
        group.push(current)
    }
    // umgh... i forgot location key 🤷‍♂️
    let [key, values] = [group[0], group.slice(1)]
    result[parse_name(key)] = values.map(e => parse_values(e))
    // done
    return result
}
const load_dataset = () => fs.readFileSync('./5.txt').toString()
const print = (data, ...args) => {
    console.log(inspect(
        data,
        { compact: true, depth: null, breakLength: 120, colors: true }
    ))
    console.log(...args)
}
// 
const stub = `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`.trim()

const mapBy = (seed, variant) => {
    let { start, end, size: size0 } = seed
    let { input, output, size: size1 } = variant
    let diff = output.min - input.min

    let next = {
        start: start + diff < output.min ? output.min : start + diff,
        end: end + diff > output.max ? output.max : end + diff,
        size: size0 > size1 ? size1 : size0,
    }

    return next
}



const fit = (seed, input) => {
    if (
        seed.start < input.min &&
        seed.end > input.min &&
        seed.end <= input.max
    ) return 'part left join'
    if (
        seed.start > input.min &&
        seed.start < input.max
    ) return 'inner join'
    if (
        seed.start >= input.min &&
        seed.start < input.max &&
        seed.end > input.max
    ) return 'part right join'
    if (
        seed.start < input.min &&
        seed.end > input.max
    ) return 'full outer join'
    if (
        seed.start < input.min &&
        seed.end < input.min
    ) return 'no join far left'
    if (
        seed.start > input.max &&
        seed.end > input.min
    ) return 'no join far right'
    return null
}

const produce = (type, seed, stage) => {
    switch (type) {
        case 'part left join':
            return [
                //  remainings
                {
                    start: seed.start,
                    end: stage.input.min,
                    size: stage.input.min - seed.start
                },
                // next
                mapBy({
                    start: stage.input.min,
                    end: seed.end,
                    size: seed.end - stage.input.min
                }, stage)
            ]
        case 'inner join':
            return [
                // next
                mapBy(seed, stage)
            ]
        case 'part right join':
            return [
                //  remainings 
                {
                    start: seed.start,
                    end: stage.input.max,
                    size: stage.input.max - seed.start
                },
                // next 
                mapBy({
                    start: seed.start,
                    end: stage.input.max,
                    size: stage.input.max - seed.start
                }, stage)
            ]
        // bruh...
        /* case 'full outer join':
           return [
             //  remainings left
             {
               start: seed.start,
               end: stage.input.min,
               size: stage.input.min - seed.start
             },
             // remainings right
             {
               start: seed.start,
               end: stage.input.max,
               size: stage.input.max - seed.start
             },
             // next
             mapBy({
               start: stage.input.min,
               end: stage.input.max,
               size: stage.input.size
             }, stage)
           ]*/
        case 'no join far left':
            return -1
        case 'no join far right':
            return 1
        default:
            return null
    }
}

const solve = (seed, mutator) => produce(fit(seed, mutator.input), seed, mutator)

const main = (input) => {
    let unwrapped = parse_data(input)
    let stages = Object.keys(unwrapped)
    let seeds_map = new Map(stages.map(e => [e, []]))
    seeds_map.set('seeds', unwrapped.seeds)
    for (let i = 1; i < stages.length; i++) {
        let key = stages[i]
        let stage = unwrapped[key]
        // print(key, stage)
        let produced = []
        for (let j = 0; j < stage.length; j++) {
            let mutator = stage[j]
            let mapped_seeds = seeds_map.get(stages[i - 1])
            // print(key, mutator)
            for (let k = 0; k < mapped_seeds.length; k++) {
                let seed = mapped_seeds[k]
                let result = solve(seed, mutator)
                if (result == null) {
                    continue
                }
                if (Array.isArray(result)) {
                    produced.push(...result)
                    continue
                }
                if (typeof result == 'number') { // here we think about how to pass seeds range out of bounds
                    if (result == -1) {// seed range far left of input

                    }
                    if (result == 1) { // seed range far right of input
                        if (
                            produced.findIndex(e =>
                                e.start == seed.start &&
                                e.end == seed.end) == -1
                        ) {
                            produced.push(seed)
                        }
                    }


                }
            }
        }
        seeds_map.set(key, produced)
    }
    return seeds_map
        .get('location')
        .sort((a, b) => {
            let score = 0
            if (a.start <= b.start) score--
            // if (a.end < b.end) score--
            // if (a.size < b.size) score--

            return score
        })
        .filter(e => e.start != 0 && e.size > 0)[0].start
}

print(main(stub)) // 46
print(main(load_dataset())) // 1'240'035
