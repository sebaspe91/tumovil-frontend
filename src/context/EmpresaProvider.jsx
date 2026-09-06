import { createContext, useState, useEffect } from "react";
import useAuth from "../hook/useAuth";
import clienteAxios from "../config/axios";

const EmpresaContext = createContext();

const EmpresaProvider = ({children}) => {

    // usuario que tiene la sesion iniciada
    const {auth} = useAuth();

    // los datos de la unica empresa que existe
    const [empresa, setEmpresa] = useState({});

    // alerta para mostrar el resultado de guardar cambios
    const [alerta, setAlerta] = useState({});

    // Funcion para crear el config con el token de autenticacion
    const generarConfig = () => {
        const token = localStorage.getItem('token');

        if (!token) return; // termina operacion

        return {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    }

    // obtener la empresa (no recibe id, el backend ya sabe cual traer)
    const obtenerEmpresa = async () => {
        const config = generarConfig();
        if (!config) return;

        try {
            const {data} = await clienteAxios('/empresa', config);
            setEmpresa(data.empresa);
        } catch (error) {
            console.log(error.response?.data?.msg || error.message);
        }
    }

    // se trae la empresa apenas hay una sesion iniciada
    useEffect(() => {
        const cargar = async () => {
            await obtenerEmpresa();
        }
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth]);

    // actualizar los datos de la empresa (tampoco recibe id)
    const actualizarEmpresa = async datos => {
        const config = generarConfig();
        if (!config) return;

        try {
            const {data} = await clienteAxios.put('/empresa', datos, config);

            // el backend responde con la empresa ya actualizada -- la
            // guardamos para que el formulario se refresque solo
            setEmpresa(data.empresa);

            return {
                msg: data.msg
            }
        } catch (error) {
            const msg = error.response?.data?.msg || 'No se pudo actualizar la empresa';
            console.log(msg);
            return {
                msg,
                error: true
            }
        }
    }

    return (
        <>
            <EmpresaContext.Provider
                value={{
                    empresa,
                    actualizarEmpresa,
                    alerta,
                    setAlerta
                }}
            >
                {children}
            </EmpresaContext.Provider>
        </>
    )
}


export {
    EmpresaProvider
};

export default EmpresaContext;
