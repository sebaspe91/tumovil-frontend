import { useState } from "react";
import FormularioMarca from "../../components/marcas/FormularioMarca";
import ListaMarcas from "../../components/marcas/ListaMarcas";
import ListaMarcasEliminadas from "../../components/marcas/ListaMarcasEliminadas";
import Modal from "../../components/Modal";
import useMarca from "../../hook/useMarca";

function AdminMarcas() {

  const {marca, modalFormularioMarca, nuevaMarca, cerrarModalFormularioMarca} = useMarca();

  // modal propio de esta pagina para mostrar la lista de Marcas Eliminadas
  const [modalMarcasEliminadas, setModalMarcasEliminadas] = useState(false);

  // modo edicion
  const modoEdicion = Boolean(marca?.id_marca);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center md:justify-end gap-3 mb-6 md:mr-5">
        <button
          type="button"
          onClick={nuevaMarca}
          className="bg-primary-600 text-white uppercase font-bold px-6 py-3 rounded-md hover:bg-primary-800"
        >
          + Nueva Marca
        </button>

        {/* abre el modal con la lista de Marcas Eliminadas (no navega a otra pagina) */}
        <button
          type="button"
          onClick={() => setModalMarcasEliminadas(true)}
          className="bg-gray-600 text-white uppercase font-bold px-6 py-3 rounded-md hover:bg-gray-800"
        >
          Marcas Eliminadas
        </button>
      </div>

      <Modal
        abierto={modalFormularioMarca}
        onClose={cerrarModalFormularioMarca}
        titulo={modoEdicion ? 'Editar Marca' : 'Registrar Marca'}
      >
        {/*
            key fuerza a React a montar un FormularioMarca nuevo cada vez
            que cambia la marca a editar (o vuelve a "nuevo"), en vez de
            reusar la misma instancia y tener que sincronizarla con un
            efecto. Solo lo montamos mientras el modal esta abierto, para
            no pedir datos de mas.
        */}
        {modalFormularioMarca && <FormularioMarca key={marca?.id_marca ?? 'nuevo'} />}
      </Modal>

      <Modal
        abierto={modalMarcasEliminadas}
        onClose={() => setModalMarcasEliminadas(false)}
        titulo='Marcas Eliminadas'
        ancho='max-w-4xl'
      >
        {/* solo se monta (y solo entonces se piden/usan los datos) mientras el modal esta abierto */}
        {modalMarcasEliminadas && <ListaMarcasEliminadas />}
      </Modal>

      <ListaMarcas />
    </>
  )
}

export default AdminMarcas;
