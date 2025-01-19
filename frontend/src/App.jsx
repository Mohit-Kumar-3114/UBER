import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import Captainlogin from './pages/Captainlogin'
import UserSignup from './pages/UserSignup'
import CaptainSignup from './pages/CaptainSingup'
function App() {

  
  return (
  <BrowserRouter>
   <Routes>
   <Route path='/' element={<Start />} />
   <Route path='/login' element={<UserLogin />} />
   <Route path='/captain-login' element={<Captainlogin />} />
   <Route path='/signup' element={<UserSignup />} />
   <Route path='/captain-signup' element={<CaptainSignup />} />
   <Route path='/home' element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          } />



   </Routes>
    </BrowserRouter>
  )
}

export default App
