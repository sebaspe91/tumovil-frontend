import useUsers from "../../hook/useUsers";
import Usuario from "./Usuario";


function ListaUsuariosEliminados() {

    const {usuariosEliminados} = useUsers();

  return (

    <>
        <h2 className="font-black text-3xl text-center">Listado Usuarios Eliminados</h2>

        <p className="text-xl mt-5 mb-10 text-center">
        Activa tus {' '}
        <span className="text-primary-600 font-bold">Usuarios</span>
        </p>

        {
            usuariosEliminados.map(usuario => (
                <Usuario
                    key={usuario.id_usuario}
                    usuario={usuario}
                />
            ))
        }
    </>
  )
}

export default ListaUsuariosEliminados;
