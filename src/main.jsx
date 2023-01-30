import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import 'react-mosaic-component/react-mosaic-component.css'
import './index.css'
import Desktop from './components/Desktop'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Desktop />
)
