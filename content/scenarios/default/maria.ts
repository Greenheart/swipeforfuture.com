import {
    cardTemplate,
    cardRef,
    setModifier,
    action,
    worldQuery,
    cardFromTemplate,
    CardPriority,
} from '../../content-utils/index.js'
import { POPULARITY, MONEY, ENVIRONMENT } from './stats.js'
import VARS from './vars.js'
import image from './images.js'

export const mariaTemplate = cardTemplate({
    image: image('maria'),
    location: 'In parliament',
    weight: 1,
})

const welcome = cardRef('welcome')
const welcomeLoop = cardRef('welcome-loop')
const welcomeLunch = cardRef('welcome-lunch')

export const mariaCards = [
    cardFromTemplate(welcome, mariaTemplate, {
        title: 'Welcome!',
        text: 'Hi! My name is Maria. You must be the new president. Do you want to take a lunch to get up to speed with your new duties?',
        actions: {
            left: action([], "Nah, I'm good", welcomeLoop),
            right: action([], 'Sure', welcomeLunch),
        },
        isAvailableWhen: [worldQuery({ [VARS.LUNCH_MEETING_COMPLETED]: 0 })],
        priority: CardPriority.Event,
    }),
    cardFromTemplate(welcomeLoop, mariaTemplate, {
        title: 'Seriously!',
        text: 'We need to talk! Get your head in the game. Do you want to take a lunch to get up to speed with your new duties?',
        actions: {
            left: action([], 'Get off my back!', welcomeLoop),
            right: action([], "Alright, let's do this", welcomeLunch),
        },
        isAvailableWhen: [],
    }),
    cardFromTemplate(welcomeLunch, mariaTemplate, {
        title: 'The lunch meeting',
        text: 'Really nice lunch! Now your first big decision has come. Will you prioritize the economy or environment?',
        actions: {
            left: action(
                setModifier({
                    [ENVIRONMENT]: 70,
                    [POPULARITY]: 65,
                    [VARS.LUNCH_MEETING_COMPLETED]: 1,
                }),
                'We should think about our future',
            ),
            right: action(
                setModifier({
                    [MONEY]: 70,
                    [POPULARITY]: 52,
                    [VARS.LUNCH_MEETING_COMPLETED]: 1,
                }),
                'The economy, of couse',
            ),
        },
        isAvailableWhen: [],
    }),
]
