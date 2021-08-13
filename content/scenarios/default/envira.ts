import {
    Card,
    createCardTemplate,
    unsplashImage,
    cardRef,
    worldQuery,
    createCardFromTemplate,
    action,
    addModifier,
    CardPriority,
} from '../../content-utils'
import { ENVIRONMENT, PEOPLE, SECURITY, MONEY } from './stats'
import { FLAGS } from './flags'

export const enviraTemplate = createCardTemplate({
    image: unsplashImage('1546541612-82d19b258cd5'),
    location: 'Outside parliament',
    weight: 10,
})

// NOTE: These card refs might be hard to track. Could be nice to group them together in an object, to easily know that they are card refs.
// Compare `CARDS.enviraIntro` vs `enviraIntro`
const enviraIntro = cardRef('envira-intro')
const enviraCoal = cardRef('envira-coal')

export const enviraCards: Card[] = [
    createCardFromTemplate(enviraIntro, enviraTemplate, {
        title: 'The activist',
        text: "Hi! My name is Envira and I'm a climate activist. You'll see me from time to time. I wish you good luck and I hope we'll have constructive meetings in the future.",
        actions: {
            left: action(
                addModifier(
                    { [ENVIRONMENT]: -10 },
                    { [FLAGS.ENVIRA_INIT]: true },
                ),
                "Hah, I wouldn't think so!",
            ),
            right: action(
                addModifier(
                    { [ENVIRONMENT]: 10 },
                    { [FLAGS.ENVIRA_INIT]: true },
                ),
                'Thanks, see you soon!',
            ),
        },
        isAvailableWhen: [
            worldQuery(
                {},
                {
                    [FLAGS.ENVIRA_INIT]: false,
                    [FLAGS.LUNCH_MEETING_COMPLETED]: true,
                },
            ),
        ],
        priority: CardPriority.Event,
    }),
    createCardFromTemplate(enviraCoal, enviraTemplate, {
        title: 'Keep it in the ground!',
        text: 'This is insane! Are you really investing in this brown coal plant and prioritizing short-term profits over the future of the planet - and your people!?',
        isAvailableWhen: [
            worldQuery(
                {},
                {
                    [FLAGS.ENVIRA_INIT]: true,
                    [FLAGS.BROWN_COAL_PLANT]: true,
                },
            ),
        ],
        actions: {
            // TODO: improve how this works.
            // Instead of disabling the brown coal power plant cards from appearing again using the state 100,
            // consider using a flag to disable it in a clearer way. Booleans are much better on/off switches than arbitrary numbers that could be misinterpreted
            left: action(
                addModifier(
                    {
                        [ENVIRONMENT]: 10,
                        [PEOPLE]: 10,
                        [SECURITY]: 5,
                    },
                    { [FLAGS.BROWN_COAL_PLANT]: false },
                ),
                "Actually, it's time to shut it down",
            ),
            right: action(
                addModifier(
                    {
                        [ENVIRONMENT]: -15,
                        [PEOPLE]: -15,
                        [SECURITY]: -5,
                        [MONEY]: 35,
                    },
                    { [FLAGS.BROWN_COAL_PLANT]: true },
                ),
                'Yeah, just think about the jobs!',
            ),
        },
        weight: 40,
    }),
]
