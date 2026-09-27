import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import useProducto from "../../hook/useProducto";
import Paginacion from "../Paginacion";
import Producto from "./Producto";
import SeleccionarMarcaModal from "../marcas/SeleccionarMarcaModal";

// mismos valores por defecto que en ListaProductos.jsx (deben coincidir con
// FILTROS_PRODUCTO_INICIALES del ProductosProvider)
const FILTROS_VACIOS = {
    nombre_prod: '',
    codigo_prod: '',
    categoria_id: '',
    marca_id: '',
    tipoPrecio: '',
    precioMin: '',
    precioMax: ''
};

function ListaProductosEliminados() {

    const {
        productosEliminados,
        paginacionProductoEliminados,
        filtrosProductoEliminados,
        buscarProductoEliminadas,
        cambiarPaginaProductoEliminados,
        categorias
    } = useProducto();

    // estado local del formulario de filtros, todavia no aplicado
    const [filtros, setFiltros] = useState(FILTROS_VACIOS);

    const [marcaElegida, setMarcaElegida] = useState(null);
    const [modalSeleccionarMarca, setModalSeleccionarMarca] = useState(false);

    // el panel de filtros empieza cerrado aca: esta lista ya vive dentro de
    // un modal, y no queremos que ademas ocupe todo el alto con el panel abierto
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const hayFiltrosActivos = Object.values(filtrosProductoEliminados).some(valor => valor !== '');

    const handleChange = e => {
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value
        });
    }

    const handleElegirMarca = marca => {
        setMarcaElegida(marca);
        setModalSeleccionarMarca(false);
    }

    const handleBuscar = e => {
        e.preventDefault();

        buscarProductoEliminadas({
            ...filtros,
            marca_id: marcaElegida?.id_marca ?? ''
        });
    }

    const limpiarBusqueda = () => {
        setFiltros(FILTROS_VACIOS);
        setMarcaElegida(null);
        buscarProductoEliminadas(FILTROS_VACIOS);
    }

  return (
    <>
        <h2 className="font-black text-3xl text-center">Productos Eliminados</h2>

        <p className="text-xl mt-5 mb-6 text-center">
        Recupera tus {' '}
        <span className="text-primary-600 font-bold">Productos</span>
        </p>

        <SeleccionarMarcaModal
            abierto={modalSeleccionarMarca}
            onClose={() => setModalSeleccionarMarca(false)}
            onElegir={handleElegirMarca}
        />

        {/* boton para mostrar/ocultar el panel de filtros */}
        <div className="max-w-3xl mx-auto mb-4 flex justify-center">
            <button
                type="button"
                onClick={() => setMostrarFiltros(anterior => !anterior)}
                className="relative flex items-center gap-2 border-2 border-primary-600 text-primary-700 font-bold uppercase text-sm px-5 py-2 rounded-xl hover:bg-primary-50"
            >
                <FaFilter />
                {mostrarFiltros ? 'Ocultar filtros' : 'Mostrar filtros'}

                {hayFiltrosActivos && !mostrarFiltros && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-600 rounded-full border-2 border-white"></span>
                )}
            </button>
        </div>

        {mostrarFiltros && (
        <form onSubmit={handleBuscar} className="max-w-3xl mx-auto mb-8 bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                    <label className="font-bold uppercase text-xs text-gray-500">Nombre del producto</label>
                    <input
                        type="text"
                        name="nombre_prod"
                        value={filtros.nombre_prod}
                        onChange={handleChange}
                        placeholder="Ej: Pantalla Mac"
                        className="border-2 w-full p-2 mt-1 placeholder-gray-400 bg-white rounded-xl"
                    />
                </div>

                <div>
                    <label className="font-bold uppercase text-xs text-gray-500">Codigo del producto</label>
                    <input
                        type="text"
                        name="codigo_prod"
                        value={filtros.codigo_prod}
                        onChange={handleChange}
                        placeholder="Ej: PRD-001"
                        className="border-2 w-full p-2 mt-1 placeholder-gray-400 bg-white rounded-xl"
                    />
                </div>

                <div>
                    <label className="font-bold uppercase text-xs text-gray-500">Categoria</label>
                    <select
                        name="categoria_id"
                        value={filtros.categoria_id}
                        onChange={handleChange}
                        className="border-2 w-full p-2 mt-1 bg-white rounded-xl"
                    >
                        <option value="">Todas las categorias</option>
                        {categorias.map(categoria => (
                            <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                {categoria.nombre_categoria}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="font-bold uppercase text-xs text-gray-500">Marca</label>
                    <button
                        type="button"
                        onClick={() => setModalSeleccionarMarca(true)}
                        className="border-2 w-full p-2 mt-1 bg-white rounded-xl text-left hover:bg-gray-100"
                    >
                        {marcaElegida ? marcaElegida.nombre_marca : 'Todas las marcas'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div>
                    <label className="font-bold uppercase text-xs text-gray-500">Filtrar por precio</label>
                    <select
                        name="tipoPrecio"
                        value={filtros.tipoPrecio}
                        onChange={handleChange}
                        className="border-2 w-full p-2 mt-1 bg-white rounded-xl"
                    >
                        <option value="">Ninguno</option>
                        <option value="venta">Precio de venta</option>
                        <option value="compra">Precio de compra</option>
                    </select>
                </div>

                {filtros.tipoPrecio && (
                    <>
                        <div>
                            <label className="font-bold uppercase text-xs text-gray-500">Desde</label>
                            <input
                                type="number"
                                name="precioMin"
                                value={filtros.precioMin}
                                onChange={handleChange}
                                min="0"
                                placeholder="0"
                                className="border-2 w-full p-2 mt-1 placeholder-gray-400 bg-white rounded-xl"
                            />
                        </div>

                        <div>
                            <label className="font-bold uppercase text-xs text-gray-500">Hasta</label>
                            <input
                                type="number"
                                name="precioMax"
                                value={filtros.precioMax}
                                onChange={handleChange}
                                min="0"
                                placeholder="Sin limite"
                                className="border-2 w-full p-2 mt-1 placeholder-gray-400 bg-white rounded-xl"
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                    type="submit"
                    className="bg-primary-600 text-white uppercase font-bold px-6 py-2 rounded-xl hover:bg-primary-800"
                >
                    Buscar
                </button>
                {hayFiltrosActivos && (
                    <button
                        type="button"
                        onClick={limpiarBusqueda}
                        className="border-2 text-gray-600 uppercase font-bold px-6 py-2 rounded-xl hover:bg-gray-100"
                    >
                        Limpiar
                    </button>
                )}
            </div>
        </form>
        )}

        {/* encabezado del cuadro: mismas columnas y misma alineacion que ListaProductos.jsx */}
        {productosEliminados.length > 0 && (
            <div className="hidden lg:grid lg:grid-cols-[60px_1fr_2fr_1fr_0.3fr_0.5fr_0.5fr_110px] gap-4 items-center
                bg-primary-700 text-white text-xs font-bold uppercase px-5 py-3 rounded-t-xl mx-5">
                <span className="text-center">Detalle</span>
                <span className="text-left">Categoria</span>
                <span className="text-left">Producto</span>
                <span className="text-left">Marca</span>
                <span className="text-left">Cantidad</span>
                <span className="text-left">Valor Compra</span>
                <span className="text-left">Valor Venta</span>
                <span className="text-right">Acciones</span>
            </div>
        )}

        {productosEliminados.length ? (
            <div className="lg:border lg:border-t-0 lg:border-gray-200 lg:rounded-b-xl lg:overflow-hidden">
                {productosEliminados.map(producto => (
                    <Producto key={producto.id_producto} producto={producto} />
                ))}
            </div>
        ):(
            <p className="text-xl mt-5 mb-10 text-center">
                {hayFiltrosActivos
                    ? <>No se encontraron Productos Eliminados con esos filtros</>
                    : <>No hay Productos Eliminados</>
                }
            </p>
        )}

        <Paginacion paginacion={paginacionProductoEliminados} onCambiarPagina={cambiarPaginaProductoEliminados} />
    </>
  )
}

export default ListaProductosEliminados;
