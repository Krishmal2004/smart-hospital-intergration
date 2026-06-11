import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@asgardeo/auth-react'
import './index.css'
import App from './App.jsx'

const asgardeoConfig = {
  signInRedirectURL: import.meta.env.VITE_APP_URL,
  signOutRedirectURL: import.meta.env.VITE_APP_URL,
  clientID: import.meta.env.VITE_ASGARDEO_CLIENT_ID,
  baseUrl: import.meta.env.VITE_ASGARDEO_BASE_URL,
  scope: ["openid", "profile"]
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider config={asgardeoConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
)
