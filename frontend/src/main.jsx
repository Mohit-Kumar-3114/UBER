import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CaptainContext from './context/CaptainContext.jsx'
import UserContext from './context/UserContext.jsx'
// import SocketProvider from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  
  <CaptainContext>
    <UserContext>
      
          <App />
    
    </UserContext>
  </CaptainContext>

)
