const { sum, shuffle } = require('lodash')

exports.generateGroups = (players, games, shuffler = shuffle) => {
  // Validate the games each call for the proper number of players
  const malformedGame = games.find(
    ({ desc, groupOccupancies }) => sum(groupOccupancies) !== players.length
  )
  if (malformedGame) {
    throw new Error(`Number of players in ${malformedGame.desc} does not match total number of players`)
  }

  const results = games.map(({ desc, groupOccupancies }) => {
    const randomized = shuffler(players)

    let index = 0
    const groups = groupOccupancies.map(groupOccupancy => {
      const cartCapacity = 2
      const numFullCarts = Math.floor(groupOccupancy / cartCapacity)
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
