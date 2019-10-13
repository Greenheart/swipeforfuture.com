import React from 'react'
import styled from 'styled-components/macro'

import Bar from './Bar'

const Container = styled.header`
    background: lightgoldenrodyellow;
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
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: lightgreen;
`

function Stats({ stats }) {
    return (
        <Container>
            <Stat>
                <Icon />
                <Bar value={stats.environment} />
            </Stat>
            <Stat>
                <Icon />
                <Bar value={stats.people} />
            </Stat>
            <Stat>
                <Icon />
                <Bar value={stats.security} />
            </Stat>
            <Stat>
                <Icon />
                <Bar value={stats.money} />
            </Stat>
        </Container>
    )
}

export default Stats
