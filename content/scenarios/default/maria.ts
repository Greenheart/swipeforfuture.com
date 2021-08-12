import {
    createCardTemplate,
    unsplashImage,
    cardRef,
    setModifier,
    action,
    worldQuery,
    createCardFromTemplate,
    CardPriority,
} from '../../content-utils'
import { POPULARITY, MONEY, ENVIRONMENT } from './stats'
import { FLAGS } from './flags'

export const mariaTemplate = createCardTemplate({
    image: unsplashImage('1573497019940-1c28c88b4f3e'),
    location: 'In parliament',
    weight: 1,
})

const welcome = cardRef('welcome')
const welcomeLoop = cardRef('welcome-loop')
const welcomeLunch = cardRef('welcome-lunch')

export const mariaCards = [
    createCardFromTemplate(welcome, mariaTemplate, {
        title: 'Welcome!',
        text: 'Hi! My name is Maria. You must be the new president. Do you want to take a lunch to get up to speed with your new duties?',
        actions: {
            left: action(
                [],
                "Nah. I'm good. I think I can handle things on my own.",
                welcomeLoop,
            ),
            right: action(
                [],
                "That sounds great. Let's do it ASAP",
                welcomeLunch,
            ),
        },
        isAvailableWhen: [
            worldQuery({}, { [FLAGS.LUNCH_MEETING_COMPLETED]: false }),
        ],
        priority: CardPriority.Event,
    }),
    createCardFromTemplate(welcomeLoop, mariaTemplate, {
        title: 'Seriously!',
        text: 'We need to talk! Get your head in the game. Do you want to take a lunch to get up to speed with your new duties?',
        actions: {
            left: action([], 'Get off my back.', welcomeLoop),
            right: action([], "Alright. Let's do this.", welcomeLunch),
        },
        isAvailableWhen: [],
    }),
    createCardFromTemplate(welcomeLunch, mariaTemplate, {
        title: 'The lunch meeting',
        text: 'Really nice lunch! Now your first big decision has come. Should you prioritize the economy (left) or environment (right)?',
        actions: {
            left: action(
                setModifier(
                    { [MONEY]: 70, [POPULARITY]: 52 },
                    { [FLAGS.LUNCH_MEETING_COMPLETED]: true },
                ),
                'Nice talk. Love the economy!',
            ),
            right: action(
                setModifier(
                    { [ENVIRONMENT]: 70, [POPULARITY]: 65 },
                    { [FLAGS.LUNCH_MEETING_COMPLETED]: true },
                ),
                'Nice talk. We should think about our future.',
            ),
        },
        isAvailableWhen: [],
    }),
]
