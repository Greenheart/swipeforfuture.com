import {
    Card,
    worldQuery,
    createCardFromTemplate,
    createCardTemplate,
    addModifier,
    action,
    cardRef,
} from '../../content-utils'
import { statIds } from './stats'
import image from './images'

export const catTemplate = createCardTemplate({
    image: image('cat'),
    location: '',
    weight: 1,
})

export const catastrophicCards = statIds.map<Card>((stat) => {
    const partial: Partial<Card> = {
        title: `Look at me! I'm the ${stat.toUpperCase()} Cat`,
        text: 'Your cat needs some love and tenderness. Try to make time in your busy schedule',
        isAvailableWhen: [
            worldQuery({
                [stat]: [0, 100],
            }),
        ],
        actions: {
            left: action(addModifier({ [stat]: -20 })),
            right: action(addModifier({ [stat]: 20 })),
        },
    }
    return createCardFromTemplate(cardRef(`cat-${stat}`), catTemplate, partial)
})
