import {
    createCardTemplate,
    createEventCardFromTemplate,
    unsplashImage,
    cardRef,
    propRef,
    addAction,
    setAction,
    eventCardAction,
} from '../../content-utils'
import { POPULARITY, MONEY, ENVIRONMENT } from './common'

const FLAGS = {
    NEEDS_INIT: propRef('needs-init'),
}

export const mariaTemplate = createCardTemplate({
    image: unsplashImage('1573497019940-1c28c88b4f3e'),
    location: 'In parliament',
    weight: 1,
})

const welcomeLoop = cardRef('welcome-loop')
const welcomeLunch = cardRef('welcome-lunch')
export const mariaEventCards = {
    welcome: createEventCardFromTemplate(mariaTemplate, {
        title: 'Welcome!',
        text:
            'Hi! My name is Maria. You must be the new president. Do you want to take a lunch to get up to speed with your new duties?',
        actions: {
            left: eventCardAction(addAction(), welcomeLoop),
            right: eventCardAction(addAction(), welcomeLunch),
        },
    }),
    [welcomeLoop]: createEventCardFromTemplate(mariaTemplate, {
        title: 'Seriously!',
        text:
            'We need to talk! Get your head in the game. Do you want to take a lunch to get up to speed with your new duties?',
        actions: {
            left: eventCardAction(addAction(), welcomeLoop),
            right: eventCardAction(addAction(), welcomeLunch),
        },
    }),
    [welcomeLunch]: createEventCardFromTemplate(mariaTemplate, {
        title: 'The lunch meeting',
        text:
            'Really nice lunch! Now your first big decision has come. Should you prioritize the economy (left) or environment (right)?',
        actions: {
            left: eventCardAction(
                setAction(
                    { [MONEY]: 70, [POPULARITY]: 52 },
                    { [FLAGS.NEEDS_INIT]: false },
                ),
                null,
            ),
            right: eventCardAction(
                setAction(
                    { [ENVIRONMENT]: 70, [POPULARITY]: 65 },
                    { [FLAGS.NEEDS_INIT]: false },
                ),
                null,
            ),
        },
    }),
}
