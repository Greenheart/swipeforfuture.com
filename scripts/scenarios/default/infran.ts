import {
    createCardTemplate,
    unsplashImage,
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
import { FLAGS } from './flags'
import { POPULARITY, MONEY } from './stats'

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
    {
        initialEventCardId: infranIntro,
        isAvailableWhen: [
            worldQuery(
                {},
                {
                    [FLAGS.LUNCH_MEETING_COMPLETED]: true,
                    [infranFlags.INFRAN_INIT]: false,
                },
            ),
        ],
        probability: 0.5,
    },
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
