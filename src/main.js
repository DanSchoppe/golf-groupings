const { sum, flatten, values, reject, shuffle, identity } = require('lodash')
const { min, max, std } = require('mathjs')

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
  {
    desc: 'alternate shot',
    groupOccupancies: [ 4, 5 ],
  },
  {
    desc: 'wolf',
    groupOccupancies: [ 3, 3, 3 ],
  },
]

function generate (players, games, shuffler) {
  // Validate the games each call for the proper number of players
  const malformedGame = games.find(
    ({desc, groupOccupancies}) => sum(groupOccupancies) !== players.length
  )
  if (malformedGame) {
    throw new Error(`Number of players in ${malformedGame.desc} does not match total number of players`)
  }

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
  return results
}

function groupPredicate (group, player, other) {
  const members = flatten(group.carts)
  return members.includes(player) && members.includes(other)
}

function cartPredicate (group, player, other) {
  return group.carts.some(c => c.includes(player) && c.includes(other))
}

function matchingFrequency (players, results, matchingPredicate) {
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

function matchingStats (matchingFrequencies) {
  const flattened = flatten(
    values(matchingFrequencies)
      .map(values)
  )

  return {
    min: min(flattened),
    max: max(flattened),
    std: std(flattened),
  }
}

let incumbent = 1000
let i = 0
while (++i) {
  if (i % 100000 === 0) console.log(i)

  const results = generate(players, games, shuffle)

  const groupFrequencies = matchingFrequency(players, results, groupPredicate)
  const groupStats = matchingStats(groupFrequencies)

  const cartFrequencies = matchingFrequency(players, results, cartPredicate)
  const cartStats = matchingStats(cartFrequencies)

  if (groupStats.std + cartStats.std < incumbent) {
    console.log(JSON.stringify(results))
    console.log(groupStats)
    console.log(cartStats)
    console.log()
    incumbent = groupStats.std + cartStats.std
  }
}
