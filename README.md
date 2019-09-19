## Golf Groupings

### Background
I manage the games for an annual golf tournament with friends. This
game management includes mixing the attendees into teams, golf groups,
and carts.

As you can imagine, everyone has more fun if the teams, groups, and
carts are mixed well. By the end of the tournament, no one should be
consistently riding in their own cart and everyone should get to play
with everyone else (to the extent possible).

After years of accomplishing this through brittle cell formulas and
spreadsheet macros, this is a quick-and-dirty project to do it in
code.

### Tenets
This project uses functional programming concepts to transform:
```
(list of players, list of games) -> groupings for each game
```

You'll notice a preference for:
- data transformation
- immutability

Rather than:
- classes / object-oriented
- mutation

### Architecture

#### src/main.js
Entrypoint of the application.
- List players
- List games
- Imperative logic to generate random groupings and measure their
  desirability, continually tracking the best result

#### src/generateGroups.js
Map the players and games data into random groupings.
- Can provide a randomization function for determinism (unit tests)

#### src/stats.js
Provide statistics about how much each player interacts each other
player
- groupFrequency: how many times a player is in a group with each
  other player
- cartFrequency: how many times a player rides in a cart with each
  other player
- matchingStats: min/max/std dev for the above frequency data

This statistical data is the foundation of the measure of "quality"
for the random groupings.
