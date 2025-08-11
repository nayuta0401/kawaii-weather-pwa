import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

const root = createRoot(document.getElementById('root')!)
root.render(<App />)