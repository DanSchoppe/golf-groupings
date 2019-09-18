const { sum, flatten, reject, shuffle, identity } = require('lodash')

const players = [
  'Dan',
  'Kent',
  'Reid',
  'Brady',
  'JP',
  'Jamie',
  'Scott',
  'Jay',
  'Joe',
]

const games = [
  {
    desc: 'best ball',
    groupOccupancies: [ 3, 3, 3 ]
  },
  {
    desc: 'scramble',
    groupOccupancies: [ 3, 3, 3 ]
  },
  {
    desc: 'yellow ball',
    groupOccupancies: [ 3, 3, 3 ],
  },
]

function generate (players, games, shuffler) {
  // Validate the games each call for the proper number of players
  games.forEach(({desc, groupOccupancies}) => {
    if (sum(groupOccupancies) != players.length) {
      throw new Error(`Number of players in ${desc} does not match total number of players`)
    }
  })

  const results = games.map(({desc, groupOccupancies}) => {
    const randomized = shuffler(players)

    let index = 0
    const groups = groupOccupancies.map(groupOccupancy => {
      const cartCapacity = 2
      const numFullCarts = Math.floor(groupOccupancy/cartCapacity)
      const remainder = groupOccupancy % cartCapacity

      const cartOccupancies = [
        ...Array(numFullCarts).fill(cartCapacity),
        ...(remainder ? [remainder] : [])
      ]

      const carts = cartOccupancies.map(cartOccupancy => {
        const cart = randomized.slice(index, index + cartOccupancy)
        index += cartOccupancy
        return cart
      })

      return { carts }
    })

    return { desc, groups }
  })
  console.log(JSON.stringify(results))
  return results
}

function groupPredicate (group, player, other) {
  const members = flatten(group.carts)
  return members.includes(player) && members.includes(other)
}

function cartPredicate (group, player, other) {
  return group.carts.some(c => c.includes(player) && c.includes(other))
}

function stats (players, results, matchingPredicate) {
  const stats = players.map(player => {
    const others = players
      .filter(p => player !== p)
      .map(other => {
        const matches = results.map(({ groups }) =>
          groups.map(group =>
            matchingPredicate(group, player, other) ? 1 : 0
          )
        )
        const count = sum(flatten(matches))
        return { name: other, count }
      })
    return { name: player, counts: others }
  })

  // Replace arrays with playername keys:
  const keyedStats = stats.reduce((topDict, {name: player, counts}) => {
    topDict[player] = counts.reduce((bottomDict, {name: other, count}) => {
      bottomDict[other] = count
      return bottomDict
    }, {})
    return topDict
  }, {})

  return keyedStats
}

const results = generate(players, games, shuffle)
const groupStats = stats(players, results, groupPredicate)
console.log(groupStats)
const cartStats = stats(players, results, cartPredicate)
console.log(cartStats)
