import ListaProveedor from "../../components/proveedor/ListaProveedor";
import Modal from "../../components/Modal";
import useProveedor from "../../hook/useProveedor";
import FormularioProveedor from "../../components/proveedor/FormularioProveedor";

function AdminProveedor() {

    // traemos los elementos de proveedor
    const {proveedor, modalFormularioProveedor, nuevoProveedor, cerrarModalFormularioProveedor} = useProveedor();

    // modo edicion
    const modoEdicion = Boolean(proveedor?.id_proveedor);
    
  return (
    <>

        <div className="flex justify-center md:justify-end mb-6 md:mr-5">
            <button
                type="button"
                onClick={nuevoProveedor}
                className="bg-primary-600 text-white uppercase font-bold px-6 py-3 rounded-md hover:bg-primary-800"
            >
                + Nuevo Proveedor
            </button>
        </div>

        <Modal
            abierto={modalFormularioProveedor}
            onClose={cerrarModalFormularioProveedor}
            titulo={modoEdicion ? 'Edita tu Proveedor' : 'Registra Tu Proveedor'}
        >
            {/*
                key fuerza a React a montar un FormularioUsers nuevo cada vez
                que cambia el usuario a editar (o vuelve a "nuevo"), en vez de
                reusar la misma instancia y tener que sincronizarla con un
                efecto. Solo lo montamos mientras el modal esta abierto, para
                no pedir datos de mas.
            */}
            {modalFormularioProveedor && <FormularioProveedor key={proveedor?.id_proveedor ?? 'nuevo'} />}
        </Modal>

        <ListaProveedor /> 
     
    </>
  )
}

export default AdminProveedor;
