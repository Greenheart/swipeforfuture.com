import {
    imageDB,
    imageEntry,
    unsplashImage,
    pexelsImage,
} from '../../content-utils/index.js'

const { image } = imageDB([
    imageEntry('envira', unsplashImage('1546541612-82d19b258cd5')),
    imageEntry('maria', unsplashImage('1573497019940-1c28c88b4f3e')),
    imageEntry('infran', unsplashImage('1529088746738-c4c0a152fb2c')),
    imageEntry('cat', unsplashImage('1548247416-ec66f4900b2e')),
    imageEntry('powerplant', pexelsImage('3044473'), 'coal'),
    imageEntry(
        'powerplant',
        unsplashImage('1497435334941-8c899ee9e8e9'),
        'solar',
    ),
    imageEntry('desert', unsplashImage('1497039465987-61d305728610')),
    imageEntry('cat', unsplashImage('1548247416-ec66f4900b2e')),
])

export default image
