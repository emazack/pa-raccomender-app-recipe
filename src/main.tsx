import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { WizardProvider } from './context/WizardContext'
import './styles/main.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WizardProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WizardProvider>
  </React.StrictMode>,
)