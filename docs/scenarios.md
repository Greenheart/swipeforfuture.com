# Creating and building scenarios
This document describes the recommended method of creating and building a new scenario for `Swipe For Future` (`SFF`).

## The data format
The end goal is to create a package of `json`-files fullfilling the games data interface. These files are as follows:
* `stats.json` - Contains the main visible stats in the current scenario
* `default-state.json` - Contains the default state of the game world
* `cards.json` - Contains the general card deck
* `events.json` - Contains the events
* `event-cards.json` - Contains the cards related to events

The interface of these `json`-files is currently documented in `src/game/ContentTypes.ts`. Creating these files is the end goal of this document.

## The recommended approach: Content Utility API
The recommended approach for creating your first scenario is to use the  `content-utility-api`. The goal of this api is to simplify the creation of a scenario by reducing the amount of text needed to construct the components. This is done by simplifying the concepts of the content interfaces and by enabling the use of references and templates.

### The scenarios directory
The `scenarios` directory contains the roots of all scenarios. Each scenario is bound to their respective folder.

### Generating data from existing scenarios
In order to generate the data for the default scenario simply run:

```
yarn scenario
```

To build a specific scenario you run the following, replacing `[scenario-id]` with your selected `scenario id`:
```
yarn scenario [scenario-id]
```

The generated scenarios will be built to `public/data/scenarios/<scenario-id>` where the default scenario will be built to `public/data/scenarios/default`.

### Creating a new scenario
The current recommendation, when creating a new scenario is to copy an existing scenario, modifying and extending it. The process for creating a new scenario from an existing scenario is as follows:
* Select a scenario id `<my-scernario-id>`
* Copy the folder of an existing scenario to a new folder within the scenario folder i.e. `scripts/scenarios/<my-scenario-id>`
* Find the exported `ScenarioBuilder` builder, for your new scenario, and make sure that the `id` in the output scenario i.e. (output from the `run()` function) is equal to `<my-scenario-id>`
* Run `yarn scenario <my-scenario-id>` to make sure your scenario builds correctly. (The result should show up in `public/data/scernarios/<my-scenario-id>`)
* Start modifying the scenario

#### Developing the scenario
In order to make for efficient local development of a scenario you should set up a local environment in order to the the system which scenario to load when running. This file will not be commited to the `git`-repository. Use `<my-scenario-id>` from the previous section and create a file named `.env.local`, with the following content.

```
REACT_APP_SFF_DEFAULT_SCENARIO='/data/scenarios/<my-scenario-id>'
```

#### Note
* When creating or chaning your `.env.local` you will need to restart your `yarn start` in order for the new settings to take effect
* Currently, you will need to manually trigger rebuild of your scenario in order to make changes available to the system