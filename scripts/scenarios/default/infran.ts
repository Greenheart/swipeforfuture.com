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
import { POPULARITY, MONEY, ENVIRONMENT, PEOPLE } from './stats'
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
    createCardFromTemplate(infranTemplate, {
        title: 'Road expansion',
        text:
            'The people needs roads to support future market growth. Let me take charge and make this happen.',
        isAvailableWhen: [
            worldQuery(
                { [PEOPLE]: [50, 100], [VARS.ROADS_SUGGESTED]: [0, 0] },
                { [FLAGS.INFRAN_INIT]: true },
            ),
            worldQuery(
                { [PEOPLE]: [70, 100], [VARS.ROADS_SUGGESTED]: [1, 1] },
                { [FLAGS.INFRAN_INIT]: true },
            ),
            worldQuery(
                { [PEOPLE]: [90, 100], [VARS.ROADS_SUGGESTED]: [2, 2] },
                { [FLAGS.INFRAN_INIT]: true },
            ),
        ],
        actions: {
            left: addAction({
                [POPULARITY]: -10,
                [VARS.ROADS_SUGGESTED]: 1,
                [VARS.ROAD_EXPANSION]: 1,
            }),
            right: addAction({
                [ENVIRONMENT]: -10,
                [MONEY]: -10,
                [PEOPLE]: 20,
                [VARS.ROADS_SUGGESTED]: 1,
                [VARS.ROAD_EXPANSION]: 1,
            }),
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
