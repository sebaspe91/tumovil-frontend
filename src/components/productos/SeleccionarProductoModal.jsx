import { useEffect, useState } from "react";
import useProducto from "../../hook/useProducto";
import Modal from "../Modal";
import Paginacion from "../Paginacion";

// mismos valores por defecto que ProductosProvider (FILTROS_PRODUCTO_INICIALES)
const FILTROS_VACIOS = {
    nombre_prod: '',
    codigo_prod: '',
    categoria_id: '',
    marca_id: '',
    tipoPrecio: '',
    precioMin: '',
    precioMax: ''
};

// A diferencia de SeleccionarClienteModal o el SeleccionarModal generico
// (donde click en la fila = elegir y cerrar), este modal deja marcar VARIOS
// productos de una sola pasada, cada uno con su propia cantidad, y recien
// cuando el usuario confirma con el boton de abajo se avisa al formulario y
// se cierra. Por eso NO reutiliza el SeleccionarModal generico: ese esta
// pensado para una sola eleccion por click, y aca cada fila necesita ademas
// un numero de cantidad (que no se puede meter adentro de un <button>
// clickeable sin que los clicks del input choquen con los de la fila).
//
// "seleccion" guarda, para cada producto marcado, el PRODUCTO COMPLETO (no
// solo su id) junto con la cantidad elegida. Esto importa: la lista
// "productos" que viene del backend cambia de pagina en pagina (y con cada
// busqueda), asi que si solo guardaramos el id, al cambiar de pagina
// perderiamos de donde sacar los datos de lo que ya se habia marcado antes.
// Guardando el objeto completo en el momento en que se marca, la seleccion
// sobrevive aunque despues se busque otra cosa o se cambie de pagina.
function SeleccionarProductoModal({ abierto, onClose, onElegir }) {
    const { productos, paginacionProducto, filtrosProducto, buscarProducto, cambiarPaginaProducto } = useProducto();

    const [texto, setTexto] = useState(filtrosProducto.nombre_prod);
    const [seleccion, setSeleccion] = useState({});

    // cada vez que el modal se vuelve a abrir, arranca con la seleccion en
    // blanco (no se arrastra lo que se habia marcado la vez anterior)
    useEffect(() => {
        if (abierto) {
            setSeleccion({});
            setTexto(filtrosProducto.nombre_prod);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [abierto]);

    const handleBuscar = e => {
        e.preventDefault();
        buscarProducto({ ...FILTROS_VACIOS, nombre_prod: texto.trim() });
    }

    const limpiarBusqueda = () => {
        setTexto('');
        buscarProducto({ ...FILTROS_VACIOS, nombre_prod: '' });
    }

    // marca/desmarca un producto. Al marcarlo arranca con cantidad 1; si se
    // desmarca se olvida por completo (si se vuelve a marcar, arranca de
    // nuevo en 1)
    const alternarSeleccion = producto => {
        setSeleccion(anterior => {
            const copia = { ...anterior };

            if (copia[producto.id_producto]) {
                delete copia[producto.id_producto];
            } else {
                copia[producto.id_producto] = { producto, cantidad: 1 };
            }

            return copia;
        });
    }

    // mientras el usuario esta escribiendo se deja el campo TAL CUAL esta
    // (incluso vacio): antes, si borraba el numero, el campo quedaba vacio
    // un instante y la validacion de abajo convertia eso en "1" de una vez
    // (Number('') es 0, y "0 || 1" da 1) -- por eso no se podia borrar el
    // 1 para escribir otro numero, se quedaba pegado. Ahora el numero se
    // corrige (minimo 1, maximo el stock) recien cuando el usuario SALE del
    // campo, en "corregirCantidad" mas abajo
    const cambiarCantidad = (idProducto, valor) => {
        // solo se aceptan numeros o el campo vacio (mientras se escribe);
        // cualquier otra cosa (letras, signos) se ignora
        if (valor !== '' && !/^\d+$/.test(valor)) return;

        setSeleccion(anterior => {
            const item = anterior[idProducto];
            if (!item) return anterior;

            return {
                ...anterior,
                [idProducto]: { ...item, cantidad: valor }
            };
        });
    }

    // esto se llama cuando el campo de cantidad PIERDE el foco (onBlur):
    // aca si se corrige de una vez si quedo vacio, en 0, o se paso del stock
    const corregirCantidad = idProducto => {
        setSeleccion(anterior => {
            const item = anterior[idProducto];
            if (!item) return anterior;

            const cantidad = Math.max(1, Math.min(Number(item.cantidad) || 1, item.producto.cantidad_prod));

            return {
                ...anterior,
                [idProducto]: { ...item, cantidad }
            };
        });
    }

    // al confirmar, se corrige de nuevo por las dudas (ej. si el usuario
    // marco "Agregar" sin sacar el cursor del campo de cantidad, onBlur
    // todavia no se habria disparado)
    const itemsElegidos = Object.values(seleccion).map(item => ({
        producto: item.producto,
        cantidad: Math.max(1, Math.min(Number(item.cantidad) || 1, item.producto.cantidad_prod))
    }));

    const handleAgregar = () => {
        if (itemsElegidos.length === 0) return;

        onElegir(itemsElegidos);
        setSeleccion({});
        onClose();
    }

    return (
        <Modal abierto={abierto} onClose={onClose} titulo="Seleccionar Productos" ancho="max-w-2xl">

            <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                    type="text"
                    value={texto}
                    onChange={e => setTexto(e.target.value)}
                    placeholder="Buscar por nombre del producto"
                    className="border-2 flex-1 p-2 placeholder-gray-400 bg-gray-50 rounded-xl"
                />
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-primary-600 text-white uppercase font-bold px-5 py-2 rounded-xl hover:bg-primary-800"
                    >
                        Buscar
                    </button>
                    {filtrosProducto.nombre_prod && (
                        <button
                            type="button"
                            onClick={limpiarBusqueda}
                            className="border-2 text-gray-600 uppercase font-bold px-5 py-2 rounded-xl hover:bg-gray-100"
                        >
                            Limpiar
                        </button>
                    )}
                </div>
            </form>

            {productos.length ? (
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                    {productos.map(producto => {
                        const sinStock = producto.cantidad_prod <= 0;
                        const elegido = seleccion[producto.id_producto];

                        return (
                            <div
                                key={producto.id_producto}
                                className={`flex items-center justify-between gap-3 px-4 py-3 ${elegido ? 'bg-primary-50' : ''}`}
                            >
                                <label className={`flex items-center gap-3 flex-1 ${sinStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <input
                                        type="checkbox"
                                        checked={Boolean(elegido)}
                                        disabled={sinStock}
                                        onChange={() => alternarSeleccion(producto)}
                                        className="w-5 h-5 accent-primary-600 shrink-0"
                                    />
                                    <span className="flex flex-col">
                                        <span className="font-bold text-primary-700">{producto.nombre_prod}</span>
                                        <span className="text-sm text-gray-500">
                                            $ {Number(producto.precio_venta).toLocaleString('es-CO')} · Stock: {sinStock ? 'agotado' : producto.cantidad_prod}
                                        </span>
                                    </span>
                                </label>

                                {elegido && (
                                    <input
                                        type="number"
                                        min="1"
                                        max={producto.cantidad_prod}
                                        value={elegido.cantidad}
                                        onChange={e => cambiarCantidad(producto.id_producto, e.target.value)}
                                        onBlur={() => corregirCantidad(producto.id_producto)}
                                        className="border-2 p-2 rounded-lg w-20 text-center shrink-0"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-6">
                    {filtrosProducto.nombre_prod
                        ? <>No se encontraron resultados para {' '}<span className="text-primary-600 font-bold">"{filtrosProducto.nombre_prod}"</span></>
                        : <>No hay productos registrados</>
                    }
                </p>
            )}

            <div className="mt-4">
                <Paginacion paginacion={paginacionProducto} onCambiarPagina={cambiarPaginaProducto} />
            </div>

            <button
                type="button"
                onClick={handleAgregar}
                disabled={itemsElegidos.length === 0}
                className="w-full bg-primary-600 text-white uppercase font-bold px-5 py-3 rounded-xl mt-4 hover:bg-primary-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                {itemsElegidos.length
                    ? `Agregar ${itemsElegidos.length} producto${itemsElegidos.length > 1 ? 's' : ''}`
                    : 'Elige al menos un producto'}
            </button>

        </Modal>
    )
}

export default SeleccionarProductoModal;
