import React from 'react'
import styled from 'styled-components/macro'

const Container = styled.div`
    width: 5vh;
    height: 1vh;
    background: #333;
    box-shadow: 0 0.2vh 0.2vh rgba(0, 0, 0, 0.2);
`

const Value = styled.div<{ value: number }>`
    width: ${(props) => props.value + '%'};
    position: relative;
    height: 100%;
    background: #fff;
`

type BarProps = {
    value: number
}

const Bar: React.FunctionComponent<BarProps> = ({ value = 100 }) => (
    <Container>
        <Value value={value} />
    </Container>
)

export default Bar
