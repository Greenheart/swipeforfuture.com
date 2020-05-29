import {
    createCardTemplate,
    unsplashImage,
    event,
    cardRef,
    worldQuery,
    propRef,
    createEventCardFromTemplate,
    eventCardAction,
    addAction,
} from '../../content-utils'
import {
    CardData,
    WorldEvent,
    EventCards,
} from '../../../src/game/ContentTypes'
import { mariaFlags } from './maria'
import { ENVIRONMENT, POPULARITY, MONEY } from './common'

export const infranTemplate = createCardTemplate({
    image: unsplashImage('1529088746738-c4c0a152fb2c'),
    location: 'On the phone',
    weight: 1000,
})

const infranFlags = {
    INFRAN_INIT: propRef('infran-init'),
}

const infranIntro = cardRef('infran-intro')

export const infranCards: CardData[] = []

export const infranEvents: WorldEvent[] = [
    event(
        infranIntro,
        [
            worldQuery(
                {},
                {
                    [mariaFlags.NEEDS_INIT]: false,
                    [infranFlags.INFRAN_INIT]: false,
                },
            ),
        ],
        0.5,
    ),
]

export const infranEventCards: EventCards = {
    [infranIntro]: createEventCardFromTemplate(infranTemplate, {
        text:
            "Hello sir! I'm Infran. I'll be sure to keep you updated on the nation's infrastructure. Should we get started right away?",
        actions: {
            left: eventCardAction(
                addAction(
                    { [MONEY]: 10, [POPULARITY]: -10 },
                    { [infranFlags.INFRAN_INIT]: true },
                ),
            ),
            right: eventCardAction(
                addAction(
                    { [MONEY]: -10, [POPULARITY]: 10 },
                    { [infranFlags.INFRAN_INIT]: true },
                ),
            ),
        },
    }),
}
