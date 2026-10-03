import { FaEye, FaFilePdf, FaTrashAlt, FaCheckCircle } from 'react-icons/fa';
import useAuth from '../../hook/useAuth';
import useFacturaVenta from '../../hook/useFacturaVenta';

// una fila/tarjeta de factura. "eliminada" cambia que boton de accion se
// muestra (Eliminar vs Reactivar) -- mismo truco que ya usamos reutilizando
// Producto.jsx y Marca.jsx entre la lista activa y la de eliminados.
function FacturaVenta({ factura, eliminada = false }) {
    const { auth } = useAuth();
    const { verFactura, eliminarFactura, reactivarFactura, descargarPDF } = useFacturaVenta();

    const {
        id_fact_cli,
        fecha_fc,
        cliente,
        usuario,
        detalles
    } = factura;

    // Eliminar/Reactivar son acciones solo para ADMIN (el backend tambien
    // las bloquea con un 403, esto es solo para no mostrar un boton que de
    // todas formas el servidor va a rechazar)
    const esAdmin = auth?.tipo_user === 'ADMIN';

    // el backend no manda el total ya calculado, lo sumamos aca mismo
    const total = detalles.reduce((acumulado, detalle) => acumulado + (detalle.cantidad_dc_venta * detalle.precio_dc_venta), 0);

    const fechaFormateada = fecha_fc
        ? new Date(fecha_fc).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : 'N/A';

  return (
    <div
      className='flex flex-col lg:grid lg:grid-cols-[100px_1.6fr_1.2fr_80px_1fr_150px] gap-3 lg:gap-4 lg:items-center mx-5 my-4 lg:my-0 bg-white shadow-md lg:shadow-none p-5 lg:p-0 rounded-xl lg:rounded-none lg:border-b lg:border-gray-100 lg:px-5 lg:py-3 lg:hover:bg-gray-50 lg:transition-colors text-primary-700'
    >
        <p className="lg:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 lg:hidden">Fecha: </span>
            {fechaFormateada}
        </p>

        <p className="lg:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 lg:hidden">Cliente: </span>
            <span className="font-semibold">{cliente?.nombre_cliente} {cliente?.apellido_cliente}</span>
        </p>

        <p className="lg:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 lg:hidden">Vendedor: </span>
            {usuario?.nombre_user} {usuario?.apellido_user}
        </p>

        <p className="lg:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 lg:hidden">Items: </span>
            {detalles.length}
        </p>

        <p className="lg:min-w-0 font-bold">
            <span className="font-bold uppercase text-xs text-gray-500 lg:hidden">Total: </span>
            $ {total.toLocaleString('es-CO')}
        </p>

        <div className="flex lg:justify-end gap-2 mt-1 lg:mt-0">
            <button
                type="button"
                title="Ver detalle"
                onClick={() => verFactura(factura)}
                className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-md transition-colors"
            >
                <FaEye />
            </button>

            <button
                type="button"
                title="Descargar PDF"
                onClick={() => descargarPDF(id_fact_cli)}
                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-md transition-colors"
            >
                <FaFilePdf />
            </button>

            {esAdmin && !eliminada && (
                <button
                    type="button"
                    title="Eliminar"
                    onClick={() => eliminarFactura(id_fact_cli)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                >
                    <FaTrashAlt />
                </button>
            )}

            {esAdmin && eliminada && (
                <button
                    type="button"
                    title="Reactivar"
                    onClick={() => reactivarFactura(id_fact_cli)}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition-colors"
                >
                    <FaCheckCircle />
                </button>
            )}
        </div>
    </div>
  )
}

export default FacturaVenta;
