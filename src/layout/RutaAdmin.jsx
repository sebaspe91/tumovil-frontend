import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hook/useAuth";

function RutaAdmin() {

    const { auth } = useAuth();

    return auth?.tipo_user === 'ADMIN'
        ? <Outlet />
        : <Navigate to="/factura-venta" />;
}

export default RutaAdmin;
