import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import AuthLayout from './layout/AuthLayout';
import RutaProtegida from './layout/RutaProtegida';
import RutaAdmin from './layout/RutaAdmin';

import Login from './pages/login/Login';
import Registrar from './pages/login/Registrar';
import OlvidePassword from './pages/login/OlvidePassword';
import NuevoPassword from './pages/login/NuevoPassword';
import ConfirmarCuenta from './pages/login/ConfirmarCuenta';
import AdminUsers from './pages/users/AdminUsers';
import AdminUsersEliminados from './pages/users/AdminUsersEliminados';
import FacturaVenta from './pages/facturaVenta/FacturaVenta';

import { AuthProvider } from './context/AuthProvider';
import { UsersProvider } from './context/UsersProvider';
import { FacturaVentaProvider } from './context/FacturaVentaProvider';


function App() {


  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Públicas */}
            <Route path='/' element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path='registrar' element={<Registrar />} />
              <Route path='olvide-password' element={<OlvidePassword />} />
              <Route path='olvide-password/:token' element={<NuevoPassword />} />
              <Route path='confirmar/:id' element={<ConfirmarCuenta />} />
            </Route>

            {/* privadas */}
            <Route element={<RutaProtegida />}>

              {/* (ADMIN y VENDEDOR) */}
              <Route path='factura-venta' element={
                <FacturaVentaProvider> <FacturaVenta /> </FacturaVentaProvider>
              }/>

              {/* Solo ADMIN */}
              <Route element={<RutaAdmin />}>

                <Route path='admin-users' element={
                  <UsersProvider> <AdminUsers /> </UsersProvider>
                }/>

                <Route path='admin-users/eliminados' element={
                  <UsersProvider> <AdminUsersEliminados /> </UsersProvider>
                }/>

              </Route>

            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
