import FormularioMarca from "../../components/marcas/FormularioMarca";
import ListaMarcas from "../../components/marcas/ListaMarcas";
import Modal from "../../components/Modal";
import useMarca from "../../hook/useMarca";

function AdminMarcas() {

  const {marca, modalFormularioMarca, nuevaMarca, cerrarModalFormularioMarca} = useMarca();

  // modo edicion
  const modoEdicion = Boolean(marca?.id_marca);

  return (
    <>
      <div className="flex justify-center md:justify-end mb-6 md:mr-5">
        <button 
          type="button"
          onClick={nuevaMarca}
          className="bg-primary-600 text-white uppercase font-bold px-6 py-3 rounded-md hover:bg-primary-800"
        >
          + Nueva Marca
        </button>
      </div>

      <Modal
        abierto={modalFormularioMarca}
        onClose={cerrarModalFormularioMarca}
        titulo={modoEdicion ? 'Editar Marca' : 'Registrar Marca'}
      >
        {modalFormularioMarca && <FormularioMarca key={marca?.id_marca ?? 'nuevo'} />}
      </Modal>

      <ListaMarcas />
    </>
  )
}

export default AdminMarcas;
