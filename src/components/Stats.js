import React from 'react'
import styled from 'styled-components/macro'
import { IoIosPeople } from 'react-icons/io'
import { GiAk47, GiMoneyStack, GiWheat } from 'react-icons/gi'

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
            <Stat>
                <Icon>
                    <GiWheat size="80%" />
                </Icon>
                <Bar value={stats.environment} />
            </Stat>
            <Stat>
                <Icon>
                    <IoIosPeople size="80%" />
                </Icon>
                <Bar value={stats.people} />
            </Stat>
            <Stat>
                <Icon>
                    <GiAk47 size="80%" />
                </Icon>
                <Bar value={stats.security} />
            </Stat>
            <Stat>
                <Icon>
                    <GiMoneyStack size="80%" />
                </Icon>
                <Bar value={stats.money} />
            </Stat>
        </Container>
    )
}

export default Stats
