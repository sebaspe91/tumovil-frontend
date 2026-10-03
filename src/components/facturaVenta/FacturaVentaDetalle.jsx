import useFacturaVenta from "../../hook/useFacturaVenta";

// detalle de UNA factura, dentro de un modal. No pide nada nuevo al
// backend: usa directamente el objeto que ya esta cargado en "facturas"
// (facturaSeleccionada), igual que ProductoDetalle.jsx usa productoMostrar.
function FacturaVentaDetalle() {
    const { facturaSeleccionada: factura, descargarPDF } = useFacturaVenta();

    if (!factura) return null;

    const {
        id_fact_cli,
        fecha_fc,
        cliente,
        usuario,
        detalles
    } = factura;

    const total = detalles.reduce((acumulado, detalle) => acumulado + (detalle.cantidad_dc_venta * detalle.precio_dc_venta), 0);

    const fechaFormateada = fecha_fc
        ? new Date(fecha_fc).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'N/A';

    return (
        <div className="flex flex-col gap-6">

            {/* datos principales de la factura */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-gray-50 border border-gray-100 rounded-xl p-5">
                <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Factura N°</p>
                    <p className="font-semibold text-primary-700">{id_fact_cli}</p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Fecha</p>
                    <p className="font-semibold text-primary-700">{fechaFormateada}</p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Cliente</p>
                    <p className="font-semibold text-primary-700">{cliente?.nombre_cliente} {cliente?.apellido_cliente}</p>
                    <p className="text-sm text-gray-500">{cliente?.cedula_cliente}</p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Vendedor</p>
                    <p className="font-semibold text-primary-700">{usuario?.nombre_user} {usuario?.apellido_user}</p>
                </div>
            </div>

            {/* tabla de productos vendidos */}
            <div>
                <p className="text-xs font-bold uppercase text-gray-400 mb-2">Productos</p>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                    <div className="hidden sm:grid sm:grid-cols-[2fr_0.7fr_0.8fr_0.8fr] gap-3 bg-gray-50 text-xs font-bold uppercase text-gray-500 px-4 py-2">
                        <span>Producto</span>
                        <span className="text-center">Cantidad</span>
                        <span className="text-right">Precio</span>
                        <span className="text-right">Subtotal</span>
                    </div>
                    {detalles.map((detalle, indice) => (
                        <div key={indice} className="flex flex-col sm:grid sm:grid-cols-[2fr_0.7fr_0.8fr_0.8fr] gap-1 sm:gap-3 px-4 py-3 text-sm">
                            <span className="font-semibold text-primary-700">{detalle.producto?.nombre_prod}</span>
                            <span className="sm:text-center">{detalle.cantidad_dc_venta}</span>
                            <span className="sm:text-right">$ {Number(detalle.precio_dc_venta).toLocaleString('es-CO')}</span>
                            <span className="sm:text-right font-semibold">$ {(detalle.cantidad_dc_venta * detalle.precio_dc_venta).toLocaleString('es-CO')}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* total */}
            <div className="flex items-center justify-between bg-primary-700 text-white rounded-xl px-5 py-4">
                <span className="font-bold uppercase text-sm">Total</span>
                <span className="font-black text-xl">$ {total.toLocaleString('es-CO')}</span>
            </div>

            <button
                type="button"
                onClick={() => descargarPDF(id_fact_cli)}
                className="bg-gray-700 text-white uppercase font-bold px-6 py-3 rounded-xl hover:bg-gray-800 self-center"
            >
                Descargar PDF
            </button>

        </div>
    )
}

export default FacturaVentaDetalle;
