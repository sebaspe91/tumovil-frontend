import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

function RutaProtegida() {

    const {auth, cargando} = useAuth();

    if (cargando) return 'Cargando...';

  return (
    <>

        <Header />

        {auth?.id_usuario ? (
            <div className="flex">
                <Sidebar />
                <main className="container mx-auto mt-10 flex-1">
                    <Outlet />
                </main>
            </div>
        ) : <Navigate to="/" />}

        <Footer />

    </>
  )
}

export default RutaProtegida;
