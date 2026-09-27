import useProducto from '../../hook/useProducto';
import CampoCopiable from '../CampoCopiable';

function ProductoDetalle() {
    const { productoMostrar } = useProducto();

    const {
        nombre_prod,
        codigo_prod,
        categoria,
        marca,
        cantidad_prod,
        precio_compra,
        precio_venta,
        foto_producto,
        estado_prod,
        detalle_prod
    } = productoMostrar;

    // arma la url de la imagen igual que en Producto.jsx (mismo backend, misma carpeta)
    const imagenProducto = foto_producto
        ? `${import.meta.env.VITE_BACKEND_URL}/uploads/productos/${foto_producto}`
        : null;

    // formatea un precio como moneda; si no hay valor (ni siquiera 0) muestra N/A
    const formatearPrecio = valor =>
        (valor || valor === 0) ? `$ ${Number(valor).toLocaleString('es-CO')}` : 'N/A';

    return (
        <div className="flex flex-col gap-6">

            {/* Imagen del producto: grande y arriba de todo */}
            <div className="w-full h-64 md:h-80 bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
                {imagenProducto ? (
                    <img
                        src={imagenProducto}
                        alt={`Foto de ${nombre_prod}`}
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <span className="text-gray-400 text-sm">Sin imagen</span>
                )}
            </div>

            {/* Nombre del producto + estado (activo/inactivo) */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h2 className="text-2xl font-bold text-primary-700">{nombre_prod}</h2>

                <span
                    className={`self-start md:self-auto px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        estado_prod
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
                >
                    {estado_prod ? 'Activo' : 'Inactivo'}
                </span>
            </div>

            {/* Datos principales, en una tarjeta con grid de 2 columnas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-gray-50 border border-gray-100 rounded-xl p-5">

                <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Codigo</p>
                    <CampoCopiable texto={codigo_prod} claseTexto="font-semibold text-primary-700" />
                </div>

                <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Categoria</p>
                    <p className="font-semibold text-primary-700">{categoria?.nombre_categoria ?? 'N/A'}</p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Marca</p>
                    <p className="font-semibold text-primary-700">{marca?.nombre_marca ?? 'N/A'}</p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Cantidad</p>
                    <p className="font-semibold text-primary-700">{cantidad_prod ?? 'N/A'}</p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Precio Compra</p>
                    <p className="font-semibold text-primary-700">{formatearPrecio(precio_compra)}</p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Precio Venta</p>
                    <p className="font-semibold text-primary-700">{formatearPrecio(precio_venta)}</p>
                </div>
            </div>

            {/* Detalle / descripcion larga del producto */}
            <div>
                <p className="text-xs font-bold uppercase text-gray-400 mb-1">Detalle</p>
                <p className="text-gray-600 whitespace-pre-line">
                    {detalle_prod || 'Sin detalle registrado'}
                </p>
            </div>

        </div>
    )
}

export default ProductoDetalle;
