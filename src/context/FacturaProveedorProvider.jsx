import { createContext, useState, useEffect } from "react";
import useAuth from "../hook/useAuth";
import clienteAxios from "../config/axios";

const FacturaProveedorContext = createContext();

// filtros
const FILTROS_VACIOS = {busqueda: '', desde: '', hasta: ''};

// paginacion incial
const PAGINACION_VACIA = { total: 0, totalPaginas: 0, paginaActual: 1, limite: 5 };


// armar parametros: convierte filtros + nuemro de pagina en el texto que va despues del ? de la url
const armarParametros = (filtros, pagina) => {
    // instanciamos para agregar parametros a la URL
    const params = new URLSearchParams();

    params.set('pagina', pagina); // agregamos el parametro

    // solo se envia el filtro solicitado
    const busqueda = filtros.busqueda.trim();
    if (busqueda) params.set('busqueda', busqueda);

    // tratamos la fecha para coincida con la de la base de datos y mili segundos
    if (filtros.desde) {
        // parametro fecha desde => 12:00:00 am del dia
        params.set('desde', new Date(`${filtros.desde}T00:00:00`).toISOString()); 
    }
    if (filtros.hasta) {
        // ultimo milisegundo del dia. OJO: los milisegundos van despues de un PUNTO
        // (59.999). Con dos puntos (59:999) la fecha es invalida y toISOString() revienta
        params.set('hasta', new Date(`${filtros.hasta}T23:59:59.999`).toISOString());
    }

    return params.toString();
}




// El backend, cuando rechaza eliminar/reactivar por stock, responde asi:
//   { msg: 'No se puede eliminar la factura', errores: ['No se puede quitar el stock de "X"...'] }
// Esta funcion junta el mensaje general con cada error de la lista para que el
// usuario vea el MOTIVO y no solo "No se puede eliminar la factura".
const armarMensajeError = (error, mensajePorDefecto) => {
    const msg = error.response?.data?.msg || mensajePorDefecto;
    const errores = error.response?.data?.errores;
    return Array.isArray(errores) && errores.length > 0
        ? `${msg}: ${errores.join(' | ')}`
        : msg;
}

// Funcion principal de elementos
const FacturaProveedorProvider = ({children}) => {

    // usuario autenticado
    const {auth} = useAuth();

    // Facturas Activas proveedor

    const [facturas, setFacturas] = useState([]);
    const [paginacionFactura, setPaginacionFactura] = useState(PAGINACION_VACIA);
    const [filtrosFactura, setFiltrosFactura] = useState(FILTROS_VACIOS); // siguiente pagina filtra igual

    // --- Facturas ELIMINADAS
    const [facturasEliminadas, setFacturasEliminadas] = useState([]);
    const [paginacionFacturaEliminada, setPaginacionFacturaEliminada] = useState(PAGINACION_VACIA);    
    const [filtrosFacturaEliminada, setFiltrosFacturaEliminada] = useState(FILTROS_VACIOS);

    // la factura que se esta viendo en el modal de detalle
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

    // modales
    const [modalDetalle, setModalDetalle] = useState(false);
    const [modalEliminadas, setModalEliminadas] = useState(false);

    const [alerta, setAlerta] = useState({});

    // mismo patron de siempre para armar los headers con el token
    const generarConfig = () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        return {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    }

    // Obtener las facturas activas al backend
    const obtenerFacturas = async (pagina = 1, filtros = filtrosFactura) => {
        const config = generarConfig();
        if (!config) return;

        try {
            const parametrosURL = armarParametros(filtros, pagina);
            const url = `/factura-proveedor?${parametrosURL}`;
            const {data} = await clienteAxios(url, config);

            // eliminar paginacion si elimina producto final
            if (data.listaFacturaProveedor.length === 0 && pagina > 1) {
                return obtenerFacturas(pagina - 1, filtros);
            }

            // agregamos la lista para exportar
            setFacturas(data.listaFacturaProveedor);
            setPaginacionFactura(data.paginacion);

        } catch (error) {
            console.log(error.response?.data?.msg || error.message);
        }
    }

    // buscar: devuelve siempre a la pagina 1
    const buscarFactura = async filtros => {
        setFiltrosFactura(filtros);
        await obtenerFacturas(1, filtros);
    }

    // cambiara pagina para facturas activadas
    const cambiarPaginaFactura = async pagina => {
        await obtenerFacturas(pagina, filtrosFactura);
    }

    // Facturas Eliminadas
    const obtenerFacturasEliminadas = async (pagina = 1, filtros = filtrosFacturaEliminada) => {
        const config = generarConfig();
        if (!config) return;

        try {
            const parametrosURL = armarParametros(filtros, pagina);
            const url = `/factura-proveedor/eliminados?${parametrosURL}`;
            const {data} = await clienteAxios(url, config);

            // eliminar paginacion si elimina producto final
            if (data.listaFacturaProveedorEliminadas.length === 0 && pagina > 1) {
                return obtenerFacturasEliminadas(pagina - 1, filtros);
            }

            // agregamos la lista para exportar
            setFacturasEliminadas(data.listaFacturaProveedorEliminadas);
            setPaginacionFacturaEliminada(data.paginacion);

        } catch (error) {
            console.log(error.response?.data?.msg || error.message);
        }
    }

    // buscar las facturas eliminadas
    const buscarFacturaEliminada = async (filtros) => {
        setFiltrosFacturaEliminada(filtros);
        await obtenerFacturasEliminadas(1, filtros);
    }

    const cambiarPaginaFacturaEliminada = async (pagina) => {
        await obtenerFacturasEliminadas(pagina, filtrosFacturaEliminada);
    }

    // traer la primera pagina de facturas activas apenas hay sesion iniciada
    useEffect(() => {
        const cargar = async () => {
            await obtenerFacturas();
        }
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth]);

    // Acciones sobre una factura

    // registrar
    const guardarFactura = async datos => {
        const config = generarConfig();
        if (!config) return;
        try {
            const payload = {
                proveedor_id: datos.proveedor_id,
                productos: datos.productos
            };

            const {data} = await clienteAxios.post('/factura-proveedor', payload, config);

            return {
                msg: 'La factura se registro correctamente',
                // id de la factura recien creada -- se usa para descargar
                // el PDF apenas se guarda, sin tener que ir a buscarla
                facturaId: data.factura?.id_fact_prov 
            };

        } catch (error) {
            const msg = error.response?.data?.msg || 'No se pudo registrar la factura';
            console.log(msg);
            return {
                msg,
                error: true
            }
        }
    }


    // eliminar (soft delete): el backend quita el stock de cada producto validando primero que alcance para TODOS
    const eliminarFactura = async id => {

        // validar que se admin
        if (auth.tipo_user !== 'ADMIN') {
            setAlerta({
                msg: 'No tiene permisos para esta accion',
                error: true
            });
            return;
        }

        const confirmar = confirm('¿Confirma que desea eliminar esta factura? Se descontara del stock lo que esta compra habia sumado.');
        if (!confirmar) return;

        try {
            const config = generarConfig();
            if (!config) return;

            const url = `/factura-proveedor/eliminar/${id}`;
            const {data} = await clienteAxios.put(url, {}, config);

            // refrescar AMBAS listas quedandonos en la misma pagina 
            await obtenerFacturas(paginacionFactura.paginaActual);
            await obtenerFacturasEliminadas(paginacionFacturaEliminada.paginaActual);

            // avisar en pantalla que salio bien (la pagina de historial muestra "alerta")
            setAlerta({ msg: data.msg });

            return { msg: data.msg };

        } catch (error) {
            // avisar en pantalla el MOTIVO (ej. "parte de esa mercancia ya se vendio")
            const msg = armarMensajeError(error, 'No se pudo eliminar la factura');
            setAlerta({ msg, error: true });

            return { msg, error: true };
        }
    }

    // reactivar una factura eliminada: el backend vuelve a SUMAR al stock lo que
    // la compra habia traido
    const reactivarFactura = async id => {

        // validar que sea admin (el backend tambien lo valida)
        if (auth.tipo_user !== 'ADMIN') {
            setAlerta({
                msg: 'No tiene permisos para esta accion',
                error: true
            });
            return;
        }

        const confirmar = confirm('¿Desea reactivar esta factura? Se volvera a sumar al stock lo que esta compra trae.');
        if (!confirmar) return;

        try {
            const config = generarConfig();
            if (!config) return;

            const url = `/factura-proveedor/${id}`;
            const {data} = await clienteAxios.patch(url, {}, config);

            await obtenerFacturasEliminadas(paginacionFacturaEliminada.paginaActual);
            await obtenerFacturas(paginacionFactura.paginaActual);

            setAlerta({ msg: data.msg });

            return { msg: data.msg };

        } catch (error) {
            const msg = armarMensajeError(error, 'No se pudo reactivar la factura');
            setAlerta({ msg, error: true });

            return { msg, error: true };
        }
    }


    // vuelve a pedir lo que se esta viendo (misma pagina, mismos filtros). Lo usa
    // el historial cuando la pestana vuelve a estar visible (useRefrescarAlVolver),
    // para que una factura creada en otra pestana aparezca sin recargar a mano
    const refrescarFacturas = async () => {
        await obtenerFacturas(paginacionFactura.paginaActual);

        // las eliminadas solo se piden si su modal esta abierto
        if (modalEliminadas) {
            await obtenerFacturasEliminadas(paginacionFacturaEliminada.paginaActual);
        }
    }

    // descargar el PDF de una factura. El backend no manda JSON aca, manda
    // el archivo en binario -- por eso "responseType: blob" (le avisa a
    // axios que no intente leerlo como texto/JSON).
    const descargarPDF = async id => {
        try {
            const config = generarConfig();
            if (!config) return;

            const respuesta = await clienteAxios.get(`/factura-proveedor/factura-pdf/${id}`, {
                ...config,
                responseType: 'blob'
            });

            // truco para forzar la descarga: se crea una URL temporal que
            // apunta al archivo recibido, y se le hace "click" a un link
            // invisible que apunta a esa URL
            const url = window.URL.createObjectURL(new Blob([respuesta.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `recibo_compra_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.log(error);
            setAlerta({ msg: 'No se pudo descargar el PDF', error: true });
        }
    }

    // MODAL: ver el detalle de una factura (no pide nada al backend, usa
    // directamente el objeto que ya esta cargado en "facturas")
    const verFactura = factura => {
        setFacturaSeleccionada(factura);
        setModalDetalle(true);
    }

    const cerrarModalDetalle = () => {
        setModalDetalle(false);
        setFacturaSeleccionada(null);
    }

    return (
        <FacturaProveedorContext.Provider
            value={{
                // lista activa + filtros + paginacion
                facturas,
                paginacionFactura,
                filtrosFactura,
                buscarFactura,
                cambiarPaginaFactura,

                // lista eliminada + filtros + paginacion
                facturasEliminadas,
                paginacionFacturaEliminada,
                filtrosFacturaEliminada,
                buscarFacturaEliminada,
                cambiarPaginaFacturaEliminada,

                facturaSeleccionada,

                refrescarFacturas,

                guardarFactura,
                eliminarFactura,
                reactivarFactura,
                descargarPDF,

                modalDetalle,
                verFactura,
                cerrarModalDetalle,

                modalEliminadas,
                setModalEliminadas,

                alerta,
                setAlerta
            }}
        >
            {children}
        </FacturaProveedorContext.Provider>
    )
}


export default FacturaProveedorContext;
export {FacturaProveedorProvider};