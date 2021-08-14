import { stat } from '../../content-utils'

export const STATS = {
    environment: stat('Environment', 0, 100, 'GiWheat', '70%'),
    people: stat('People', 0, 100, 'IoIosPeople'),
    security: stat('Security', 0, 100, 'GiAk47'),
    money: stat('Money', 0, 100, 'GiMoneyStack'),
    popularity: stat('Popularity', 0, 100, 'FiSmile', '70%'),
}
export const ENVIRONMENT = STATS.environment.id
export const PEOPLE = STATS.people.id
export const SECURITY = STATS.security.id
export const MONEY = STATS.money.id
export const POPULARITY = STATS.popularity.id

export const statIds = Object.values(STATS).map((stat) => stat.id)
