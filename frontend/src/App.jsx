import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import Captainlogin from './pages/Captainlogin'
import UserSignup from './pages/UserSignup'
import CaptainSignup from './pages/CaptainSingup'
import UserProtectWrapper from './pages/UserProtectedWrapper'
import UserLogout from './pages/UserLogout'
import Home from './pages/Home'
import CaptainLogout from './pages/CaptainLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectedWrapper'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import 'remixicon/fonts/remixicon.css'

function App() {

  
  return (
  <BrowserRouter>
   <Routes>
   <Route path='/' element={<Start />} />
   <Route path='/login' element={<UserLogin />} />
   <Route path='/captain-login' element={<Captainlogin />} />
   <Route path='/signup' element={<UserSignup />} />
   <Route path='/captain-signup' element={<CaptainSignup />} />
   <Route path='/home' element={<UserProtectWrapper><Home /></UserProtectWrapper>} />
   <Route path='/user/logout' element={<UserLogout />} />
   <Route path='/captain-home' element={<CaptainProtectWrapper><CaptainHome /></CaptainProtectWrapper>} />
   <Route path='/captain/logout' element={<CaptainLogout />} />
   <Route path='/riding' element={<Riding />} />
   <Route path='/captain-riding' element={<CaptainRiding />} />

   </Routes>
    </BrowserRouter>
  )
}

export default App
