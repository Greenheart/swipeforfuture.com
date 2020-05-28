import { createCardTemplate, unsplashImage } from '../../content-utils'
import { CardData } from '../../../src/game/ContentTypes'

export const enviraTemplate = createCardTemplate({
    image: unsplashImage('1546541612-82d19b258cd5'),
    location: 'Outside parliament',
    weight: 1,
})

export const enviraCards: CardData[] = []
