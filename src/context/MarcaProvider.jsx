import { createContext, useState, useEffect } from "react";
import clienteAxios from "../config/axios";
import useAuth from "../hook/useAuth";


const MarcaContext = createContext();

const MARCA_POR_PAGINA = 5;

const MarcaProvider = ({children}) => {

  const {auth} = useAuth();

  // MARCAS ACTIVAS
  const [marcas, setMarcas] = useState([]);
  const [paginaMarca, setPaginaMarca] = useState(1);
  const [busquedaMarca, setBusquedaMarca] = useState('');
  const [paginacionMarca, setPaginacionMarca] = useState({
    total: 0,
    totalPaginas: 1,
    paginaActual: 1,
    limite: MARCA_POR_PAGINA
  });

  // MARCAS ELIMINADAS
  const [marcasEliminados, setMarcasEliminados] = useState([]);
  const [paginaMarcaEliminados, setPaginaMarcaEliminados] = useState(1);
  const [busquedaMarcaEliminados, setBusquedaMarcaEliminados] = useState('');
  const [paginacionMarcaEliminados, setPaginacionMarcaEliminados] = useState({
    total: 0,
    totalPaginas: 1,
    paginaActual: 1,
    limite: MARCA_POR_PAGINA
  });  

  // GENERAL
  const [marca, setMarca] = useState({});

  // modal
  const [modalFormularioMarca, setModalFormularioMarca] = useState(false);

  const [alerta, setAlerta] = useState({});

  // funciones para crear config
  const generarConfig = () => {
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

  // obtener marcas activas
  const obtenerMarcas = async (paginaAConsultar, textoBusqueda) => {
    const config = generarConfig();
    if (!config) return;

    try {
      const url = `/marcas?pagina=${paginaAConsultar}&limite=${MARCA_POR_PAGINA}&busqueda=${encodeURIComponent(textoBusqueda)}`;

      const {data} = await clienteAxios(url, config);

      // si se elimina la ultima marca
      if (data.marcas.length === 0 && paginaAConsultar > 1 && data.paginacion.total > 0 ) {
        setPaginaMarca(paginaAConsultar - 1);
        return;
      }

      setMarcas(data.marcas); // las 5 marcas
      setPaginacionMarca(data.paginacion); // los datos de la paginacion

    } catch (error) {
      console.log(error.response?.data?.msg || error.message);
    }
  }


    // obtener marcas activas
  const obtenerMarcasEliminados = async (paginaAConsultar, textoBusqueda) => {
    const config = generarConfig();
    if (!config) return;

    try {
      const url = `/marcas/eliminados?pagina=${paginaAConsultar}&limite=${MARCA_POR_PAGINA}&busqueda=${encodeURIComponent(textoBusqueda)}`;

      const {data} = await clienteAxios(url, config);

      // si se elimina la ultima marca
      if (data.marcas.length === 0 && paginaAConsultar > 1 && data.paginacion.total > 0 ) {
        setPaginaMarcaEliminados(paginaAConsultar - 1);
        return;
      }

      setMarcasEliminados(data.marcas); // las 5 marcas
      setPaginacionMarcaEliminados(data.paginacion); // los datos de la paginacion

    } catch (error) {
      console.log(error.response?.data?.msg || error.message);
    }
  }

  // Llamados para obtener las marcas
  useEffect(() => {
    const cargar = async () => {
      await obtenerMarcas(paginaMarca, busquedaMarca)
    }

    cargar();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, paginaMarca, busquedaMarca]);

  // Llamados para obtener las marcas Eliminados
  useEffect(() => {
    const cargar = async () => {
      await obtenerMarcasEliminados(paginaMarcaEliminados, busquedaMarcaEliminados)
    }

    cargar();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, paginaMarcaEliminados, busquedaMarcaEliminados]);

  // busqueda de marcas activas
  const buscarMarca = texto => {
    setBusquedaMarca(texto);
    setPaginaMarca(1);
  }

  // Esta funcion esta conectada a listaMarca y esta conecta a toda la paginacion
  const cambiarPaginaMarca = numero => {
    setPaginaMarca(numero);
  }

  // lo mismo para la lista de marcas eliminadas
  const buscarMarcaEliminadas = texto => {
    setBusquedaMarcaEliminados(texto);
    setPaginaMarcaEliminados(1);
  }

  const cambiarPaginaMarcaEliminados = numero => {
    setPaginaMarcaEliminados(numero);
  }

  // Registrar o actualizar marcas
  const guardarMarca = async marcaAGuardar => {
    const config = generarConfig();
    if (!config) return;

    if (marcaAGuardar.id_marca) {
      // actualizar
      try {
        const url = `/marcas/${marcaAGuardar.id_marca}`;
        await clienteAxios.put(url, marcaAGuardar, config);
        await obtenerMarcas(paginaMarca, busquedaMarca);

        return {
          msg: "La marca se actualizo correctamente"
        };

      } catch (error) {
        const msg = error.response?.data?.msg || 'No se pudo actualizar la marca';
        console.log(msg);
        return {
            msg,
            error: true
        }
      }
    } else {
      try {
        // registrar
        const url = `/marcas`;
        await clienteAxios.post(url, marcaAGuardar, config);

        setBusquedaMarca('');
        setPaginaMarca(1);

        await obtenerMarcas(1, '');

        return {
          msg: 'La marca se registro correctamente'
        };

      } catch (error) {
        const msg = error.response?.data?.msg || 'No se pudo registrar la marca';
        console.log(msg);
        return {
            msg,
            error: true
        }        
      }
    }
  }

  // MODAL

  // Abre el modal en modo edicion
  const setEditarMarca = marcaSeleccionada => {
    setMarca(marcaSeleccionada );
    setModalFormularioMarca(true);
  }

  // abre el modal en modo nuevo crear
  const nuevaMarca = () => {
    setMarca({});
    setModalFormularioMarca(true);
  }

  // cerrar el modal y limpiar todo lo que hay en el formulario
  const cerrarModalFormularioMarca = () => {
    setModalFormularioMarca(false);
    setMarca({});
    setAlerta({});
  }

  // eliminar marca
  const setEliminarMarca = async id => {
    const confirmar = confirm('¿Confirma que desea eliminar la marca?');
    if (!confirmar) return;

    try {
      const config = generarConfig();
      if (!config) return;

      const url = `/marcas/eliminar/${id}`;
      const {data} = await clienteAxios.put(url, {}, config);

      await obtenerMarcas(paginaMarca, busquedaMarca);
      await obtenerMarcasEliminados(paginaMarcaEliminados, busquedaMarcaEliminados);

      return {
        msg: data.msg
      };

    } catch (error) {
      return {
        msg: error.response?.data?.msg || 'No se pudo eliminar la Marca',
        error: true
      };   
    }
  }

  // Activar marca
  const setActivarMarca = async id => {
    const confirmar = confirm('¿Desea activar esta marca?');

    if (!confirmar) return;

    try {
      const config = generarConfig();
      if (!config) return;

      const url = `/marcas/${id}`;
      const {data} = await clienteAxios.patch(url, {}, config);

      // se actualizan las dos listas: la marca desaparece de "eliminados"
      // y tiene que aparecer de nuevo en la lista de activas
      await obtenerMarcasEliminados(paginaMarcaEliminados, busquedaMarcaEliminados);
      await obtenerMarcas(paginaMarca, busquedaMarca);

      return {
        msg: data.msg
      };

    } catch (error) {
      console.log(error);
      return {
          msg: error.response?.data?.msg || 'No se pudo activar la marca',
          error: true
      };
    }
  }

  return (
    <>
      <MarcaContext.Provider
        value={{
            marcas,
            paginacionMarca,
            busquedaMarca,
            buscarMarca,
            cambiarPaginaMarca,

            marcasEliminados,
            paginacionMarcaEliminados,
            busquedaMarcaEliminados,
            buscarMarcaEliminadas,
            cambiarPaginaMarcaEliminados,

            guardarMarca,
            setEditarMarca,
            nuevaMarca,
            modalFormularioMarca,
            cerrarModalFormularioMarca,
            marca,

            setEliminarMarca,
            setActivarMarca,

            alerta,
            setAlerta
        }}
      >
        {children}
      </MarcaContext.Provider>
    </>
  )
}

export {MarcaProvider};
export default MarcaContext;
