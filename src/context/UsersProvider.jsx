import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/axios";
import useAuth from "../hook/useAuth";

const UsersContext = createContext();

const UsersProvider = ({children}) => {

    const {auth} = useAuth(); // trae todos los usuarios registrados

    const [usuarios, setUsuarios] = useState([]);
    const [usuariosEliminados, setUsuariosEliminados] = useState([]);
    const [usuario, setUsuario] = useState({});
    // alerta vive aca (no dentro de FormularioUsers) porque guardarUsuario
    // fuerza un remontaje de FormularioUsers al terminar (ver setUsuario({})
    // mas abajo); si alerta fuera estado local de FormularioUsers, ese
    // remontaje la borraria antes de que el usuario alcance a verla
    const [alerta, setAlerta] = useState({});

    // funciones para crear config
    const genrarConfig = () => {
        const token = localStorage.getItem('token');

        if (!token) return; // termina operacion

        // crear encabezado
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            } 
        }

        return config;

    }

    useEffect(() => {
        const obtenerUsuarios = async () => {

            if (auth.tipo_user !== 'ADMIN') return;

            const config = genrarConfig();
            if (!config) return; // termina operacion

            try {
                const url = "/usuarios/lista-usuarios";
                const {data} = await clienteAxios(url, config);            
                setUsuarios(data.usuarios);

            } catch (error) {
                console.log(error.response.data.msg);
            }
        }

        obtenerUsuarios();
    }, [auth]);

    useEffect(() => {
        const obtenerUsuariosEliminados = async () => {

            if (auth.tipo_user !== 'ADMIN') return;

            const config = genrarConfig();
            if (!config) return; // termina operacion

            try {
                const url = "/usuarios/eliminados";
                const {data} = await clienteAxios(url, config);            
                setUsuariosEliminados(data.usuarios);

            } catch (error) {
                console.log(error.response.data.msg);
            }
        }

        obtenerUsuariosEliminados();
    }, [auth]);

    // Registrar usuario -- ADMIN
    const guardarUsuario = async (usuario) => {
        const config = genrarConfig();
        if (!config) return; // termina operacion
        
        if (usuario.id_usuario) {
            try {
                const url = `/usuarios/actualizar-usuario`;
                const {data} = await clienteAxios.put(`${url}/${usuario.id_usuario}`, usuario, config);


                // usariio actualizado
                const usuarioActualizado = usuarios.map(usuarioState => usuarioState.id_usuario === data.usuarioActualizado.id_usuario ? data.usuarioActualizado : usuarioState);

                setUsuarios(usuarioActualizado);
                setUsuario({}); // para volver actualizar el mismo

                return {
                    msg: 'El usuario Se Actualizo correctamente'
                }

            } catch (error) {
                console.log(error.response.data.msg);
                return {
                    msg: error.response.data.msg,
                    error: true
                }
            }
        } else {
            try {
                const url = "/usuarios";
                const {data} = await clienteAxios.post(url, usuario, config);

                setUsuarios([data.usuarioGuardado, ...usuarios]);


                return {
                    msg: 'El usuario Se Registro correctamente'
                }

            } catch (error) {
                console.log(error.response.data.msg);
                return {
                    msg: error.response.data.msg,
                    error: true
                }
            }
        }
    }

    // editar usuario
    const setEditarUser = (usuario) => {
        setUsuario(usuario);
    }

    // eliminar usuario
    const setEliminarUser = async id => {
        // confirmar si desea eliminar el usuario
        
        const confirmar = confirm('¿Confirmas que deseas eliminar');

        if (confirmar) {
            try {
                const config = genrarConfig();

                if (!config) return;
                
                const url = `/usuarios/eliminar-usuario/${id}`;
                const {data} = await clienteAxios.put(url, {}, config);

                // lo sacamos de "activos"...
                const usuarioEliminado = usuarios.find(usuarioState => usuarioState.id_usuario === id);
                const usuariosActualizado = usuarios.filter(usuarioState => usuarioState.id_usuario !== id);
                setUsuarios(usuariosActualizado);

                // ...y lo agregamos a "eliminados", ya con estado_user en false
                if (usuarioEliminado) {
                    setUsuariosEliminados([{...usuarioEliminado, estado_user: false}, ...usuariosEliminados]);
                }

                return{
                    msg: data.msg
                };

            } catch (error) {
                console.log(error);
                return {
                    msg: error.response.data.msg,
                    error: true
                };
            }
        }
    }

    // Activar
    const setActivarUser = async id => {
        // confirmar si desea eliminar el usuario
        
        const confirmar = confirm('¿Confirmas que deseas activar el usuario');

        if (confirmar) {
            try {
                const config = genrarConfig();

                if (!config) return;
                
                const url = `/usuarios/activar/${id}`;
                const {data} = await clienteAxios.patch(url, {}, config);

                // lo sacamos de "eliminados", que es la lista que se ve en esta pantalla
                const usuarioActivado = usuariosEliminados.find(usuarioState => usuarioState.id_usuario === id);
                const usuariosEliminadosActualizado = usuariosEliminados.filter(usuarioState => usuarioState.id_usuario !== id);
                setUsuariosEliminados(usuariosEliminadosActualizado);

                // y lo agregamos a la lista de activos, ya con estado_user en true
                if (usuarioActivado) {
                    setUsuarios([{...usuarioActivado, estado_user: true}, ...usuarios]);
                }

                return{
                    msg: data.msg
                };

            } catch (error) {
                console.log(error);
                return {
                    msg: error.response.data.msg,
                    error: true
                };
            }
        }
    }


  return (
    <>
        <UsersContext.Provider 
            value={{
                usuarios,
                guardarUsuario,
                setEditarUser,
                usuario,
                setEliminarUser,
                alerta,
                setAlerta,
                setActivarUser,
                usuariosEliminados
            }}
        >
            {children}
        </UsersContext.Provider >
    </>
  )
}


export {
    UsersProvider
};
export default UsersContext;
