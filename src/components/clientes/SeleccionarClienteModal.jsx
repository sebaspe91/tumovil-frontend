import useClientes from "../../hook/useClientes";
import SeleccionarModal from "../SeleccionarModal";
import Modal from "../Modal";
import FormularioCliente from "./FormularioCliente";

// wrapper de SeleccionarModal (mismo patron que SeleccionarMarcaModal.jsx),
// con un agregado: si el cliente que se busca no existe todavia, se puede
// registrar uno nuevo sin salir de aca, en un modal que se abre ENCIMA de
// este (Modal.jsx ya sabe apilar modales con el z-index dinamico)
function SeleccionarClienteModal({ abierto, onClose, onElegir }) {
    const {
        clientes, paginacionCliente, busquedaCliente, buscarCliente, cambiarPaginaCliente,
        nuevoCliente, modalFormularioCliente, cerrarModalFormularioCliente
    } = useClientes();

    const clientesActivos = clientes.filter(cliente => cliente.estado_cli);

    // se llama cuando FormularioCliente termina de registrar un cliente
    // NUEVO. Ademas de lo que FormularioCliente ya hace solo (mostrar el
    // mensaje de exito y cerrarse el mismo a los 1200ms), aca APROVECHAMOS
    // ese cliente recien creado: lo elegimos de una vez para la factura y
    // cerramos tambien el selector. Se usa el mismo tiempo (1200ms) que usa
    // FormularioCliente para cerrarse, para que ambos modales se cierren
    // juntos justo despues de que el usuario vio el mensaje de exito
    const handleClienteCreado = clienteNuevo => {
        if (!clienteNuevo) return;

        setTimeout(() => {
            onElegir(clienteNuevo);
            onClose();
        }, 1200);
    }

    return (
        <>
            <SeleccionarModal
                abierto={abierto}
                onClose={onClose}
                onElegir={onElegir}
                titulo="Seleccionar Cliente"
                items={clientesActivos}
                busqueda={busquedaCliente}
                onBuscar={buscarCliente}
                placeholderBusqueda="Buscar por nombre, apellido o cedula"
                mensajeVacio="No hay clientes registrados"
                paginacion={paginacionCliente}
                onCambiarPagina={cambiarPaginaCliente}
                obtenerKey={cliente => cliente.id_cliente}
                renderFila={cliente => (
                    <>
                        <span className="font-bold text-primary-700">{cliente.nombre_cliente} {cliente.apellido_cliente}</span>
                        <span className="text-sm text-gray-400 font-mono">{cliente.cedula_cliente}</span>
                    </>
                )}
                accionExtra={
                    <button
                        type="button"
                        onClick={nuevoCliente}
                        className="w-full border-2 border-dashed border-primary-300 text-primary-600 uppercase font-bold text-sm px-4 py-3 rounded-xl hover:bg-primary-50"
                    >
                        + El cliente no existe, registrar uno nuevo
                    </button>
                }
            />

            {/* modal anidado: se abre encima del selector mientras se
                registra el cliente nuevo */}
            <Modal
                abierto={modalFormularioCliente}
                onClose={cerrarModalFormularioCliente}
                titulo="Registrar Cliente"
            >
                {modalFormularioCliente && <FormularioCliente onExito={handleClienteCreado} />}
            </Modal>
        </>
    )
}

export default SeleccionarClienteModal;
