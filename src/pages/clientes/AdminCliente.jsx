import FormularioCliente from "../../components/clientes/FormularioCliente";
import ListaClientes from "../../components/clientes/ListaClientes";
import Modal from "../../components/Modal";
import useClientes from "../../hook/useClientes";

function AdminCliente() {

    const {cliente, modalFormularioCliente, nuevoCliente, cerrarModalFormularioCliente} = useClientes();

    // modo edicion
    const modoEdicion = Boolean(cliente?.id_cliente);

  return (
    <>
        <div className="flex justify-center md:justify-end mb-6 md:mr-5">
            <button
                type="button"
                onClick={nuevoCliente}
                className="bg-primary-600 text-white uppercase font-bold px-6 py-3 rounded-md hover:bg-primary-800"
            >
                + Nuevo Cliente
            </button>
        </div>

        <Modal
            abierto={modalFormularioCliente}
            onClose={cerrarModalFormularioCliente}
            titulo={modoEdicion ? 'Edita tus Clientes' : 'Registra Tus Clientes'}
        >
            {/*
                key fuerza a React a montar un FormularioUsers nuevo cada vez
                que cambia el usuario a editar (o vuelve a "nuevo"), en vez de
                reusar la misma instancia y tener que sincronizarla con un
                efecto. Solo lo montamos mientras el modal esta abierto, para
                no pedir datos de mas.
            */}
            {modalFormularioCliente && <FormularioCliente key={cliente?.id_cliente ?? 'nuevo'} />}
        </Modal>

        <ListaClientes />
    </>
  )
}

export default AdminCliente
