import { stat } from '../../content-utils'

export const STATS = {
    environment: stat('Environment', 'GiWheat', '70%'),
    people: stat('People', 'IoIosPeople'),
    security: stat('Security', 'GiAk47'),
    money: stat('Money', 'GiMoneyStack'),
    popularity: stat('Popularity', 'FiSmile', '70%'),
}
export const ENVIRONMENT = STATS.environment.id
export const PEOPLE = STATS.people.id
export const SECURITY = STATS.security.id
export const MONEY = STATS.money.id
export const POPULARITY = STATS.popularity.id

export const statIds = Object.values(STATS).map((stat) => stat.id)
