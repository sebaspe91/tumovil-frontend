import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/axios";
import useAuth from "../hook/useAuth";

const UsersContext = createContext();

// Cuantos usuarios trae cada pagina. Si algun dia quieres cambiarlo, es
// esta sola linea (y coincide con el "limite" por defecto del backend).
const USUARIOS_POR_PAGINA = 5;

const UsersProvider = ({children}) => {

    const {auth} = useAuth();

    // ---- usuarios activos (pantalla "Lista de Usuarios") ----
    const [usuarios, setUsuarios] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [busqueda, setBusqueda] = useState('');
    const [paginacion, setPaginacion] = useState({ total: 0, totalPaginas: 1, paginaActual: 1, limite: USUARIOS_POR_PAGINA });

    // ---- usuarios eliminados (pantalla "Usuarios Eliminados") ----
    // exactamente el mismo patron que arriba, pero para la otra lista.
    // Se repite en vez de compartir estado porque son dos pantallas
    // independientes: cada una necesita su propia pagina y su propia
    // busqueda sin pisar la de la otra.
    const [usuariosEliminados, setUsuariosEliminados] = useState([]);
    const [paginaEliminados, setPaginaEliminados] = useState(1);
    const [busquedaEliminados, setBusquedaEliminados] = useState('');
    const [paginacionEliminados, setPaginacionEliminados] = useState({ total: 0, totalPaginas: 1, paginaActual: 1, limite: USUARIOS_POR_PAGINA });

    const [usuario, setUsuario] = useState({}); // usuario que se esta creando/editando en el formulario

    // controla si el modal con FormularioUsers esta abierto o cerrado
    const [modalFormulario, setModalFormulario] = useState(false);

    // alerta vive aca (no dentro de FormularioUsers) porque guardarUsuario
    // fuerza un remontaje de FormularioUsers al terminar (ver el "key" en
    // AdminUsers.jsx); si alerta fuera estado local de FormularioUsers, ese
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

    // Trae UNA pagina de usuarios activos desde el backend, ya filtrada
    // por lo que haya en "textoBusqueda". La sacamos del useEffect para
    // poder llamarla tambien despues de crear/editar/eliminar un usuario
    // (no solo cuando cambia la pagina o la busqueda).
    const obtenerUsuarios = async (paginaAConsultar, textoBusqueda) => {
        if (auth.tipo_user !== 'ADMIN') return;

        const config = genrarConfig();
        if (!config) return;

        try {
            // encodeURIComponent(textoBusqueda)} => coge los caracteres especiales y los vuelve adminitbles para el formato de URL
            const url = `/usuarios/lista-usuarios?pagina=${paginaAConsultar}&limite=${USUARIOS_POR_PAGINA}&busqueda=${encodeURIComponent(textoBusqueda)}`;

            const {data} = await clienteAxios(url, config);

            // si por ejemplo eliminamos el unico usuario que quedaba en la
            // ultima pagina, esa pagina queda vacia -- en vez de dejar la
            // pantalla en blanco, retrocedemos una pagina y volvemos a pedir
            if (data.usuarios.length === 0 && paginaAConsultar > 1 && data.paginacion.total > 0) {
                setPagina(paginaAConsultar - 1);
                return;
            }

            setUsuarios(data.usuarios); // los 5 usuarios q trae el backend
            setPaginacion(data.paginacion); // total, totalPaginas, ...
        } catch (error) {
            console.log(error.response?.data?.msg || error.message);
        }
    }

    // lo mismo, pero para la lista de usuarios eliminados
    const obtenerUsuariosEliminados = async (paginaAConsultar, textoBusqueda) => {
        if (auth.tipo_user !== 'ADMIN') return;

        const config = genrarConfig();
        if (!config) return;

        try {
            const url = `/usuarios/eliminados?pagina=${paginaAConsultar}&limite=${USUARIOS_POR_PAGINA}&busqueda=${encodeURIComponent(textoBusqueda)}`;

            const {data} = await clienteAxios(url, config);

            if (data.usuarios.length === 0 && paginaAConsultar > 1 && data.paginacion.total > 0) {
                setPaginaEliminados(paginaAConsultar - 1);
                return;
            }

            setUsuariosEliminados(data.usuarios);
            setPaginacionEliminados(data.paginacion);
        } catch (error) {
            console.log(error.response?.data?.msg || error.message);
        }
    }

    // se ejecuta al montar el provider y cada vez que cambia el usuario
    // logueado, la pagina pedida o el texto de busqueda
    //
    // "cargar" envuelve la llamada a obtenerUsuarios en vez de llamarla
    // directo: obtenerUsuarios termina llamando setUsuarios/setPaginacion,
    // y la regla react-hooks/set-state-in-effect se queja si un efecto
    // llama directamente a una funcion que setea estado. Envolviendola en
    // una funcion definida aca adentro, el efecto ya no "ve" esa llamada
    // como algo sincrono en su cuerpo.
    useEffect(() => {
        const cargar = async () => {
            await obtenerUsuarios(pagina, busqueda);
        };
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth, pagina, busqueda]);

    useEffect(() => {
        const cargar = async () => {
            await obtenerUsuariosEliminados(paginaEliminados, busquedaEliminados);
        };
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth, paginaEliminados, busquedaEliminados]);

    // lo que usa el buscador de ListaUsuarios.jsx: guarda el texto Y
    // vuelve a la pagina 1 (si estabas en la pagina 3 buscando otra cosa,
    // una busqueda nueva siempre debe arrancar desde el principio)
    const buscarUsuarios = (texto) => {
        setBusqueda(texto);
        setPagina(1);
    }

    // Esta funcion esta conectada a listaUsuario y esa esta conectada a Paginacion
    const cambiarPagina = (numero) => {
        setPagina(numero);
    }

    // lo mismo para la lista de eliminados
    const buscarUsuariosEliminados = (texto) => {
        setBusquedaEliminados(texto);
        setPaginaEliminados(1);
    }

    const cambiarPaginaEliminados = (numero) => {
        setPaginaEliminados(numero);
    }

    // Registrar o actualizar usuario -- ADMIN
    const guardarUsuario = async (usuarioAGuardar) => {
        const config = genrarConfig();
        if (!config) return; // termina operacion

        if (usuarioAGuardar.id_usuario) {
            // ---- actualizar uno que ya existe ----
            try {
                const url = `/usuarios/actualizar-usuario/${usuarioAGuardar.id_usuario}`;

                await clienteAxios.put(url, usuarioAGuardar, config);

                // en vez de "parchar" el usuario a mano dentro del array,
                // simplemente le volvemos a preguntar al backend por la
                // pagina que se esta viendo -- así el dato que se muestra
                // siempre es el que quedo guardado de verdad
                await obtenerUsuarios(pagina, busqueda);

                return {
                    msg: 'El usuario se actualizó correctamente'
                }

            } catch (error) {
                const msg = error.response?.data?.msg || 'No se pudo actualizar el usuario';
                console.log(msg);
                return {
                    msg,
                    error: true
                }
            }
        } else {
            // ---- registrar uno nuevo ----
            try {
                const url = "/usuarios";
                await clienteAxios.post(url, usuarioAGuardar, config);

                // limpiamos la busqueda y volvemos a la pagina 1 para que
                // el usuario recien creado (que aparece primero, porque la
                // lista viene ordenada del mas nuevo al mas viejo) quede
                // visible de inmediato
                setBusqueda('');
                setPagina(1);
                await obtenerUsuarios(1, '');

                return {
                    msg: 'El usuario se registró correctamente'
                }

            } catch (error) {
                const msg = error.response?.data?.msg || 'No se pudo registrar el usuario';
                console.log(msg);
                return {
                    msg,
                    error: true
                }
            }
        }
    }

    // abre el modal en modo "editar" con los datos del usuario elegido
    const setEditarUser = (usuarioSeleccionado) => {
        setUsuario(usuarioSeleccionado);
        setModalFormulario(true);
    }

    // abre el modal en modo "nuevo" (formulario en blanco)
    const nuevoUsuario = () => {
        setUsuario({});
        setModalFormulario(true);
    }

    // cierra el modal y limpia todo lo que haya quedado del formulario
    const cerrarModalFormulario = () => {
        setModalFormulario(false);
        setUsuario({});
        setAlerta({});
    }

    // eliminar usuario
    const setEliminarUser = async id => {
        const confirmar = confirm('¿Confirmas que deseas eliminar este usuario?');

        if (!confirmar) return;

        try {
            const config = genrarConfig();

            if (!config) return;

            const url = `/usuarios/eliminar-usuario/${id}`;
            const {data} = await clienteAxios.put(url, {}, config);

            // volvemos a pedir la pagina actual: el usuario eliminado ya no
            // deberia aparecer aca (y si la pagina quedo vacia,
            // obtenerUsuarios retrocede una pagina sola)
            await obtenerUsuarios(pagina, busqueda);

            return {
                msg: data.msg
            };

        } catch (error) {
            console.log(error);
            return {
                msg: error.response?.data?.msg || 'No se pudo eliminar el usuario',
                error: true
            };
        }
    }

    // Activar
    const setActivarUser = async id => {
        const confirmar = confirm('¿Confirmas que deseas activar este usuario?');

        if (!confirmar) return;

        try {
            const config = genrarConfig();

            if (!config) return;

            const url = `/usuarios/activar/${id}`;
            const {data} = await clienteAxios.patch(url, {}, config);

            // igual que en setEliminarUser, pero sobre la lista de eliminados
            await obtenerUsuariosEliminados(paginaEliminados, busquedaEliminados);

            return {
                msg: data.msg
            };

        } catch (error) {
            console.log(error);
            return {
                msg: error.response?.data?.msg || 'No se pudo activar el usuario',
                error: true
            };
        }
    }


  return (
    <>
        <UsersContext.Provider
            value={{
                usuarios,
                paginacion,
                busqueda,
                buscarUsuarios,
                cambiarPagina,

                usuariosEliminados,
                paginacionEliminados,
                busquedaEliminados,
                buscarUsuariosEliminados,
                cambiarPaginaEliminados,

                guardarUsuario,
                setEditarUser,
                nuevoUsuario,
                modalFormulario,
                cerrarModalFormulario,
                usuario,

                setEliminarUser,
                setActivarUser,

                alerta,
                setAlerta
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
