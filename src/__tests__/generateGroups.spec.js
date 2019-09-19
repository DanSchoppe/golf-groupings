const { generateGroups } = require('../generateGroups')

const { identity, flatten } = require('lodash')

const players = [
  'Foo',
  'Bar',
  'Baz',
  'Fizz',
  'Buzz',
]

const games = [
  {
    desc: 'game 1',
    groupOccupancies: [3, 2]
  },
  {
    desc: 'game 2',
    groupOccupancies: [2, 2, 1]
  }
]

describe('generateGroups', () => {
  it ('should generate the expected groupings', () => {
    const expected = [
      {
        desc: 'game 1',
        groups: [
          {
            'carts': [
              [ 'Foo', 'Bar' ], ['Baz']
            ]
          },
          {
            'carts': [
              [ 'Fizz', 'Buzz' ]
            ]
          }
        ]
      },
      {
        desc: 'game 2',
        groups: [
          {
            'carts': [
              [ 'Foo', 'Bar' ]
            ]
          },
          {
            'carts': [
              [ 'Baz', 'Fizz' ]
            ]
          },
          {
            'carts': [
              [ 'Buzz' ]
            ]
          }
        ]
      }
    ]

    const actual = generateGroups(players, games, identity)
    expect(actual).toEqual(expected)
  })

  it('should throw if players list length does not match game occupancies', () => {
    const malformedGames = [
      {
        desc: 'game 1',
        groupOccupancies: [3, 3] // <- players list is only of length 5
      }
    ]

    expect(() => generateGroups(players, malformedGames)).toThrow()
  })
})
