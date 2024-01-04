const { group } = require('node:console');
const fs = require('node:fs')
const { inspect } = require('util');
const load_dataset = () => fs.readFileSync('./7.txt').toString()
const print = (data, ...args) => {
    console.log(inspect(
        data,
        { compact: true, depth: null, breakLength: 120, colors: true }
    ))
    console.log(...args)
}

const stub = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`.trim()


let stub2 = `
26A7K 738
97J54 1
7KK7K 794
3KKK5 451
955K9 827
Q9QA2 293
J2A28 200
J2K77 341
83888 196
J97K7 823
75TJ9 186
J7638 49
46K36 128
92JJJ 735
29A87 185
89449 100
3KAJK 445
QQ343 586
8466J 79
T3T37 362
252T4 528
A3A5J 242
6QQQT 822
7AJA6 615
K9625 268
KK3AK 517
5Q5Q8 658
T87K3 618
57629 788
A7A7Q 160
889TQ 741
TT59T 425
Q2KQJ 30
A4K3K 143
6664K 456
KK4J4 726
TTTTJ 437
QT824 132
J555J 478
75KK9 354
94979 34
K846J 432
QQ887 130
TT97T 170
66TQ6 878
57K78 993
88JK8 608
AK5Q3 907
AATAA 989
QJQ8J 533
8QQQQ 522
`.trim()

const ranks = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A']

const parse_data = (input) => {
    input = input.split(/\n/gi)
    input = input.map(row => {
        let [hand, bid] = row.split(' ')
        return {
            cards: hand.split(''),
            bid: parseInt(bid),
            type: null,
        }
    })
    return input
}

const five_of_a_kind = (hashmap) => {
    let type = 7
    for (let key in hashmap) {
        if (hashmap[key].length == 5) {
            return {
                result: true,
                type,
                rank: ranks.indexOf(key),
                values: hashmap[key]
            }
        }
    }
    return { result: false, values: null }
}
const four_of_a_kind = (hashmap) => {
    let type = 6
    for (let key in hashmap) {
        if (hashmap[key].length == 4) {
            return {
                result: true,
                type,
                rank: ranks.indexOf(key),
                values: hashmap[key]
            }
        }
    }
    return { result: false, values: null }
}
const full_house = (hashmap) => {
    let type = 5
    let result = {
        result: true,
        type,
        values: []
    }
    let free = 5
    for (let key in hashmap) {
        if (hashmap[key].length == 3) {
            free -= 3
            result.values.push({
                type: 4,
                rank: ranks.indexOf(key),
                values: hashmap[key]
            })
        }
        if (hashmap[key].length == 2) {
            free -= 2
            result.values.push({
                type: 3,
                rank: ranks.indexOf(key),
                values: hashmap[key]
            })
        }
    }
    if (free == 0 && result.values.length == 2) return result
    return { result: false, values: null }
}
const three_of_a_kind = (hashmap) => {
    let type = 4
    let result = {
        result: true,
        type,
        values: []
    }
    for (let key in hashmap) {
        if (hashmap[key].length == 3) {
            result.values.push({
                type,
                rank: ranks.indexOf(key),
                values: hashmap[key]
            })
        }
    }
    if (result.values.length > 0) return result
    return { result: false, values: null }
}
const two_pair = (hashmap) => {
    let type = 3
    let result = {
        result: true,
        type,
        values: []
    }
    for (let key in hashmap) {
        if (hashmap[key].length == 2) {
            result.values.push({
                type,
                rank: ranks.indexOf(key),
                values: hashmap[key]
            })
        }
    }
    if (result.values.length > 1) return result
    return { result: false, values: null }
}
const one_pair = (hashmap) => {
    let type = 2
    let result = {
        result: true,
        type,
        values: []
    }
    for (let key in hashmap) {
        if (hashmap[key].length == 2) {
            result.values.push({
                type,
                rank: ranks.indexOf(key),
                values: hashmap[key]
            })
        }
    }
    if (result.values.length > 0) return result
    return { result: false, values: null }
}
const high_card = (hashmap) => {
    let type = 1
    let result = {
        result: true,
        type,
        values: []
    }
    for (let key in hashmap) {
        if (hashmap[key].length == 1) {
            result.values.push({
                type,
                rank: ranks.indexOf(key),
                values: hashmap[key]
            })
        }
    }
    result.values = [result.values.sort((a, b) => b.rank - a.rank)[0]]
    if (result.values.length > 0) return result
    return { result: false, values: null }
}
const jswap = (hashmap) => {
    if ('J' in hashmap == false) return hashmap
    if (Object.keys(hashmap).length == 1) {
        if ('J' in hashmap) {
            hashmap['A'] = hashmap['J']
            delete hashmap['J']
            return hashmap
        }
    }
    let jokers = hashmap['J'].length
    let keys = Object.keys(hashmap).filter(e => e != 'J')
    let dp = keys.map(key => ranks.indexOf(key) * hashmap[key].length)
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        let cost = ranks.indexOf(key)
        let amount = hashmap[key].length
        dp[i] = Math.max(cost * Math.pow(100, amount), cost * Math.pow(100, amount + jokers))
    }
    let best = keys[dp.indexOf(Math.max(...dp))]
    hashmap[best] = hashmap[best].concat(hashmap['J'])
    delete hashmap['J']
    return hashmap
}

// N-kind or N-pair or high
const clasify = (cards) => {
    let hashmap = {}

    if (cards.join('') == 'J2A28') {
        console.log('...')
    }

    cards.forEach((card, i) => {
        if (card in hashmap == false) hashmap[card] = []
        hashmap[card].push(i)
    })

    hashmap = jswap(hashmap)

    let pm = [ // from highest, to lowest
        five_of_a_kind,
        four_of_a_kind,
        full_house,
        three_of_a_kind,
        two_pair,
        one_pair,
        high_card
    ]
    for (let i = 0; i < pm.length; i++) {
        let p = pm[i]
        let { result, type, values } = p(hashmap)
        if (result) {
            return { type, values }
        }
    }
    console.error(`not found:`, hashmap)
    return null
}
// with respect to a
const sortType = (a, b) => {
    if (a.type == b.type) {
        for (let i = 0; i < a.cards.length; i++) {
            let ai = ranks.indexOf(a.cards[i])
            let bi = ranks.indexOf(b.cards[i])
            if (ai != bi) {
                return ai - bi
            }
        }
        return 0
    }
    return a.type - b.type
}

const main = input => {
    let unwrapped = parse_data(input)
        .map(hand => {
            let clasified = clasify(hand.cards)
            hand.type = clasified.type
            hand.values = clasified.values
            return hand
        })
        .reduce((a, e) => {
            if (e.type in a == false) a[e.type] = []
            delete e.values
            a[e.type].push(e)
            return a
        }, {})

    let result = Object
        .values(unwrapped)
        .map(group => {
            return group.sort((a, b) => sortType(a, b))
        }).flat()
    // print(result)
    return result
        .reduce((a, e, i) => a + ((i + 1) * e.bid), 0)
}

print(main(stub)) // 5905
print(main(load_dataset())) // 253718286
