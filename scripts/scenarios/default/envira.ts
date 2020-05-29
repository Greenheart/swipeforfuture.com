import {
    createCardTemplate,
    unsplashImage,
    cardRef,
    propRef,
    addAction,
    eventCardAction,
    createEventCardFromTemplate,
    event,
    worldQuery,
} from '../../content-utils'
import {
    CardData,
    EventCards,
    WorldEvent,
} from '../../../src/game/ContentTypes'
import { ENVIRONMENT } from './common'
import { mariaFlags } from './maria'

export const enviraTemplate = createCardTemplate({
    image: unsplashImage('1546541612-82d19b258cd5'),
    location: 'Outside parliament',
    weight: 1000,
})

const enviraFlags = {
    ENVIRA_INIT: propRef('envira-init'),
}

const enviraIntro = cardRef('envira-intro')

export const enviraCards: CardData[] = []

export const enviraEvents: WorldEvent[] = [
    event(
        enviraIntro,
        [
            worldQuery(
                {},
                {
                    [enviraFlags.ENVIRA_INIT]: false,
                    [mariaFlags.NEEDS_INIT]: false,
                },
            ),
        ],
        0.5,
    ),
]

export const enviraEventCards: EventCards = {
    [enviraIntro]: createEventCardFromTemplate(enviraTemplate, {
        text:
            "Hi! My name is Envira and I'm a climate lobbyist. You'll see me from time to time. I wish you good luck and I hope we'll have constructive meetings in the future.",
        actions: {
            left: eventCardAction(
                addAction(
                    { [ENVIRONMENT]: -10 },
                    { [enviraFlags.ENVIRA_INIT]: true },
                ),
            ),
            right: eventCardAction(
                addAction(
                    { [ENVIRONMENT]: 10 },
                    { [enviraFlags.ENVIRA_INIT]: true },
                ),
            ),
        },
    }),
}
