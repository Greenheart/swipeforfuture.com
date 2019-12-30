import React from 'react'
import styled from 'styled-components/macro'

const Container = styled.div`
    margin-top: 10px;
    width: 40px;
    height: 8px;
    border-radius: 4px;
    background: #546a76;
`

const Value = styled.div`
    position: relative;
    top: 1px;
    left: 1px;
    height: 6px;
    max-width: 38px;
    border-radius: 3px;
`

function Bar({ value = 100 }) {
    return (
        <Container>
            <Value
                style={{
                    width: `${value}%`,
                    backgroundColor: getBarColor(value),
                }}
            />
        </Container>
    )
}

function getBarColor(value) {
    if (value <= 30) {
        return '#dd7373'
    } else if (value <= 70) {
        return '#e7e247'
    } else {
        return '#91c779'
    }
}

export default Bar
