import useFacturaProveedor from "../../hook/useFacturaProveedor";

// Detalle de UNA factura de compra, dentro de un modal. No pide nada nuevo al backend:
// usa directamente el objeto que ya esta cargado en la lista (facturaSeleccionada),
// que se guardo cuando el usuario hizo click en el ojito (verFactura).
function FacturaProveedorDetalle() {
    const { facturaSeleccionada: factura, descargarPDF } = useFacturaProveedor();

    // por seguridad: si por algun motivo no hay factura, no se dibuja nada
    if (!factura) return null;

    const {
        id_fact_prov,
        fecha_fp,
        proveedor,
        usuario,
        detalles
    } = factura;

    const total = detalles.reduce((acumulado, detalle) => acumulado + (detalle.cantidad_dp_compra * detalle.precio_dp_compra), 0);

    // fecha larga: 05 de octubre de 2026
    const fechaFormateada = fecha_fp
        ? new Date(fecha_fp).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'N/A';

    return (
        <div className="flex flex-col gap-6">

            {/* datos principales de la factura */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-gray-50 border border-gray-100 rounded-xl p-5">
                <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Factura N°</p>
                    <p className="font-semibold text-primary-700">{id_fact_prov}</p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Fecha</p>
                    <p className="font-semibold text-primary-700">{fechaFormateada}</p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Proveedor</p>
                    <p className="font-semibold text-primary-700">{proveedor?.nombre_prov}</p>
                    <p className="text-sm text-gray-500">NIT {proveedor?.nit_prov}</p>
                    <p className="text-sm text-gray-500">{proveedor?.correo_prov}</p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Registrado por</p>
                    <p className="font-semibold text-primary-700">{usuario?.nombre_user} {usuario?.apellido_user}</p>
                </div>
            </div>

            {/* tabla de productos comprados */}
            <div>
                <p className="text-xs font-bold uppercase text-gray-400 mb-2">Productos</p>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                    <div className="hidden sm:grid sm:grid-cols-[2fr_0.7fr_0.8fr_0.8fr] gap-3 bg-gray-50 text-xs font-bold uppercase text-gray-500 px-4 py-2">
                        <span>Producto</span>
                        <span className="text-center">Cantidad</span>
                        <span className="text-right">Precio compra</span>
                        <span className="text-right">Subtotal</span>
                    </div>
                    {detalles.map((detalle, indice) => (
                        <div key={indice} className="flex flex-col sm:grid sm:grid-cols-[2fr_0.7fr_0.8fr_0.8fr] gap-1 sm:gap-3 px-4 py-3 text-sm">
                            <span className="font-semibold text-primary-700">{detalle.producto?.nombre_prod}</span>
                            <span className="sm:text-center">{detalle.cantidad_dp_compra}</span>
                            <span className="sm:text-right">$ {Number(detalle.precio_dp_compra).toLocaleString('es-CO')}</span>
                            <span className="sm:text-right font-semibold">$ {(detalle.cantidad_dp_compra * detalle.precio_dp_compra).toLocaleString('es-CO')}</span>
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
                onClick={() => descargarPDF(id_fact_prov)}
                className="bg-gray-700 text-white uppercase font-bold px-6 py-3 rounded-xl hover:bg-gray-800 self-center"
            >
                Descargar PDF
            </button>

        </div>
    )
}

export default FacturaProveedorDetalle;
