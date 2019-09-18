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

function bothInArray (collection, x, y) {
  return collection.includes(x) && collection.includes(y)
}

function toGroupStats (players, results, stripNames = false) {
  return players.map(player => {
    const others = players
      .filter(p => player !== p)
      .map(other => {
        const matches = results.map(({ groups }) =>
          groups.map(({ carts }) =>
            bothInArray(flatten(carts), player, other) ? 1 : 0
          )
        )
        const count = sum(flatten(matches))
        return stripNames ? count : { [other]: count }
      })
    return stripNames ? others : { [player]: others }
  })
}

function toCartStats (results) {

}

const results = generate(players, games, shuffle)

const groupStats = toGroupStats(players, results)
console.log(JSON.stringify(groupStats, null, 2))
const cartStats = toCartStats(results)
