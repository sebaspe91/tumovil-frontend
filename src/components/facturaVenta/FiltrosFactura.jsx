import { useState } from "react";

// =====================================================================
//  FiltrosFactura -- las casillas para filtrar el historial de facturas
// =====================================================================
// Es un componente "tonto": no habla con el backend. Solo muestra las
// casillas, valida que el rango de fechas tenga sentido y, al pulsar
// "Buscar", le entrega los filtros al componente padre mediante onBuscar.
// El padre (ListaFacturaVenta o ListaFacturaVentaEliminadas) es quien los
// manda al backend. Por eso sirve igual para las dos listas.
//
// Props:
//   onBuscar            -> funcion({ busqueda, desde, hasta }) que se llama al buscar o limpiar
//   etiquetaBusqueda    -> (opcional) titulo de la casilla de texto. Por defecto "Cliente"
//                          (ventas); en compras se pasa "Proveedor"
//   placeholderBusqueda -> (opcional) texto de ejemplo de esa casilla
function FiltrosFactura({
    onBuscar,
    etiquetaBusqueda = 'Cliente',
    placeholderBusqueda = 'Buscar por nombre, apellido o cedula del cliente'
}) {
    // PASO 1 -- lo que el usuario va escribiendo. Son estados LOCALES: se
    // actualizan con cada tecla, pero NO se consulta nada al backend hasta
    // que presione "Buscar" (asi no se hace una peticion por cada letra).
    const [busqueda, setBusqueda] = useState('');
    const [desde, setDesde] = useState('');   // formato 'YYYY-MM-DD'
    const [hasta, setHasta] = useState('');
    const [error, setError] = useState('');

    // hay algo escrito en alguna casilla? (para mostrar u ocultar "Limpiar")
    const hayFiltros = busqueda.trim() !== '' || desde !== '' || hasta !== '';

    // PASO 2 -- al enviar el formulario (boton Buscar o tecla Enter)
    const handleSubmit = (e) => {
        e.preventDefault(); // evita que el navegador recargue la pagina

        // validacion: las fechas 'YYYY-MM-DD' se pueden comparar como texto
        // porque ordenadas alfabeticamente quedan en orden cronologico.
        if (desde && hasta && desde > hasta) {
            setError('La fecha "Desde" no puede ser mayor que la fecha "Hasta".');
            return; // no se manda nada al backend
        }

        setError('');
        onBuscar({ busqueda, desde, hasta }); // el padre pide al backend la pagina 1
    };

    // PASO 3 -- Limpiar: vacia las casillas y vuelve a pedir la lista sin filtros
    const handleLimpiar = () => {
        setBusqueda('');
        setDesde('');
        setHasta('');
        setError('');
        onBuscar({ busqueda: '', desde: '', hasta: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-8 space-y-4">

            {/* CASILLA 1: buscar por cliente */}
            <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">{etiquetaBusqueda}</label>
                <input
                    type="text"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    placeholder={placeholderBusqueda}
                    className="border-2 w-full p-2 placeholder-gray-400 bg-gray-50 rounded-xl"
                />
            </div>

            {/* CASILLA 2 (aparte): rango de fechas de la factura */}
            <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Fecha de la factura</label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-gray-500 w-12">Desde</span>
                        <input
                            type="date"
                            value={desde}
                            onChange={e => setDesde(e.target.value)}
                            className="border-2 w-full p-2 bg-gray-50 rounded-xl"
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-gray-500 w-12">Hasta</span>
                        <input
                            type="date"
                            value={hasta}
                            onChange={e => setHasta(e.target.value)}
                            className="border-2 w-full p-2 bg-gray-50 rounded-xl"
                        />
                    </div>
                </div>
            </div>

            {error && <p className="text-red-600 text-sm font-bold">{error}</p>}

            <div className="flex gap-3 justify-end">
                {hayFiltros && (
                    <button
                        type="button"
                        onClick={handleLimpiar}
                        className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300"
                    >
                        Limpiar
                    </button>
                )}
                <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-800"
                >
                    Buscar
                </button>
            </div>
        </form>
    );
}

export default FiltrosFactura;
