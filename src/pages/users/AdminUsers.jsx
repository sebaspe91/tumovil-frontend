import FormularioUsers from "../../components/users/FormularioUsers";
import ListaUsuarios from "../../components/users/ListaUsuarios";
import Modal from "../../components/Modal";
import useUsers from "../../hook/useUsers";

function AdminUsers() {
    // usuario: usuario seleccionado para editar (o {} si es "nuevo")
    // modalFormulario/nuevoUsuario/cerrarModalFormulario: controlan el modal
    const {usuario, modalFormulario, nuevoUsuario, cerrarModalFormulario} = useUsers();

    // si "usuario" trae id_usuario, estamos editando uno que ya existe;
    // si no, el modal se abrio en modo "registrar uno nuevo"
    const modoEdicion = Boolean(usuario?.id_usuario);

  return (
    <>
        <div className="flex justify-center md:justify-end mb-6 md:mr-5">
            <button
                type="button"
                onClick={nuevoUsuario}
                className="bg-primary-600 text-white uppercase font-bold px-6 py-3 rounded-md hover:bg-primary-800"
            >
                + Nuevo Usuario
            </button>
        </div>

        <Modal
            abierto={modalFormulario}
            onClose={cerrarModalFormulario}
            titulo={modoEdicion ? 'Edita el Usuario' : 'Registra Tus Usuarios'}
        >
            {/*
                key fuerza a React a montar un FormularioUsers nuevo cada vez
                que cambia el usuario a editar (o vuelve a "nuevo"), en vez de
                reusar la misma instancia y tener que sincronizarla con un
                efecto. Solo lo montamos mientras el modal esta abierto, para
                no pedir datos de mas.
            */}
            {modalFormulario && <FormularioUsers key={usuario?.id_usuario ?? 'nuevo'} />}
        </Modal>

        <ListaUsuarios />
    </>
  )
}

export default AdminUsers;
