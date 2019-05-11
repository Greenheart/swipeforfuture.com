class Game {
    constructor (events) {
        this.player = new Player(this)
        this.world = new World(events, this.player)
    }

    start () {
        this.bindUI()
        this.world.nextDecision()
    }

    bindUI () {
        document.querySelector('#yes').addEventListener('click', () => this.player.yes())
        document.querySelector('#no').addEventListener('click', () => this.player.no())
    }
}

class World {
    constructor (events, player) {
        // The main world stats that player decisions will affect
        this.stats = {
            environment: 50,
            people: 50,
            security: 50,
            money: 50
        }

        this.events = events
        this.player = player

        this.currentEvent = null
        this.eventIndex = 0
    }

    nextDecision () {
        // TODO: Randomize a new event.
        this.currentEvent = this.events[this.eventIndex++]
        document.querySelector('#decision').innerText = this.currentEvent.text
        console.log(this.currentEvent)
    }

    applyEffects (effects) {
        for (const stat of Object.keys(this.stats)) {
            // Use the first letter of the stat name to find new value.
            this.stats[stat] += effects[stat[0]] || 0
        }
        this.showWorldState()
        console.log(effects)

        this.nextDecision()
    }

    showWorldState () {
        for (const stat of Object.keys(this.stats)) {
            document.querySelector('#' + stat).innerText = this.stats[stat]
        }
        console.log(this.stats)
    }
}

class Player {
    constructor (game) {
        this.game = game
    }

    // Makes choices that affect the game world.

    yes () {
        this.game.world.applyEffects(this.game.world.currentEvent.yes)
    }

    no () {
        this.game.world.applyEffects(this.game.world.currentEvent.no)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // IDEA: Load events from separate file.
    const events = [{
        text: 'Switch to renewable energy?',
        yes: {
            e: 10,
            p: 10,
            m: -15
        },
        no: {
            e: 0,
            p: 0,
            m: 10
        }
    }, {
        text: 'Invest in coal power?',
        yes: {
            e: -30,
            p: -20,
            m: 15
        },
        no: {
            e: 0,
            p: 10,
            m: -5
        }
    }]

    const game = new Game(events)
    game.start()
})
