import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import { routeFor } from './routes'
import './styles.css'

const root = document.getElementById('root')!
const app = <StrictMode><App route={routeFor(window.location.pathname)} /></StrictMode>

if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
