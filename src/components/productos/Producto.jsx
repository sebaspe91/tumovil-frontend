import { FaEdit, FaTrashAlt, FaCheckCircle } from 'react-icons/fa';
import useProducto from '../../hook/useProducto';
import CampoCopiable from '../CampoCopiable';

function Producto({producto}) {
    const {setEditarProducto, setEliminarProducto, setActivarProducto, mostrarProducto} = useProducto();
    
    const {
        id_producto, 
        categoria,
        marca, 
        nombre_prod, 
        cantidad_prod, 
        precio_compra, 
        precio_venta, 
        foto_producto, 
        estado_prod, 
    } = producto;

    const logoMostrar = `${import.meta.env.VITE_BACKEND_URL}/uploads/productos/${foto_producto}`


  return (
    <>
    <div 
      className='flex flex-col lg:grid lg:grid-cols-[60px_1fr_2fr_1fr_0.3fr_0.5fr_0.5fr_110px] gap-3 lg:gap-4 lg:items-center mx-5 my-4 lg:my-0 bg-white shadow-md lg:shadow-none p-5 lg:p-0 rounded-xl lg:rounded-none lg:border-b lg:border-gray-100 lg:px-5 lg:py-3 lg:hover:bg-gray-50 lg:transition-colors text-primary-700'
    >

      {/* foto del producto */}
      <div 
        className="lg:flex items-center justify-center text-gray-300 text-2xl"
        onClick={() => mostrarProducto(producto)}
      >
        <span className="font-bold uppercase text-xs text-gray-500 lg:hidden">Detalle: </span>
        <div 
          className="w-14 h-14 border rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:bg-primary-100"
          title='Detalle del producto'
        >
            {foto_producto ? (
                <img
                    src={logoMostrar}
                    alt="Logo de la empresa"
                    className="w-full h-full object-contain"
                />
            ) : (
                <span className="text-xs text-gray-400 text-center px-2">Sin Img</span>
            )}
        </div>
      </div>

        {/* categoria */}
        <p className="lg:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 lg:hidden">Categoria: </span>
            <CampoCopiable texto={categoria.nombre_categoria} claseTexto="lg:font-semibold" />
        </p>

        {/* Nombre */}
        <p className="lg:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 lg:hidden">Producto: </span>
            <CampoCopiable texto={nombre_prod} claseTexto="lg:font-semibold" />
        </p>

        {/* marca */}
        <p className="lg:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 lg:hidden">Marca: </span>
            <CampoCopiable texto={marca.nombre_marca} claseTexto="lg:font-semibold" />
        </p>

        {/* cantidad */}
        <p className="lg:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 lg:hidden">Cantidad: </span>
            <CampoCopiable texto={cantidad_prod} claseTexto="lg:font-semibold" />
        </p>

        {/* Precio Compra */}
        <p className="lg:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 lg:hidden">Precio Compra: </span>
            <CampoCopiable texto={precio_compra} claseTexto="lg:font-semibold" />
        </p>

        {/* Precio venta */}
        <p className="lg:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 lg:hidden">Precio Venta: </span>
            <CampoCopiable texto={precio_venta} claseTexto="lg:font-semibold" />
        </p>

        {estado_prod ? (
            <div className="flex lg:justify-end gap-2 mt-1 lg:mt-0">
                <button
                    type="button"
                    title="Editar"
                    onClick={() => setEditarProducto(producto)}
                    className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-md transition-colors"
                >
                    <FaEdit />
                </button>

                <button
                    type="button"
                    title="Eliminar"
                    onClick={() => setEliminarProducto(id_producto)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                >
                    <FaTrashAlt />
                </button>
            </div>
        ) : (
            <div className="flex lg:justify-end mt-1 lg:mt-0">
                <button
                    type="button"
                    title="Activar"
                    onClick={() => setActivarProducto(id_producto)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-bold"
                >
                    <FaCheckCircle />
                </button>
            </div>
        ) }

    </div>
    </>
  )
}

export default Producto;
