import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { InterfaceProvider } from './Context.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InterfaceProvider>
      <App />
    </InterfaceProvider>
  </StrictMode>,
)
