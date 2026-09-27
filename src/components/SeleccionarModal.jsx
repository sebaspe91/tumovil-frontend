import { useState } from "react";
import Modal from "./Modal";
import Paginacion from "./Paginacion";

// Modal "selector" GENERICO: no sabe nada de Marca, Cliente, Producto ni
// de ninguna entidad en particular -- solo sabe dibujar una lista con
// buscador y paginacion, y avisar cuando el usuario elige una fila. Cada
// pagina que lo usa le pasa SUS datos (con su propio hook, ej. useMarca,
// useCliente) y le dice como se ve cada fila con "renderFila".
//
// Es la version reutilizable de lo que antes era SeleccionarMarcaModal:
// ese ahora es un "envoltorio" (wrapper) chiquito que le pasa a este los
// datos de Marca -- ver components/marcas/SeleccionarMarcaModal.jsx.
//
// Props:
//   abierto            -> igual que en Modal
//   onClose            -> cierra el selector sin elegir nada
//   onElegir           -> se llama con el item completo que se clickeo
//   titulo             -> texto del encabezado del modal (ej. "Seleccionar Marca")
//   items              -> el array YA FILTRADO que se debe mostrar (ej. marcas activas)
//   busqueda           -> el texto de busqueda actual (viene del Provider de turno)
//   onBuscar           -> funcion que dispara la busqueda (ej. buscarMarca)
//   placeholderBusqueda-> texto de ejemplo del input de busqueda
//   mensajeVacio       -> que mostrar cuando no hay items y tampoco hay busqueda activa
//   paginacion         -> objeto de paginacion (ej. paginacionMarca)
//   onCambiarPagina    -> funcion para cambiar de pagina (ej. cambiarPaginaMarca)
//   obtenerKey         -> funcion que devuelve el key unico de cada item (ej. m => m.id_marca)
//   renderFila         -> funcion que devuelve el JSX de adentro de cada fila
function SeleccionarModal({
    abierto,
    onClose,
    onElegir,
    titulo,
    items,
    busqueda,
    onBuscar,
    placeholderBusqueda = 'Buscar...',
    mensajeVacio = 'No hay elementos registrados',
    paginacion,
    onCambiarPagina,
    obtenerKey,
    renderFila
}) {

    const [texto, setTexto] = useState(busqueda);

    const handleBuscar = e => {
        e.preventDefault();
        onBuscar(texto.trim());
    }

    const limpiarBusqueda = () => {
        setTexto('');
        onBuscar('');
    }

    return (
        <Modal abierto={abierto} onClose={onClose} titulo={titulo}>

            <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                    type="text"
                    value={texto}
                    onChange={e => setTexto(e.target.value)}
                    placeholder={placeholderBusqueda}
                    className="border-2 flex-1 p-2 placeholder-gray-400 bg-gray-50 rounded-xl"
                />
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-primary-600 text-white uppercase font-bold px-5 py-2 rounded-xl hover:bg-primary-800"
                    >
                        Buscar
                    </button>
                    {busqueda && (
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

            {items.length ? (
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                    {items.map(item => (
                        <button
                            key={obtenerKey(item)}
                            type="button"
                            onClick={() => onElegir(item)}
                            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-primary-50 transition-colors"
                        >
                            {renderFila(item)}
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-6">
                    {busqueda
                        ? <>No se encontraron resultados para {' '}<span className="text-primary-600 font-bold">"{busqueda}"</span></>
                        : <>{mensajeVacio}</>
                    }
                </p>
            )}

            <div className="mt-4">
                <Paginacion paginacion={paginacion} onCambiarPagina={onCambiarPagina} />
            </div>
        </Modal>
    )
}

export default SeleccionarModal;
