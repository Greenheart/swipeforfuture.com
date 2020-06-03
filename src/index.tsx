import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

const urlParams = new URLSearchParams(window.location.search)
const path = urlParams.get('path') || '/data/scenarios/default'

ReactDOM.render(<App path={path} />, document.getElementById('root'))
