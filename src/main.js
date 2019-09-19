const { shuffle } = require('lodash')

const { generateGroups } = require('./generateGroups')
const {
  groupFrequency,
  cartFrequency,
  matchingStats
} = require('./stats')

const players = [
  'Dan',
  'Kent',
  'Reid',
  'Brady',
  'JP',
  'Jamie',
  'Scott',
  'Jay',
  'Joe'
]

const games = [
  {
    desc: 'best ball',
    groupOccupancies: [3, 3, 3]
  },
  {
    desc: 'scramble',
    groupOccupancies: [3, 3, 3]
  },
  {
    desc: 'yellow ball',
    groupOccupancies: [3, 3, 3]
  },
  {
    desc: 'alternate shot',
    groupOccupancies: [4, 5]
  },
  {
    desc: 'wolf',
    groupOccupancies: [3, 3, 3]
  }
]

let incumbent = 1000
let i = 0
while (++i) {
  if (i % 100000 === 0) console.log(i)

  const results = generateGroups(players, games, shuffle)

  const groupFrequencies = groupFrequency(players, results)
  const groupStats = matchingStats(groupFrequencies)

  const cartFrequencies = cartFrequency(players, results)
  const cartStats = matchingStats(cartFrequencies)

  if (groupStats.std + cartStats.std < incumbent) {
    console.log(JSON.stringify(results))
    console.log(groupStats)
    console.log(cartStats)
    console.log()
    incumbent = groupStats.std + cartStats.std
  }
}
