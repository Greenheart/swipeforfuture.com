import React from 'react'
import styled from 'styled-components/macro'

// This could prove to be a hit in binary size since we require all the icons in each pack. This compromise allows for more dynamic content.
import * as IoIcons from 'react-icons/io'
import * as GameIcons from 'react-icons/gi'
import * as FeatherIcons from 'react-icons/fi'

import Bar from './Bar'
import { StatDefinition } from '../game/ContentTypes'

const Container = styled.header`
    background: #f6fbf5;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
`

const Stat = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
`

const Icon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #91c779;

    display: flex;
    justify-content: center;
    align-items: center;
`
type StatsProps = {
    stats: (StatDefinition & { value: number })[]
}

const Stats: React.FunctionComponent<StatsProps> = ({ stats }) => (
    <Container>
        {stats.map((s) => {
            const gameIcon = s.icon as keyof typeof GameIcons
            const ioIcon = s.icon as keyof typeof IoIcons
            const featherIcon = s.icon as keyof typeof FeatherIcons
            const IconWidget =
                GameIcons[gameIcon] ||
                IoIcons[ioIcon] ||
                FeatherIcons[featherIcon]
            const iconSize = s.iconSize || '80%'
            const value = s.value
            return (
                <Stat key={s.id}>
                    <Icon>{IconWidget && <IconWidget size={iconSize} />}</Icon>
                    <Bar value={value} />
                </Stat>
            )
        })}
    </Container>
)

export default Stats
