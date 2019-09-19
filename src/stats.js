const { sum, flatten, values } = require('lodash')
const { min, max, std } = require('mathjs')

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
  const keyedStats = stats.reduce((topDict, { name: player, counts }) => {
    topDict[player] = counts.reduce((bottomDict, { name: other, count }) => {
      bottomDict[other] = count
      return bottomDict
    }, {})
    return topDict
  }, {})

  return keyedStats
}

exports.groupFrequency = (players, results) => {
  const predicate = (group, player, other) => {
    const members = flatten(group.carts)
    return members.includes(player) && members.includes(other)
  }

  return matchingFrequency(players, results, predicate)
}

exports.cartFrequency = (players, results) => {
  const predicate = (group, player, other) => (
    group.carts.some(c => c.includes(player) && c.includes(other))
  )

  return matchingFrequency(players, results, predicate)
}

exports.matchingStats = (matchingFrequencies) => {
  const flattened = flatten(
    values(matchingFrequencies)
      .map(values)
  )

  return {
    min: min(flattened),
    max: max(flattened),
    std: std(flattened)
  }
}
