import React from 'react'

import Bar from './components/Bar'
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

export default App
