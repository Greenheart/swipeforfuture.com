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

-   Play on https://swipeforfuture.com
-   Let us know what you think on [Discord](https://discord.gg/JGkQr9raU5) or by joining the [discussions on GitHub](https://github.com/Greenheart/swipeforfuture.com/issues).
-   You can also [open issues on GitHub](https://github.com/Greenheart/swipeforfuture.com/issues) if you find bugs or have new ideas. Just remember to search for similar discussions first to avoid duplicates.

## 📝 Create scenarios and content

Content creation is a major part of Swipe for Future, and a great opportunity to be creative!

### Don't know how to code? No problem!

To contribute scenario content, you can [play the game](https://swipeforfuture.com) and chat with us on [Discord](https://discord.gg/JGkQr9raU5) to help create engaging stories and game play. We'd love hear your ideas, and we could help you tell that story or scenario you've been thinking about!

**Fun fact:** While the core game and official scenarios are centered around climate justice and sustainability, the game itself actually supports any type of scenario content.

## 👩‍💻 Develop the game and scenarios locally on your computer

This project consists of the following parts:

-   `/web` - The core game module.
-   `/shared` - Shared TypeScript definitions that describe the structure of game content.
-   `/content` - The development tools used to create scenarios.

### 1. Setup your local environment

-   We recommend installing the [VS Code](https://code.visualstudio.com/) editor to get the best experience.
-   You need to have [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/) installed.
-   There are a number of helpful extensions for VS Code that simplify development. Consider installing the plugins for [Tailwind CSS](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss), [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### 2. Setup the game and scenarios locally

1. `git clone` this repository to your computer.
2. Open the `swipeforfuture.com` directory that contains the `/web` and `/content` subdirectories we will be using for the next steps.
3. Open a terminal in `/web` directory and run `npm install`.
4. Then do the same for the `/content` directory and run `npm install` there too.

### 👩‍💻 Start the game in development mode

1. In the `/web` directory, run `npm run dev`. This will show two or more URL:s in the terminal where the game now is available to play, for example [http://localhost:3000](http://localhost:3000) will open the game on your computer.
2. To open the game on your phone, make sure the computer and the phone are both connected to the same local network (WiFi). Then, you can open the other link with the IP address on your phone. For example `http://192.168.x.x:3000`
3. To load scenarios from a specific location, you can use `http://localhost:3000/play?path=[SCENARIO_URL]`, replacing `[SCENARIO_URL]` with the web URL to where the scenario is available. This feature also works for `https://swipeforfuture.com/play?path=[SCENARIO_URL]`, allowing you to play scenarios from any source, as long as both the scenario and the game support the same version of the scenario format.

### 📝 Start the scenario development environment

1. In the `/content` directory, run `npm run dev`.
2. If you already have the game started, you can now play the default scenario at [http://localhost:3000/play?dev=default](http://localhost:3000/play?dev=default).
3. You can also play other local scenarios by changing the final part of the above URL to end with `?dev=[SCENARIO_ID]`, where `[SCENARIO_ID]` matches one of the directories in `/content/scenarios`.
4. To make changes to scenarios, open the `swipeforfuture.com` directory in VS Code. Then use the file explorer (top left of your screen by default) to find the `/content/scenarios` directory and find the scenario you want to edit.
5. When making changes, the project will automatically rebuild scenarios and prepare them into `JSON` files that can be loaded by the game. However, you need to manually refresh the browser to play the scenario with your latest changes.
6. When you are ready to save your changes, you can commit them using Git and publish a pull request on GitHub. Don't worry if you're new to Git and GitHub - just write in the [Discord](https://discord.gg/JGkQr9raU5) chat and know and we'll help you! :)

#### More info about scenario development

1. To start a new scenario, you can use existing ones from `/content/scenarios` as a foundation to get a structure to start working with. The directory name of each scenario is the unique identifier.
2. **NOTE:** When adding a new scenario, remember to add them in `/content/scenarios/index.ts` to make the new scenario available to play in the game. If you forget to do this, it won't be possible to load the scenario using `?dev=[SCENARIO_ID]`. To verify that the scenario got built correctly during development, you can check if it has exported the scenario JSON file correctly to `/web/static/dev-only/[SCENARIO_ID].json`.
3. Sometimes changes in the game or the scenarios cause things to crash. If that happens, you will usually see errors in one of the two terminals. and then need to restart both the game client and the scenario development script. If the error persists, see if you have made some mistake in the code that need to be fixed.

#### Best practices for scenarios

-   For yes/no cards, use the right action for "yes" and the left action for "no"
-   For cards with other options than yes/no, feel free to mix up the order so not all _good_ cards always are right swipes. The game is more fun when players have to be ready to sometimes swipe left too!
