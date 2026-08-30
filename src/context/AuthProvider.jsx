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
    const actualizarPerfil = async datos => {
        const token = localStorage.getItem('token');
        
        // si no hay token para la ejecucion de este modulo y no inicia sesion
        if (!token) {
            setCargando(false);
            return;
        }

        const config = {
            headers: {
                "Content-Type": "application/json", 
                Authorization: `Bearer ${token}` 
            }
        }

        try {
            const url = `/usuarios/perfil/${datos.id_usuario}`;
            const {data} = await clienteAxios.put(url, datos, config);

            // el backend ya responde con el usuario actualizado (sin
            // password ni token) -- lo guardamos en "auth" para que
            // cualquier componente que lo use (como el Header) se
            // refresque solo, sin recargar la pagina ni volver a loguearse
            setAuth(data);

            return {
                msg: 'Actualizado Correctamente',
                error: false
            }

        } catch (error) {
            console.log('error')
            return{
                msg: error.response.data.msg,
                error: true
            };
        }
    }


    // guardar password nuevo desde perfil
    const guardarPassword = async (datos) => {

        // obtener token de local storage
        const token = localStorage.getItem('token');
        
        // si no hay token para la ejecucion de este modulo y no inicia sesion
        if (!token) {
            setCargando(false);
            return;
        }

        // Creamos el encabezado donde va las autenticaciones de la peticion
        const config = {
            headers: {
                "Content-Type": "application/json", 
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const url = 'usuarios/cambiar-password';
            await clienteAxios.put(url, datos, config);
            return {
                msg: 'Passwoard actualizado correctamente'
            };
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            };
        }
    }



    return(
        <AuthContext.Provider 
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesion,
                actualizarPerfil,
                guardarPassword
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