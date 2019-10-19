import React from 'react'
import styled from 'styled-components/macro'

const Container = styled.section`
    width: 80%;
    max-width: 700px;
    background: lightgoldenrodyellow;
    margin: 25px auto;
`

const Content = styled.div`
    background: lightgreen;
`

function Card() {
    return (
        <Container>
            <Content>This is a card</Content>
        </Container>
    )
}

export default Card
