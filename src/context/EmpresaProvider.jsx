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

    // Funcion para crear el config con el token de autenticacion.
    // "multipart" en true es para cuando se manda un archivo (el logo):
    // en ese caso NO se pone "Content-Type" a mano, porque el navegador
    // tiene que agregarle el "boundary" (el separador entre cada campo
    // del formulario) y eso no lo podemos escribir nosotros mismos.
    const generarConfig = (multipart = false) => { // parametro con valor por defecto a false, si no trae argumento ps vale false
        const token = localStorage.getItem('token');

        if (!token) return; // termina operacion

        const headers = {
            Authorization: `Bearer ${token}`
        }

        // Si es false coloca el valor que venia antes pero si no se deja el valor Content-Type sin definir, aproposito para despues agregar otro con archivos
        if (!multipart) {
            headers["Content-Type"] = "application/json";
        }

        return {headers}
    }

    // obtener la empresa (no recibe id, el backend ya sabe cual traer)
    const obtenerEmpresa = async () => {
        const config = generarConfig();
        if (!config) return;

        try {
            const {data} = await clienteAxios('/empresa', config);
            setEmpresa(data.empresa); // agrega los datos de la consulta en este state
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

    // actualizar los datos de la empresa (tampoco recibe id).
    // "datos" puede ser un objeto normal (solo texto) o un FormData
    // (cuando ademas se esta subiendo un logo nuevo) -- se detecta solo.
    const actualizarEmpresa = async datos => {

        /* 
        instanceof => es un operador de JavaScript que pregunta "¿este valor fue construido con este constructor específico?". Aquí pregunta: "¿lo que me mandaron es un objeto FormData (como el que armamos en AdminEmpresa.jsx cuando hay logo), o es un objeto normal {...} (solo texto)?". El resultado (true o false) queda en esFormData.
        */
        const esFormData = datos instanceof FormData;
        const config = generarConfig(esFormData);
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
