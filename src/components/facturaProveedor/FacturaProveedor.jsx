import { FaEye, FaFilePdf, FaTrashAlt, FaCheckCircle } from 'react-icons/fa';
import useAuth from '../../hook/useAuth';
import useFacturaProveedor from '../../hook/useFacturaProveedor';

// Una fila (en pantallas grandes) o tarjeta (en celular) de una factura de compra.
// "eliminada" cambia el boton de accion: Eliminar (lista activa) o Reactivar
// (lista de eliminadas). Es el mismo truco que FacturaVenta.jsx.
function FacturaProveedor({ factura, eliminada = false }) {
    const { auth } = useAuth();
    const { verFactura, eliminarFactura, reactivarFactura, descargarPDF } = useFacturaProveedor();

    // PASO 1 -- sacamos del objeto "factura" solo lo que se va a mostrar
    const {
        id_fact_prov,
        fecha_fp,
        proveedor,
        usuario,
        detalles
    } = factura;

    // PASO 2 -- Eliminar/Reactivar son solo para ADMIN (el backend tambien lo bloquea con
    // un 403; esto es para no mostrar un boton que el servidor igual va a rechazar)
    const esAdmin = auth?.tipo_user === 'ADMIN';

    // PASO 3 -- el backend no manda el total ya calculado: se suma aca (cantidad x precio)
    const total = detalles.reduce((acumulado, detalle) => acumulado + (detalle.cantidad_dp_compra * detalle.precio_dp_compra), 0);

    // PASO 4 -- fecha legible: 05/10/2026
    const fechaFormateada = fecha_fp
        ? new Date(fecha_fp).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : 'N/A';

  return (
    // En celular es una tarjeta (flex en columna); desde "lg" es una fila de tabla (grid con 6
    // columnas). Las columnas deben ser IGUALES a las del encabezado de la lista.
    <div
      className='flex flex-col lg:grid lg:grid-cols-[100px_1.6fr_1.2fr_80px_1fr_150px] gap-3 lg:gap-4 lg:items-center mx-5 my-4 lg:my-0 bg-white shadow-md lg:shadow-none p-5 lg:p-0 rounded-xl lg:rounded-none lg:border-b lg:border-gray-100 lg:px-5 lg:py-3 lg:hover:bg-gray-50 lg:transition-colors text-primary-700'
    >
        {/* las etiquetas "Fecha:", "Proveedor:"... solo se ven en celular (lg:hidden);
            en pantalla grande ya las pone el encabezado de la tabla */}
        <p className="lg:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 lg:hidden">Fecha: </span>
            {fechaFormateada}
        </p>

        <p className="lg:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 lg:hidden">Proveedor: </span>
            <span className="font-semibold">{proveedor?.nombre_prov}</span>
        </p>

        <p className="lg:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 lg:hidden">Registrado por: </span>
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

        {/* botones de accion */}
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
                onClick={() => descargarPDF(id_fact_prov)}
                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-md transition-colors"
            >
                <FaFilePdf />
            </button>

            {esAdmin && !eliminada && (
                <button
                    type="button"
                    title="Eliminar"
                    onClick={() => eliminarFactura(id_fact_prov)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                >
                    <FaTrashAlt />
                </button>
            )}

            {esAdmin && eliminada && (
                <button
                    type="button"
                    title="Reactivar"
                    onClick={() => reactivarFactura(id_fact_prov)}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition-colors"
                >
                    <FaCheckCircle />
                </button>
            )}
        </div>
    </div>
  )
}

export default FacturaProveedor;
