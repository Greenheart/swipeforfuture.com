import React from 'react'
import styled from 'styled-components/macro'
import * as IoIcons from 'react-icons/io'
import * as GameIcons from 'react-icons/gi'

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

function Stats({ stats, params }) {
    return (
        <Container>
            {params.map(p => {
                const IconWidget = GameIcons[p.icon] || IoIcons[p.icon]
                return (
                    <Stat key={p.id}>
                        <Icon>
                            <IconWidget size="80%" />
                        </Icon>
                        <Bar value={stats[p.id]} />
                    </Stat>
                )
            })}
        </Container>
    )
}

export default Stats
