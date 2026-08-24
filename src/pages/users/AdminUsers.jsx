import { useState } from "react";
import FormularioUsers from "../../components/users/FormularioUsers";
import ListaUsuarios from "../../components/users/ListaUsuarios";
import useUsers from "../../hook/useUsers";

function AdminUsers() {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const {usuario} = useUsers(); // usuario seleccionado para editar (o {} si es "nuevo")
  return (
    <>
      <div className="flex flex-col md:flex-row gap-10">
            <button
                type='button'
                className='bg-primary-600 text-center text-white uppercase font-bold mx-10 p-3 rounded-md hover:bg-primary-800 md:hidden'
                onClick={() => {setMostrarFormulario(!mostrarFormulario) /* Colocamos aca lo contrario del valor de mostrar formulario si esta en true pasa a false*/}}
            >
                {mostrarFormulario ? 'Ocultar Formulario' : 'Mostrar Formulario'}
            </button>

            <div className={`${mostrarFormulario ? 'block' : 'hidden' } md:block md:w-1/2 lg:w-2/5 lg:pl-5`}>
                {/* 
                    key fuerza a React a montar un FormularioUsers nuevo cada vez
                    que cambia el usuario a editar (o vuelve a "nuevo"), en vez de
                    reusar la misma instancia y tener que sincronizarla con un efecto 
                */}
                <FormularioUsers key={usuario?.id_usuario ?? 'nuevo'} />
            </div>

            <div className="md:w-1/2 lg:w-3/5">
                <ListaUsuarios />
            </div>
      </div>
    </>
  )
}

export default AdminUsers;
