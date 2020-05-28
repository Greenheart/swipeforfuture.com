import { createCardTemplate, unsplashImage } from '../../content-utils'
import { CardData } from '../../../src/game/ContentTypes'

export const infranTemplate = createCardTemplate({
    image: unsplashImage('1529088746738-c4c0a152fb2c'),
    location: 'On the phone',
    weight: 1,
})

export const infranCards: CardData[] = []
