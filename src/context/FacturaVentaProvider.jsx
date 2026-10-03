import { createContext, useState, useEffect } from "react";
import useAuth from "../hook/useAuth";
import clienteAxios from "../config/axios";

const FacturaVentaContext = createContext();

const FacturaVentaProvider = ({children}) => {

    // usuario autenticado
    const {auth} = useAuth();

    // OJO: antes aca se usaba useEmpresa() para mandar "empresa_fc_id" al
    // crear una factura. Se saco: GET /empresa es SOLO PARA ADMIN, asi que
    // un VENDEDOR nunca conseguia ese dato y la factura fallaba con "Debe
    // indicar cliente, empresa y al menos un producto". Ahora el backend
    // (registrarFacturaCliente) averigua la empresa el solo -- ver el
    // comentario en facturaClienteController.js

    // facturas activas. OJO: a diferencia de Productos/Clientes, el backend
    // de facturas NO pagina ni filtra por texto -- "listaFacturaCliente"
    // siempre trae TODAS las facturas activas de una vez.
    const [facturas, setFacturas] = useState([]);

    // facturas eliminadas (se piden solo cuando se abre ese modal, no apenas
    // se entra a la pagina)
    const [facturasEliminadas, setFacturasEliminadas] = useState([]);

    // la factura que se esta viendo en el modal de detalle
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);

    // modales (la de "nueva factura" ya no es un modal -- ahora /factura-venta
    // es una pagina dedicada solo a eso, ver AmdinFacturaVenta.jsx)
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

    // traer las facturas activas
    const obtenerFacturas = async () => {
        const config = generarConfig();
        if (!config) return;

        try {
            const {data} = await clienteAxios('/factura-cliente', config);
            setFacturas(data.listaFacturaCliente);
        } catch (error) {
            console.log(error.response?.data?.msg || error.message);
        }
    }

    // traer las facturas eliminadas
    const obtenerFacturasEliminadas = async () => {
        const config = generarConfig();
        if (!config) return;

        try {
            const {data} = await clienteAxios('/factura-cliente/eliminados', config);
            setFacturasEliminadas(data.listaFacturaClienteEliminadas);
        } catch (error) {
            console.log(error.response?.data?.msg || error.message);
        }
    }

    // traer las facturas activas apenas hay sesion iniciada
    useEffect(() => {
        const cargar = async () => {
            await obtenerFacturas();
        }
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth]);

    // registrar una factura nueva. "datos" = { cliente_id, productos: [{producto_dc_id, cantidad_dc_venta}, ...] }
    const guardarFactura = async datos => {
        const config = generarConfig();
        if (!config) return;

        try {
            const payload = {
                cliente_id: datos.cliente_id,
                productos: datos.productos
                // ya no se manda "empresa_fc_id": el backend la averigua solo
            };

            const {data} = await clienteAxios.post('/factura-cliente', payload, config);

            await obtenerFacturas();

            return {
                msg: 'La factura se registro correctamente',
                // id de la factura recien creada -- se usa para descargar
                // el PDF apenas se guarda, sin tener que ir a buscarla
                facturaId: data.factura?.id_fact_cli
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

    // eliminar (soft delete): el backend devuelve el stock de cada producto
    const eliminarFactura = async id => {
        const confirmar = confirm('¿Confirma que desea eliminar esta factura? El stock de los productos se devolvera.');
        if (!confirmar) return;

        try {
            const config = generarConfig();
            if (!config) return;

            const url = `/factura-cliente/eliminar/${id}`;
            const {data} = await clienteAxios.put(url, {}, config);

            await obtenerFacturas();
            await obtenerFacturasEliminadas();

            return { msg: data.msg };

        } catch (error) {
            return {
                msg: error.response?.data?.msg || 'No se pudo eliminar la factura',
                error: true
            };
        }
    }

    // reactivar una factura eliminada: el backend vuelve a descontar el
    // stock, validando primero que alcance para TODOS los productos
    const reactivarFactura = async id => {
        const confirmar = confirm('¿Desea reactivar esta factura? Se volvera a descontar el stock de los productos.');
        if (!confirmar) return;

        try {
            const config = generarConfig();
            if (!config) return;

            const url = `/factura-cliente/${id}`;
            const {data} = await clienteAxios.patch(url, {}, config);

            await obtenerFacturasEliminadas();
            await obtenerFacturas();

            return { msg: data.msg };

        } catch (error) {
            return {
                msg: error.response?.data?.msg || 'No se pudo reactivar la factura',
                error: true
            };
        }
    }

    // descargar el PDF de una factura. El backend no manda JSON aca, manda
    // el archivo en binario -- por eso "responseType: blob" (le avisa a
    // axios que no intente leerlo como texto/JSON).
    const descargarPDF = async id => {
        try {
            const config = generarConfig();
            if (!config) return;

            const respuesta = await clienteAxios.get(`/factura-cliente/factura-pdf/${id}`, {
                ...config,
                responseType: 'blob'
            });

            // truco para forzar la descarga: se crea una URL temporal que
            // apunta al archivo recibido, y se le hace "click" a un link
            // invisible que apunta a esa URL
            const url = window.URL.createObjectURL(new Blob([respuesta.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `recibo_${id}.pdf`);
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
        <FacturaVentaContext.Provider
            value={{
                facturas,
                facturasEliminadas,
                obtenerFacturasEliminadas,

                facturaSeleccionada,

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
        </FacturaVentaContext.Provider>
    )
}

export {
    FacturaVentaProvider
}

export default FacturaVentaContext;
