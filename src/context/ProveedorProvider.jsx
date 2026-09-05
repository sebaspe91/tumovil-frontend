import { createContext, useState, useEffect } from "react";
import useAuth from "../hook/useAuth";
import clienteAxios from "../config/axios";

const ProveedorContext = createContext();


// Paginacion
const PROVEEDOR_POR_PAGINA = 5;


const ProveedorProvider = ({children}) => {

    // usuario que manipula
    const {auth} = useAuth();

    // proveedores activos
    const [proveedores, setProveedores] = useState([]); // todos los proveedores de la db
    const [paginaProveedor, setPaginaProveedor] = useState(1); // pagina actual
    const [busquedaProveedor, setBusquedaProveedor] = useState(''); // guarda lo que hay q buscar
    const [paginacionProveedor, setPaginacionProveedor] = useState({
        total: 0,
        totalPaginas: 1,
        paginaActual: 1,
        limite: PROVEEDOR_POR_PAGINA
    });

    // proveedores ELIMINADOS
    const [proveedoresEliminados, setProveedoresEliminados] = useState([]);
    const [paginaProveedorEliminados, setPaginaProveedorEliminados] = useState(1);
    const [busquedaProveedorEliminados, setBusquedaProveedorEliminados] = useState('');
    const [PaginacionProveedorEliminados, setPaginacionProveedorEliminados] = useState({
        total: 0,
        totalPaginas: 1,
        paginaActual: 1,
        limite: PROVEEDOR_POR_PAGINA
    });

    // el contenedor del proveedor solo
    const [proveedor, setProveedor] = useState({});

    // modal si se abre o no
    const [modalFormularioProveedor, setModalFormularioProveedor] = useState(false);

    // alerta
    const [alerta, setAlerta] = useState({});
    

    // FUNCIONES

    // Funcion para crear el config autenticacion
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

    // obtener los proveedores activos
    const obtenerProveedores = async (paginaAConsultar, textoBusqueda) => {
        const  config = genrarConfig();
        if (!config) return;

        try {
            const url = `/proveedores?pagina=${paginaAConsultar}&limite=${PROVEEDOR_POR_PAGINA}&busqueda=${encodeURIComponent(textoBusqueda)}`;
            const {data} = await clienteAxios(url, config);

            // si se elimina el ultimo proveedor de la pagina se devuelve a la anterior
            if (data.proveedores.length === 0 && paginaAConsultar > 1 && data.paginacion.total > 0) {
                setPaginaProveedor(paginaAConsultar - 1);
                return;
            }

            setProveedores(data.proveedores); // los 5 proveedores que trae del backend
            setPaginacionProveedor(data.paginacion); // objeto con todo de paginacion

        } catch (error) {
            console.log(error.response?.data?.msg || error.message);
        }
    }

    // obtener los proveedores Eliminados
    const obtenerProveedoresEliminados = async (paginaAConsultar, textoBusqueda) => {
        const  config = genrarConfig();
        if (!config) return;

        try {
            const url = `/proveedores/eliminados?pagina=${paginaAConsultar}&limite=${PROVEEDOR_POR_PAGINA}&busqueda=${encodeURIComponent(textoBusqueda)}`;
            const {data} = await clienteAxios(url, config);

            // si se elimina el ultimo proveedor de la pagina se devuelve a la anterior
            if (data.proveedores.length === 0 && paginaAConsultar > 1 && data.paginacion.total > 0) {
                setPaginaProveedorEliminados(paginaAConsultar - 1);
                return;
            }

            setProveedoresEliminados(data.proveedores); // los 5 proveedores que trae del backend
            setPaginacionProveedorEliminados(data.paginacion); // objeto con todo de paginacion

        } catch (error) {
            console.log(error.response?.data?.msg || error.message);
        }
    }

    // Llamar las funcones de obtener
    useEffect(() => {
        const cargar = async () => {
            await obtenerProveedores(paginaProveedor, busquedaProveedor);
        }
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth, paginaProveedor, busquedaProveedor]);



    // eliminados
    useEffect(() => {
        const cargar = async () => {
            await obtenerProveedoresEliminados(paginaProveedorEliminados, busquedaProveedorEliminados);
        }
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth, paginaProveedorEliminados, busquedaProveedorEliminados]);


    // busqueda de proveedor
    const buscarProveedor = (texto) => {
        setBusquedaProveedor(texto);
        setPaginaProveedor(1);
    }

    // busqueda de proveedor Eliminados
    const buscarProveedorEliminados = (texto) => {
        setBusquedaProveedorEliminados(texto);
        setPaginaProveedorEliminados(1);
    }

    // cambiar de pagina
    const cambiarPaginaProveedor = (numero) => {
        setPaginaProveedor(numero);
    }

    // cambiar de pagina Eliminados
    const cambiarPaginaProveedorEliminados = (numero) => {
        setPaginaProveedorEliminados(numero);
    }


    // REGISTRAR NUEVO PROVEEODR o EDITARLO
    const guardarProveedor = async proveedorGuardar => {
        const config = genrarConfig();
        if (!config) return;

        // editar
        if (proveedorGuardar.id_proveedor) {
            try {
                const url = `proveedores/${proveedorGuardar.id_proveedor}`;
                await clienteAxios.put(url, proveedorGuardar, config);

                await obtenerProveedores(paginaProveedor, busquedaProveedor);

                return {
                    msg: 'El Proveedor se actualizó correctamente'
                }

            } catch (error) {
                const msg = error.response?.data?.msg || 'No se pudo actualizar al Proveedor';
                console.log(msg);
                return {
                    msg,
                    error: true
                }
            }
        } else {
            // registrar
            try {
                const url = '/proveedores';
                await clienteAxios.post(url, proveedorGuardar, config);

                setBusquedaProveedor('');
                setPaginaProveedor(1);

                await obtenerProveedores(1, '');

                return {
                    msg: 'El Proveedor se registró correctamente'
                }

            } catch (error) {
                const msg = error.response?.data?.msg || 'No se pudo registrar al Proveedor';
                console.log(msg);
                return {
                    msg,
                    error: true
                }
            }
        }

    }


    // MODAL

    // abre el modal en modo "editar" con los datos del usuario elegido
    const setEditarProveedor = (proveedorSeleccionado) => {
        setProveedor(proveedorSeleccionado);
        setModalFormularioProveedor(true);
    }

    // abre el modal en modo "nuevo" (formulario en blanco)
    const nuevoProveedor = () => {
        setProveedor({});
        setModalFormularioProveedor(true);
    }

    // cierra el modal y limpia todo lo que haya quedado del formulario
    const cerrarModalFormularioProveedor = () => {
        setModalFormularioProveedor(false);
        setProveedor({});
        setAlerta({});
    }


    // BOTONES ELIMINAR, ACTIVAR

    // eliminar
    const setEliminarProveedor = async id => {
        const confirmar = confirm('¿Confirmas que deseas eliminar a este Proveedor?');

        if (!confirmar) return;
        try {
            const config = genrarConfig();

            if (!config) return;

            const url = `/proveedores/eliminar/${id}`;
            const {data} = await clienteAxios.put(url, {}, config);

            await obtenerProveedores(paginaProveedor, busquedaProveedor);

            return {
                msg: data.msg
            };

        } catch (error) {
            console.log(error);
            return {
                msg: error.response?.data?.msg || 'No se pudo eliminar al Proveedor',
                error: true
            };
        }
    }


    // Activar
    const setActivarProveedor = async id => {
        const confirmar = confirm('¿Confirmas que deseas activar a este Proveedor?');

        if (!confirmar) return;

        try {
            const config = genrarConfig();

            if (!config) return;

            const url = `/proveedores/${id}`;
            const {data} = await clienteAxios.patch(url, {}, config);

            // igual sobre la lista de eliminados
            await obtenerProveedoresEliminados(paginaProveedorEliminados, busquedaProveedorEliminados);

            return {
                msg: data.msg
            };

        } catch (error) {
            console.log(error);
            return {
                msg: error.response?.data?.msg || 'No se pudo activar al Proveedor',
                error: true
            };
        }
    }


    return(
        <ProveedorContext.Provider
            value={{
                proveedores,
                paginacionProveedor,
                busquedaProveedor,
                buscarProveedor,
                cambiarPaginaProveedor,

                proveedoresEliminados,
                PaginacionProveedorEliminados,
                busquedaProveedorEliminados,
                buscarProveedorEliminados,
                cambiarPaginaProveedorEliminados,

                guardarProveedor,
                setEditarProveedor,
                nuevoProveedor,
                modalFormularioProveedor,
                cerrarModalFormularioProveedor,
                proveedor,

                setEliminarProveedor,
                setActivarProveedor,

                alerta,
                setAlerta
            }}
        >
            {children}
        </ProveedorContext.Provider>
    )
}


export {
    ProveedorProvider
}

export default ProveedorContext;