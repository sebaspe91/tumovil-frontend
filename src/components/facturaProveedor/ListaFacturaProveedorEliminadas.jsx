import { useEffect } from "react";
import useFacturaProveedor from "../../hook/useFacturaProveedor";
import FacturaProveedor from "./FacturaProveedor";
import FiltrosFactura from "../facturaVenta/FiltrosFactura";
import Alerta from "../Alerta";
import Paginacion from "../Paginacion";

// Lista de facturas de compra ELIMINADAS (se muestra dentro de un modal).
// Misma idea que ListaFacturaProveedor, pero con el estado "Eliminada" del Provider.
function ListaFacturaProveedorEliminadas() {
    const {
        facturasEliminadas,
        paginacionFacturaEliminada,
        filtrosFacturaEliminada,
        buscarFacturaEliminada,
        cambiarPaginaFacturaEliminada,
        alerta
    } = useFacturaProveedor();

    // Se piden apenas se monta este componente -- y como solo se monta mientras el modal
    // esta abierto, es lo mismo que decir "se piden apenas se abre el modal".
    // Se usa buscarFacturaEliminada con filtros vacios (y no solo "obtener") para que, si
    // el modal se cerro con un filtro puesto, al abrirlo de nuevo las casillas (que
    // arrancan vacias) y la lista coincidan.
    useEffect(() => {
        buscarFacturaEliminada({ busqueda: '', desde: '', hasta: '' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hayFiltrosActivos = Object.values(filtrosFacturaEliminada).some(valor => valor !== '');

  return (
    <>
        <h2 className="font-black text-3xl text-center">Facturas de Compra Eliminadas</h2>

        <p className="text-xl mt-5 mb-6 text-center">
        Recupera tus {' '}
        <span className="text-primary-600 font-bold">Facturas</span>
        </p>

        {/* mensajes de eliminar/reactivar (ej. "no se puede reactivar...") tienen que verse
            AQUI: la alerta de la pagina queda tapada por el modal */}
        {alerta?.msg && <Alerta alerta={alerta} />}

        {/* casillas de filtro: proveedor + fechas de la factura */}
        <FiltrosFactura
            onBuscar={buscarFacturaEliminada}
            etiquetaBusqueda="Proveedor"
            placeholderBusqueda="Buscar por nombre, nit o correo del proveedor"
        />

        {facturasEliminadas.length > 0 && (
            <div className="hidden lg:grid lg:grid-cols-[100px_1.6fr_1.2fr_80px_1fr_150px] gap-4 items-center
                bg-primary-700 text-white text-xs font-bold uppercase px-5 py-3 rounded-t-xl mx-5">
                <span className="text-left">Fecha</span>
                <span className="text-left">Proveedor</span>
                <span className="text-left">Registrado por</span>
                <span className="text-left">Items</span>
                <span className="text-left">Total</span>
                <span className="text-right">Acciones</span>
            </div>
        )}

        {facturasEliminadas.length ? (
            <div className="lg:border lg:border-t-0 lg:border-gray-200 lg:rounded-b-xl lg:overflow-hidden">
                {facturasEliminadas.map(factura => (
                    <FacturaProveedor key={factura.id_fact_prov} factura={factura} eliminada />
                ))}
            </div>
        ):(
            <p className="text-xl mt-5 mb-10 text-center">
                {hayFiltrosActivos
                    ? <>No se encontraron facturas eliminadas con los filtros aplicados</>
                    : <>No hay facturas de compra eliminadas</>
                }
            </p>
        )}

        <Paginacion paginacion={paginacionFacturaEliminada} onCambiarPagina={cambiarPaginaFacturaEliminada} />
    </>
  )
}

export default ListaFacturaProveedorEliminadas;
