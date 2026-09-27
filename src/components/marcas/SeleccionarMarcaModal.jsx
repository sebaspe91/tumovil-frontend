import useMarca from "../../hook/useMarca";
import SeleccionarModal from "../SeleccionarModal";

// Este componente ya no dibuja el modal el mismo -- eso ahora lo hace
// SeleccionarModal (generico, en components/SeleccionarModal.jsx). Lo
// unico que hace este archivo es "traducir" los datos de Marca al
// lenguaje que entiende el generico: le arma "items" (ya filtrado a
// solo activas), le dice como se ve cada fila, y le pasa las funciones
// de busqueda/paginacion tal cual vienen de useMarca().
//
// FormularioProducto.jsx (y cualquier otro que ya lo use) no necesita
// cambiar nada -- sigue recibiendo las mismas 3 props de siempre
// (abierto, onClose, onElegir).
function SeleccionarMarcaModal({ abierto, onClose, onElegir }) {

    const { marcas, paginacionMarca, busquedaMarca, buscarMarca, cambiarPaginaMarca } = useMarca();

    // en un producto solo tiene sentido elegir marcas activas
    const marcasActivas = marcas.filter(marca => marca.estado_marca);

    return (
        <SeleccionarModal
            abierto={abierto}
            onClose={onClose}
            onElegir={onElegir}
            titulo="Seleccionar Marca"
            items={marcasActivas}
            busqueda={busquedaMarca}
            onBuscar={buscarMarca}
            placeholderBusqueda="Buscar por nombre o codigo de la marca"
            mensajeVacio="No hay marcas registradas"
            paginacion={paginacionMarca}
            onCambiarPagina={cambiarPaginaMarca}
            obtenerKey={marca => marca.id_marca}
            renderFila={marca => (
                <>
                    <span className="font-bold text-primary-700">{marca.nombre_marca}</span>
                    <span className="text-sm text-gray-400 font-mono">{marca.codigo_marca}</span>
                </>
            )}
        />
    )
}

export default SeleccionarMarcaModal;
