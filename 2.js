const fs = require('node:fs')

const data = fs.readFileSync('./input-2.txt').toString().split('\n').filter(e => e.length > 0)

let stub = [
    'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green',
    'Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue',
    'Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red',
    'Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red',
    'Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green'
]

let hm = {
    red: 12,
    green: 13,
    blue: 14,
}

// 
const main = input => input
    .reduce((a, e, i) => {
        let result = {
            index: i + 1,
            fit: true
        }
        let string = e
        let header = /Game [0-9]+: /;
        string = string.replace(header, '')
        let sets = string.split(';').map(set => {
            let amount = set.split(', ')
            return amount.reduce((a, e) => {
                let [count, color] = e.trim().split(' ')
                a[color] = count
                return a
            }, {})
        })
        for (let j = 0; j < sets.length; j++) {
            let set = sets[j]
            let hm = {
                red: 12,
                green: 13,
                blue: 14,
            }
            for (let c in hm) {
                if (c in set == false) continue
                hm[c] = hm[c] - set[c]
                if (hm[c] < 0) {
                    result.fit = false
                    break
                }
                if (result.fit == false) break
            }
            if (result.fit == false) break
        }
        console.log(result.index)
        a.push(result)
        return a
    }, [])
    .filter(game => game.fit)
    .reduce((a, e) => a + e.index, 0)

// console.log(`result: `, main(stub)) // 8
console.log(main(data))
