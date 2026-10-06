import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import useFacturaProveedor from "../../hook/useFacturaProveedor";
import FacturaProveedor from "./FacturaProveedor";
import FiltrosFactura from "../facturaVenta/FiltrosFactura";
import Paginacion from "../Paginacion";

// Lista del HISTORIAL de facturas de compra ACTIVAS.
// No filtra ni corta nada en el navegador: el backend ya entrega la pagina actual,
// filtrada por proveedor y por fechas (ver consultarFacturasPaginadas en el backend).
function ListaFacturaProveedor() {
    // PASO 1 -- datos y funciones que vienen del Provider
    const {
        facturas,              // las facturas de la pagina actual
        paginacionFactura,     // { total, totalPaginas, paginaActual, limite }
        filtrosFactura,        // filtros aplicados ahora mismo { busqueda, desde, hasta }
        buscarFactura,         // pide la pagina 1 con filtros nuevos
        cambiarPaginaFactura   // pide otra pagina manteniendo los filtros
    } = useFacturaProveedor();

    // PASO 2 -- ¿hay algun filtro aplicado? Object.values(...) = ['juan', '', ''] y
    // .some(...) da true si AL MENOS UNO no esta vacio. Sirve para tres cosas: el puntito
    // del boton, abrir el panel si ya hay una busqueda, y el mensaje de "sin resultados".
    const hayFiltrosActivos = Object.values(filtrosFactura).some(valor => valor !== '');

    // el panel de filtros se puede ocultar (ocupa mucho espacio); si el usuario entra
    // con una busqueda ya aplicada, se deja abierto para que la vea
    const [mostrarFiltros, setMostrarFiltros] = useState(() => hayFiltrosActivos);

  return (
    <>
        {/* PASO 3 -- boton para mostrar/ocultar el panel de filtros */}
        <div className="max-w-3xl mx-auto mb-4 flex justify-center">
            <button
                type="button"
                onClick={() => setMostrarFiltros(anterior => !anterior)}
                className="relative flex items-center gap-2 border-2 border-primary-600 text-primary-700 font-bold uppercase text-sm px-5 py-2 rounded-xl hover:bg-primary-50"
            >
                <FaFilter />
                {mostrarFiltros ? 'Ocultar filtros' : 'Mostrar filtros'}

                {/* puntito que avisa "tienes un filtro aplicado" cuando el panel esta cerrado */}
                {hayFiltrosActivos && !mostrarFiltros && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-600 rounded-full border-2 border-white"></span>
                )}
            </button>
        </div>

        {/* PASO 4 -- casillas de filtro: al pulsar Buscar llaman a buscarFactura.
            OJO: el panel se OCULTA con la clase "hidden" (display: none), NO con
            "{mostrarFiltros && <FiltrosFactura />}". Eso ultimo DESMONTA el componente y
            se pierde lo escrito en las casillas; con "hidden" sigue montado y conserva su texto. */}
        <div className={mostrarFiltros ? '' : 'hidden'}>
            <FiltrosFactura
                onBuscar={buscarFactura}
                etiquetaBusqueda="Proveedor"
                placeholderBusqueda="Buscar por nombre, nit o correo del proveedor"
            />
        </div>

        {/* PASO 5 -- encabezado de la tabla (solo en pantallas grandes y si hay filas) */}
        {facturas.length > 0 && (
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

        {/* PASO 6 -- las filas, o un mensaje si no hay nada */}
        {facturas.length ? (
            <div className="lg:border lg:border-t-0 lg:border-gray-200 lg:rounded-b-xl lg:overflow-hidden">
                {facturas.map(factura => (
                    <FacturaProveedor key={factura.id_fact_prov} factura={factura} />
                ))}
            </div>
        ):(
            <p className="text-xl mt-5 mb-10 text-center">
                {hayFiltrosActivos
                    ? <>No se encontraron facturas con los filtros aplicados</>
                    : <>No hay facturas de compra registradas</>
                }
            </p>
        )}

        {/* PASO 7 -- botones Anterior / Siguiente (se ocultan solos si hay 1 sola pagina) */}
        <Paginacion paginacion={paginacionFactura} onCambiarPagina={cambiarPaginaFactura} />
    </>
  )
}

export default ListaFacturaProveedor;
