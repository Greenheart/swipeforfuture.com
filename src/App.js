import React from 'react'
import './App.css'

function App() {
    return (
        <main className="app">
            <header className="stats">
                <div className="stat">
                    <div className="icon"></div>
                    <div className="bar"></div>
                </div>
                <div className="stat">
                    <div className="icon"></div>
                    <div className="bar"></div>
                </div>
                <div className="stat">
                    <div className="icon"></div>
                    <div className="bar"></div>
                </div>
                <div className="stat">
                    <div className="icon"></div>
                    <div className="bar"></div>
                </div>
            </header>
            <div className="decision"></div>
            <footer>
                <div className="time-remaining"></div>
            </footer>
        </main>
    )
}

export default App
