import {useState, useEffect, createContext} from 'react';
import clienteAxios from '../config/axios';
import useAuth from '../hook/useAuth';

const ClientesContext = createContext();

// paginacion limite
const CLIENTES_POR_PAGINA = 5;

const ClientesProvider =({children}) => {

    const {auth} = useAuth();

    // clientes activos
    const [clientes, setClientes] = useState([]);
    const [paginaCliente, setPaginaCliente] = useState(1);
    const [busquedaCliente, setBusquedaCliente] = useState('');
    const [paginacionCliente, setPaginacionCliente] = useState({ total: 0, totalPaginas: 1, paginaActual: 1, limite: CLIENTES_POR_PAGINA });

    // clientes Eliminados
    const [clientesEliminados, setClientesEliminados] = useState([]);
    const [paginaClienteEliminados, setPaginaClienteEliminados] = useState(1);
    const [busquedaClienteEliminados, setBusquedaClienteEliminados] = useState('');
    const [paginacionClienteEliminados, setPaginacionClienteEliminados] = useState({ total: 0, totalPaginas: 1, paginaActual: 1, limite: CLIENTES_POR_PAGINA });

    const [cliente, setCliente] = useState({});

    // para uzar el modal
    const [modalFormularioCliente, setModalFormularioCliente] = useState(false);

    // alerta vive aca para que muestre los mensajes desde aca
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

    // obtenemos los clientes activos
    const obtenerClientes = async (paginaAConsultar, textoBusqueda) => {
        const  config = genrarConfig();
        if (!config) return;

        try {
            const url = `/clientes?pagina=${paginaAConsultar}&limite=${CLIENTES_POR_PAGINA}&busqueda=${encodeURIComponent(textoBusqueda)}`;
            const {data} = await clienteAxios(url, config);

            // si se elimina el ultimo cliente de la pagina se devuelve a la anterior
            if (data.clientes.length === 0 && paginaAConsultar > 1 && data.paginacion.total > 0) {
                setPaginaCliente(paginaAConsultar - 1);
                return;
            }

            setClientes(data.clientes); // los 5 clientes que trae del backend
            setPaginacionCliente(data.paginacion); // objeto con todo de paginacion

        } catch (error) {
            console.log(error.response?.data?.msg || error.message);
        }
    }

    // Obtenemos los clientes eliminados
    const obtenerClientesEliminados = async (paginaAConsultar, textoBusqueda) => {

        const  config = genrarConfig();
        if (!config) return;

        try {
            const url = `/clientes/eliminados?pagina=${paginaAConsultar}&limite=${CLIENTES_POR_PAGINA}&busqueda=${encodeURIComponent(textoBusqueda)}`;
            const {data} = await clienteAxios(url, config);

            // si se elimina el ultimo cliente de la pagina se devuelve a la anterior
            if (data.clientes.length === 0 && paginaAConsultar > 1 && data.paginacion.total > 0) {
                setPaginaClienteEliminados(paginaAConsultar - 1);
                return;
            }

            setClientesEliminados(data.clientes); // los 5 clientes que trae del backend
            setPaginacionClienteEliminados(data.paginacion); // objeto con todo de paginacion

        } catch (error) {
            console.log(error.response?.data?.msg || error.message);
        }
    }



    // llamamos la funcion para optener los clientes activos
    useEffect(() => {
        const cargar = async () => {
            await obtenerClientes(paginaCliente, busquedaCliente);
        }
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth, paginaCliente, busquedaCliente]);



    // llamamos la funcion para optener los clientes Eliminados
    useEffect(() => {
        const cargar = async () => {
            await obtenerClientesEliminados(paginaClienteEliminados, busquedaClienteEliminados);
        }
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth, paginaClienteEliminados, busquedaClienteEliminados]);




    // Busqueda de cliente Activo
    const buscarCliente = (texto) => {
        setBusquedaCliente(texto);
        setPaginaCliente(1);
    }

    // Esta funcion esta conectada a listaUsuario y esa esta conectada a Paginacion
    const cambiarPaginaCliente = (numero) => {
        setPaginaCliente(numero);
    }

    // lo mismo para la lista de eliminados
    const buscarClienteEliminados = (texto) => {
        setBusquedaClienteEliminados(texto);
        setPaginaClienteEliminados(1);
    }

    const cambiarPaginaClienteEliminados = (numero) => {
        setPaginaClienteEliminados(numero);
    }

    // Registrar o actualizar usuario
    const guardarCliente = async (clienteAGuardar) => {
        const config = genrarConfig();
        if (!config) return;

        if (clienteAGuardar.id_cliente) {
            // actualizar
            try {
                const url = `/clientes/${clienteAGuardar.id_cliente}`;
                await clienteAxios.put(url, clienteAGuardar, config);

                await obtenerClientes(paginaCliente, busquedaCliente);

                return {
                    msg: 'El Cliente se actualizó correctamente'
                }

            } catch (error) {
                const msg = error.response?.data?.msg || 'No se pudo actualizar al Cliente';
                console.log(msg);
                return {
                    msg,
                    error: true
                }
            }
        } else {
            try {
                // registrar nuevo cliente
                const url = "/clientes";
                await clienteAxios.post(url, clienteAGuardar, config);

                setBusquedaCliente('');
                setPaginaCliente(1);

                await obtenerClientes(1, '');

                return {
                    msg: 'El Cliente se registró correctamente'
                }
            } catch (error) {
                const msg = error.response?.data?.msg || 'No se pudo registrar al Cliente';
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
    const setEditarCliente = (clienteSeleccionado) => {
        setCliente(clienteSeleccionado);
        setModalFormularioCliente(true);
    }

    // abre el modal en modo "nuevo" (formulario en blanco)
    const nuevoCliente = () => {
        setCliente({});
        setModalFormularioCliente(true);
    }

    // cierra el modal y limpia todo lo que haya quedado del formulario
    const cerrarModalFormularioCliente = () => {
        setModalFormularioCliente(false);
        setCliente({});
        setAlerta({});
    }


    // eliminar usuario
    const setEliminarCliente = async id => {
        const confirmar = confirm('¿Confirmas que deseas eliminar a este Cliente?');

        if (!confirmar) return;

        try {
            const config = genrarConfig();

            if (!config) return;

            const url = `/clientes/eliminar/${id}`;
            const {data} = await clienteAxios.put(url, {}, config);

            await obtenerClientes(paginaCliente, busquedaCliente);

            return {
                msg: data.msg
            };

        } catch (error) {
            console.log(error);
            return {
                msg: error.response?.data?.msg || 'No se pudo eliminar al Cliente',
                error: true
            };
        }
    }

    // Activar
    const setActivarCliente = async id => {
        const confirmar = confirm('¿Confirmas que deseas activar a este Cliente?');

        if (!confirmar) return;

        try {
            const config = genrarConfig();

            if (!config) return;

            const url = `/clientes/${id}`;
            const {data} = await clienteAxios.patch(url, {}, config);

            // igual sobre la lista de eliminados
            await obtenerClientesEliminados(paginaClienteEliminados, busquedaClienteEliminados);

            return {
                msg: data.msg
            };

        } catch (error) {
            console.log(error);
            return {
                msg: error.response?.data?.msg || 'No se pudo activar al Cliente',
                error: true
            };
        }
    }

  return (
    <>
      <ClientesContext.Provider
        value={{
            clientes,
            paginacionCliente,
            busquedaCliente,
            buscarCliente,
            cambiarPaginaCliente,

            clientesEliminados,
            paginacionClienteEliminados,
            busquedaClienteEliminados,
            buscarClienteEliminados,
            cambiarPaginaClienteEliminados,

            guardarCliente,
            setEditarCliente,
            nuevoCliente,
            modalFormularioCliente,
            cerrarModalFormularioCliente,
            cliente,

            setEliminarCliente,
            setActivarCliente,

            alerta,
            setAlerta
        }}
      >
        {children}
      </ClientesContext.Provider>
    </>
  )
}




export {
    ClientesProvider
};

export default ClientesContext;
