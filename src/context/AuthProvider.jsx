import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/axios";

// funcion con los elementos de createContext
const AuthContext = createContext();

const AuthProvider = ({children}) => {

    // states
    const [cargando, setCargando] = useState(true); // cuando la pagina este lista
    const [auth, setAuth] = useState({});

    // verificar que el usuario este autenticado JWT
    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token');
            
            // no se carga la pagina
            if (!token) {
                setCargando(false);
                return;
            }

            // encabezado de la autenticacion
            const config = {
                headers: {
                    "Content-Type": "application/json", // Escribir tal cual como esta aca respetando mayusculas y minusculas
                    Authorization: `Bearer ${token}` // Colocar tal cual como esta aca 
                }
            }

            try {

                const url = '/usuarios/perfil';
                const {data} = await clienteAxios(url, config);
                setAuth(data.perfil);

            } catch (error) {

                console.log(error);
                setAuth({});
            }

            // se termina la consulta
            setCargando(false);
            console.log('Si hay token');

        }

        // llamara funcion
        autenticarUsuario();
    }, []);

    // cerrar sesion
    const cerrarSesion = () => {
        localStorage.removeItem('token');
        setAuth({});
    }

    // Actualizar Perfil


    // Guardar Passwoard Perfil


    // Activar usuario

    return(
        <AuthContext.Provider 
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesion
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}


export {
    AuthProvider
};

export default AuthContext;