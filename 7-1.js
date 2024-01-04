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

const stub2 = `
2345A 1
Q2KJJ 13
Q2Q2Q 19
T3T3J 17
T3Q33 11
2345J 3
J345A 2
32T3K 5
T55J5 29
KK677 7
KTJJT 34
QQQJA 31
JJJJJ 37
JAAAA 43
AAAAJ 59
AAAAA 61
2AAAA 23
2JJJJ 53
JJJJ2 41
`.trim()

const stub3 = `
AAAAA 2
22222 3
AAAAK 5
22223 7
AAAKK 11
22233 13
AAAKQ 17
22234 19
AAKKQ 23
22334 29
AAKQJ 31
22345 37
AKQJT 41
23456 43
`.trim()

const stub4 = `
627Q8 1
A26Q7 1
2K637 1
`.trim()

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

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
    if (Object.keys(hashmap).length != 1) return { result: false, values: null }
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
    if (Object.keys(hashmap).length != 2) return { result: false, values: null }
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
    if (Object.keys(hashmap).length != 2) return { result: false, values: null }
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
    if (Object.values(hashmap).some(v => v.length == 3) == false) return { result: false, values: null }
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
    if (Object.values(hashmap).some(v => v.length == 2) == false) return { result: false, values: null }
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
    if (Object.values(hashmap).some(v => v.length == 2) == false) return { result: false, values: null }
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
    if (Object.values(hashmap).some(v => v.length == 1) == false) return { result: false, values: null }
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
    if (result.values.length > 0) return result
    return { result: false, values: null }
}
// N-kind or N-pair or high
const clasify = (cards) => {
    let hashmap = {}
    cards.forEach((card, i) => {
        if (card in hashmap == false) hashmap[card] = []
        hashmap[card].push(i)
    })
    // from highest, to lowest
    let check = five_of_a_kind(hashmap)
    if (check.result) { return check }
    check = four_of_a_kind(hashmap)
    if (check.result) { return check }
    check = full_house(hashmap)
    if (check.result) { return check }
    check = three_of_a_kind(hashmap)
    if (check.result) { return check }
    check = two_pair(hashmap)
    if (check.result) { return check }
    check = one_pair(hashmap)
    if (check.result) { return check }
    check = high_card(hashmap)
    if (check.result) { return check }

    console.log(`not found:`, hashmap)
    return null
}
// with respect to a
const sortType = (a, b) => {
    if (a.type == b.type) {
        for (let i = 0; i < a.cards.length; i++) {
            let ai = ranks.indexOf(a.cards[i])
            let bi = ranks.indexOf(b.cards[i])
            if (ai == bi) continue
            return ai - bi
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
            a[e.type].push(e)
            return a
        }, {})

    let result = Object.values(unwrapped).map(group => {
        return group.sort((a, b) => sortType(a, b))
    })
    return result.flat().reduce((a, e, i) => a + ((i + 1) * e.bid), 0)
}

// print(main(stub)) // 6440
//print(main(stub2)) // 6592
//print(main(stub3)) // 1343
//print(main(stub4)) // 6
console.log(main(load_dataset())) // 255048101 That's the right answer!
