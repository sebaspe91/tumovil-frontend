import useProveedor from "../../hook/useProveedor";
import SeleccionarModal from "../SeleccionarModal";
import Modal from "../Modal";
import FormularioProveedor from "./FormularioProveedor";

// transfiere los datos al modal seleccionador
function SeleccionarProvvedorModal({abierto, onClose, onElegir}) {
    const {
        proveedores, 
        paginacionProveedor, 
        busquedaProveedor, 
        buscarProveedor, 
        cambiarPaginaProveedor,
        nuevoProveedor,
        modalFormularioProveedor,
        cerrarModalFormularioProveedor
    } = useProveedor();

    // Seleccionar proveedor nuevo y cerrar modal
    const handleProveedorCreado = proveedorNuevo => {
        if (!proveedorNuevo) return;

        // tiempo para seleccionar el cliente y cerrar modal
        setTimeout(() => {
            onElegir(proveedorNuevo);
            onClose();
        }, 1200);
    }    

  return (
    <>
      <SeleccionarModal 
        abierto={abierto}
        onClose={onClose}
        onElegir={onElegir}
        titulo="Seleccionar Proveedor"
        items={proveedores}
        busqueda={busquedaProveedor}
        onBuscar={buscarProveedor}
        placeholderBusqueda="Buscar por nombre, nit o correo"
        mensajeVacio="No hay proveedores registrados"
        paginacion={paginacionProveedor}
        onCambiarPagina={cambiarPaginaProveedor}
        obtenerKey={proveedor => proveedor.id_proveedor}
        renderFila={proveedor => (
            <>
              <span className="font-bold text-primary-700">
                {proveedor.nombre_prov}
              </span>
              <span className="text-sm text-gray-400 font-mono">
                {proveedor.nit_prov}
              </span>
            </>
        )}
        accionExtra={
            <button
                type="button"
                onClick={nuevoProveedor}
                className="w-full border-2 border-dashed border-primary-300 text-primary-600 uppercase font-bold text-sm px-4 py-3 rounded-xl hover:bg-primary-50"
            >
                + El proveedor no existe, registrar uno nuevo
            </button>
        }
      />

      {/* modal anidado: se abbre encima del selector mientras regista el proveedor nuevo */}
      <Modal
        abierto={modalFormularioProveedor}
        onClose={cerrarModalFormularioProveedor}
        titulo="Registrar Proveedor"
      >
        {modalFormularioProveedor && <FormularioProveedor onExito={handleProveedorCreado} />}
      </Modal>
    </>
  )
}

export default SeleccionarProvvedorModal;
