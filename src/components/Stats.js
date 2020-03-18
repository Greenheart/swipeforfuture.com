import React from 'react'
import styled from 'styled-components/macro'

// This could prove to be a hit in binary size since we require all the icons in each pack. This compromise allows for more dynamic content.
import * as IoIcons from 'react-icons/io'
import * as GameIcons from 'react-icons/gi'
import * as FontAwesomeIcons from 'react-icons/fa'

import Bar from './Bar'

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

function Stats({ stats }) {
    return (
        <Container>
            {stats.map(s => {
                const IconWidget =
                    GameIcons[s.icon] ||
                    IoIcons[s.icon] ||
                    FontAwesomeIcons[s.icon]
                const iconSize = s.iconSize || '80%'
                const value = s.value
                return (
                    <Stat key={s.id}>
                        <Icon>
                            {IconWidget && <IconWidget size={iconSize} />}
                        </Icon>
                        <Bar value={value} />
                    </Stat>
                )
            })}
        </Container>
    )
}

export default Stats
