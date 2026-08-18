import {
  BrowserRouter, 
  Routes, 
  Route
} from 'react-router-dom';
import AuthLayout from './layout/AuthLayout';
import Login from './pages/login/Login';
import Registrar from './pages/login/Registrar';
import OlvidePassword from './pages/login/OlvidePassword';
import NuevoPassword from './pages/login/NuevoPassword';
import ConfirmarCuenta from './pages/login/ConfirmarCuenta';


function App() {
  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path='registrar' element={<Registrar />} />
            <Route path='olvide-password' element={<OlvidePassword />} />
            <Route path='olvide-password/:token' element={<NuevoPassword />} />
            <Route path='confirmar/:id' element={<ConfirmarCuenta />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
