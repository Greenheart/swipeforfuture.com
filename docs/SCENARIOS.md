# Swipe for Future Scenarios

> Learn how to create scenarios, and explore features of the game engine

## Scenarios

Swipe for Future allows for a wide range of possible scenarios.

---

## Stats

Scenarios can have one or more stats, visible at the top of the game UI. Stats are numerical variables that influence the simulation and gameplay. Each stat can have a `min` and `max` value and will always be capped to remain within the valid range.

### Add custom icons for stats

1.  Find SVG icons you like on <https://icones.js.org>.
2.  Copy the SVG as a data URL (base64 encoded string).
3.  Add icons to [icons.ts](../content/content-utils/icons.ts)
4.  In your scenario, import the icons you want. You can customise the size to give all icons a similar size.

---

## Cards

Cards are the basic building blocks of scenarios. Each turn, the game picks one of the available cards based on the game state.

When the player swipes a card either to the left or right, this updates the game state by applying the corresponding `CardAction`. Each `CardAction` can change the game state based on one or more `GameWorldModifier`s.

### `CardAction`s can have several types of `GameWorldModifier`s:

#### `add`: Increase or decrease any game state variable by a given number.

Positive values will increment, negative values decrement. This is especially useful to update regular stats which shows up in the game UI. It can also be used to update other variables that are hidden to the player.

#### `set`: Set a game state variable to a specific value.

This is useful for special variables behind the scenes that control which other cards are available. By setting variables to either `1` or `0`, this can be used as special boolean flags to control game progression.

#### `replace`: Reset the game state to the default game state when the scenario started.

This can be useful to create a loop to let the player restart after losing the scenario.
