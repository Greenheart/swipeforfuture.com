import React from 'react'
import './App.css'

function App() {
    return (
        <main className="app">
            <header className="stats">
                <div className="stat">
                    <div className="icon"></div>
                    <Bar value={18} />
                </div>
                <div className="stat">
                    <div className="icon"></div>
                    <Bar value={58} />
                </div>
                <div className="stat">
                    <div className="icon"></div>
                    <Bar value={77} />
                </div>
                <div className="stat">
                    <div className="icon"></div>
                    <Bar value={32} />
                </div>
            </header>
            <div className="decision"></div>
            <footer>
                <div className="time-remaining"></div>
            </footer>
        </main>
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

export default App
