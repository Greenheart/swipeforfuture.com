import {
    createCardTemplate,
    unsplashImage,
    cardRef,
    addAction,
    eventCardAction,
    createEventCardFromTemplate,
    worldQuery,
    createCardFromTemplate,
} from '../../content-utils'
import {
    CardData,
    EventCards,
    WorldEvent,
} from '../../../src/game/ContentTypes'
import { ENVIRONMENT, PEOPLE, SECURITY, MONEY } from './stats'
import { FLAGS } from './flags'
import { VARS } from './vars'

export const enviraTemplate = createCardTemplate({
    image: unsplashImage('1546541612-82d19b258cd5'),
    location: 'Outside parliament',
    weight: 100,
})

// NOTE: These card refs might be hard to track. Could be nice to group them together in an object, to easily know that they are card refs.
// Compare `CARDS.enviraIntro` vs `enviraIntro`
const enviraIntro = cardRef('envira-intro')

export const enviraCards: CardData[] = [
    createCardFromTemplate(enviraTemplate, {
        title: 'Keep it in the ground!',
        text:
            'This is insane! Are you really investing in this brown coal plant and prioritizing short-term profits over the future of the planet - and your people!?',
        isAvailableWhen: [
            worldQuery(
                { [VARS.BROWN_COAL_PLANTS]: [1, 1] },
                { [FLAGS.ENVIRA_INIT]: true },
            ),
        ],
        actions: {
            // TODO: improve how this works.
            // Instead of disabling the brown coal power plant cards from appearing again using the state 100,
            // consider using a flag to disable it in a clearer way. Booleans are much better on/off switches than arbitrary numbers that could be misinterpreted
            left: addAction({
                [ENVIRONMENT]: 10,
                [PEOPLE]: 10,
                [SECURITY]: 5,
                [VARS.BROWN_COAL_PLANTS]: 100,
            }),
            right: addAction({
                [ENVIRONMENT]: -15,
                [PEOPLE]: -15,
                [SECURITY]: -5,
                [MONEY]: 35,
                [VARS.BROWN_COAL_PLANTS]: 0,
            }),
        },
    }),
]

export const enviraEvents: WorldEvent[] = [
    {
        initialEventCardId: enviraIntro,
        isAvailableWhen: [
            worldQuery(
                {},
                {
                    [FLAGS.ENVIRA_INIT]: false,
                    [FLAGS.LUNCH_MEETING_COMPLETED]: true,
                },
            ),
        ],
        probability: 0.5,
    },
]

export const enviraEventCards: EventCards = {
    [enviraIntro]: createEventCardFromTemplate(enviraTemplate, {
        title: 'The activist',
        text:
            "Hi! My name is Envira and I'm a climate lobbyist. You'll see me from time to time. I wish you good luck and I hope we'll have constructive meetings in the future.",
        actions: {
            left: eventCardAction(
                addAction(
                    { [ENVIRONMENT]: -10 },
                    { [FLAGS.ENVIRA_INIT]: true },
                ),
            ),
            right: eventCardAction(
                addAction({ [ENVIRONMENT]: 10 }, { [FLAGS.ENVIRA_INIT]: true }),
            ),
        },
    }),
}
