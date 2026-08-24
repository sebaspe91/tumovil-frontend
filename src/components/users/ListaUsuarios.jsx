import useUsers from "../../hook/useUsers";
import Usuario from "./Usuario";


function ListaUsuarios() {

    const {usuarios} = useUsers();

  return (
    <>
        {usuarios.length ?
            (
                <>
                    <h2 className="font-black text-3xl text-center">Listado Usuarios</h2>

                    <p className="text-xl mt-5 mb-10 text-center">
                    Administra tus {' '}
                    <span className="text-primary-600 font-bold">Usuarios</span>
                    </p>

                    {
                        usuarios.map(usuario => (
                            <Usuario 
                                key={usuario.id_usuario}
                                usuario={usuario}
                            />
                        ))
                    }
                </>
            ):
            (
                <>
                    <h2 className="font-black text-3xl text-center">No Hay Usuarios</h2>
                    <p className="text-xl mt-5 mb-10 text-center">
                    Comienza agregando Usuarios {' '}
                    <span className="text-primary-600 font-bold">y apareceran en este lugar</span>
                    </p>
                </>
            )  
        }
    </>
  )
}

export default ListaUsuarios;
