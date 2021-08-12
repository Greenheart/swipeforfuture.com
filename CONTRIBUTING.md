# Contributing to Swipe for Future

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

A community-driven game like this would not exist without people like you!

These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

Swipe for Future is a friendly place for learning and creative collaboration. We’re committed to keeping it that way.

**In short: Be nice. No harassment, trolling, or spamming.**

By participating in our community, you pledge to follow the [Swipe for Future Code of Conduct](./CODE_OF_CONDUCT.md). Please report unacceptable behavior to the Core Team.

## Have a question?

Feel free to chat with us on [Discord](https://discord.gg/JGkQr9raU5) if you want help getting started!

## 🎮 Play the game and contribute with feedback + ideas

- Play on https://swipeforfuture.com
- Let us know what you think on [Discord](https://discord.gg/JGkQr9raU5) or by joining the [discussions on GitHub](https://github.com/Greenheart/swipeforfuture.com/issues).
- You can also [open issues on GitHub](https://github.com/Greenheart/swipeforfuture.com/issues) if you find bugs or have new ideas. Just remember to search for similar discussions first to avoid duplicates.

## 📝 Create scenarios and content

Content creation is a major part of Swipe for Future, and a great opportunity to be creative!

### Don't know how to code? No problem!

To contribute scenario content, you can [play the game](https://swipeforfuture.com) and chat with us on [Discord](https://discord.gg/JGkQr9raU5) to help create engaging stories and game play. We'd love hear your ideas, and we could help you tell that story or scenario you've been thinking about!

**Fun fact:** While the core game and official scenarios are centered around climate justice and sustainability, the game itself actually supports any type of scenario content.

## 👩‍💻 Develop the game and scenarios locally on your computer

This project consists of the following parts:

- `web` - The core game module.
- `shared` - Shared TypeScript definitions that describe the structure of game content.
- `content` - The development tools used to create scenarios.

### 1. Setup your local environment

- We recommend installing the [VS Code](https://code.visualstudio.com/) editor to get the best experience.
- You need to have [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/) installed.

### 2. Setup the game and scenarios locally

1. `git clone` this repository to your computer.
2. In the `swipeforfuture.com/web` directory, run `npm install`
3. In the `swipeforfuture.com/content` directory, run `npm install`

### 👩‍💻 Start the game in development mode

1. In the `swipeforfuture.com/web` directory, run `npm run dev`. Then you can play at [http://localhost:3000](http://localhost:3000)
2. To load scenarios from a specific location, you can use `http://localhost:3000/play?path=[SCENARIO_URL]`, replacing `[SCENARIO_URL]` with the web URL to where the scenario is available. This feature also works for `https://swipeforfuture.com/play?path=[SCENARIO_URL]`, allowing you to play scenarios from any source.

### 📝 Start the scenario development environment

1. In the `swipeforfuture.com/content` directory, run `npm run dev`.
2. If you already have the game started, you can now play the default scenario at [http://localhost:3000/play?path=http://localhost:5000/default.json](http://localhost:3000/play?path=http://localhost:5000/default.json).
3. You can also access other local scenarios by changing the final part of the above URL to end with `http://localhost:5000/[SCENARIO_ID]`, where `[SCENARIO_ID]` matches one of the directories in `swipeforfuture.com/content/scenarios`.

#### More info about scenario development

1. Go to the `swipeforfuture.com/content` directory.
2. Find example scenarios that you can use as a foundation for your own in `swipeforfuture.com/content/scenarios`. The folder name of each scenario represents
3. If you want to add new scenarios, note that the file `content/scenarios/index.ts` controls what scenarios are available in the game.
