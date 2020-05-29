import {
    createCardTemplate,
    unsplashImage,
    cardRef,
    worldQuery,
    createEventCardFromTemplate,
    eventCardAction,
    addAction,
    createCardFromTemplate,
} from '../../content-utils'
import {
    CardData,
    WorldEvent,
    EventCards,
} from '../../../src/game/ContentTypes'
import { FLAGS } from './flags'
import { POPULARITY, MONEY, ENVIRONMENT } from './stats'
import { VARS } from './vars'

export const infranTemplate = createCardTemplate({
    image: unsplashImage('1529088746738-c4c0a152fb2c'),
    location: 'On the phone',
    weight: 1000,
})

const infranIntro = cardRef('infran-intro')

export const infranCards: CardData[] = [
    createCardFromTemplate(infranTemplate, {
        title: 'Invest in solar?',
        location: 'In the bathroom',
        text:
            'The Germans are on to us!! We need to invest in solar power. Yay (right) or nay (left)?',
        isAvailableWhen: [
            worldQuery(
                {
                    [ENVIRONMENT]: [60, 100],
                    [MONEY]: [30, 100],
                    [VARS.SOLAR_INVESTMENTS]: [0, 0],
                },
                {
                    [FLAGS.INFRAN_INIT]: true,
                },
            ),
        ],
        actions: {
            left: addAction({ [MONEY]: -5, [VARS.SOLAR_INVESTMENTS]: 100 }),
            right: addAction({ [MONEY]: -10, [VARS.SOLAR_INVESTMENTS]: 1 }),
        },
    }),
]

export const infranEvents: WorldEvent[] = [
    {
        initialEventCardId: infranIntro,
        isAvailableWhen: [
            worldQuery(
                {},
                {
                    [FLAGS.LUNCH_MEETING_COMPLETED]: true,
                    [FLAGS.INFRAN_INIT]: false,
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
                    { [FLAGS.INFRAN_INIT]: true },
                ),
            ),
            right: eventCardAction(
                addAction(
                    { [MONEY]: -10, [POPULARITY]: 10 },
                    { [FLAGS.INFRAN_INIT]: true },
                ),
            ),
        },
    }),
}
