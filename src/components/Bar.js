function Bar({ value }) {
    return (
        <div className="bar">
            <div
                className="progress"
                style={{
                    width: `${value}%`,
                    backgroundColor: getBarColor(value)
                }}></div>
        </div>
    )
}

function getBarColor(value) {
    if (value <= 30) {
        return 'red'
    } else if (value <= 60) {
        return 'yellow'
    } else {
        return 'lightgreen'
    }
}

export default Bar
