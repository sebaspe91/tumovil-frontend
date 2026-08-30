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
import EditarPerfil from './pages/users/EditarPerfil';
import CambiarPassword from './pages/users/CambiarPassword';

import AdminCliente from './pages/clientes/AdminCliente';

import FacturaVenta from './pages/facturaVenta/FacturaVenta';

import { AuthProvider } from './context/AuthProvider';
import { UsersProvider } from './context/UsersProvider';
import { FacturaVentaProvider } from './context/FacturaVentaProvider';
import { ClientesProvider } from './context/ClientesProvider';


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

              {/* usuarios */}
              <Route path='admin-users/perfil' element={
                <UsersProvider> <EditarPerfil /> </UsersProvider>
              }/>

              <Route path='admin-users/cambiar-password' element={
                <UsersProvider> <CambiarPassword /> </UsersProvider>
              }/>

              {/* Clientes */}
              <Route path='clientes' element={
                <ClientesProvider> <AdminCliente /> </ClientesProvider>
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
