import { FaEdit, FaTrashAlt, FaCheckCircle } from 'react-icons/fa';
import useUsers from "../../hook/useUsers";


function Usuario({usuario}) {
    console.log(usuario)
    // extrameos las funciones para los votones
    const {setEditarUser, setEliminarUser, setActivarUser} = useUsers();

    const {nombre_user, apellido_user, cedula_user, correo_user, telefono_user} = usuario;

  return (
    <div className="mx-5 my-6 bg-white shadow-md p-5 rounded-xl text-primary-700">

        {/* Datos: apilados (titulo arriba, valor abajo) en movil.
            Desde md, en fila y con el valor al lado del titulo. */}
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-x-8 md:gap-y-2">

            <p>
                <span className="font-bold uppercase">Nombre:</span>{' '}
                <span className="block md:inline font-normal normal-case text-black">
                    {nombre_user} {apellido_user}
                </span>
            </p>

            <p>
                <span className="font-bold uppercase">Cedula:</span>{' '}
                <span className="block md:inline font-normal normal-case text-black">
                    {cedula_user}
                </span>
            </p>

            <p>
                <span className="font-bold uppercase">Email:</span>{' '}
                <span className="block md:inline font-normal normal-case text-black">
                    {correo_user}
                </span>
            </p>

            <p>
                <span className="font-bold uppercase">Tel:</span>{' '}
                <span className="block md:inline font-normal normal-case text-black">
                    {telefono_user ? telefono_user : 'N/A'}
                </span>
            </p>

        </div>

        {/* Botones: en su propia fila, siempre. Nunca compiten por espacio
            horizontal con los datos de arriba (esto es lo que evita que se
            salgan de la tarjeta). */}
        <div className="flex justify-end gap-4 mt-4">

            { usuario.estado_user ? (
                <>
                    <button
                        type="button"
                        title="Editar"
                        onClick={() => setEditarUser(usuario)}
                        className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 p-2 rounded-full transition-colors text-lg"
                    >
                        <FaEdit />
                    </button>

                    <button
                        type="button"
                        title="Eliminar"
                        onClick={() => setEliminarUser(usuario.id_usuario)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-full transition-colors text-lg"
                    >
                        <FaTrashAlt />
                    </button>
                </>
            ) :
            (
                <>
                    <button
                        type="button"
                        title="Activar"
                        onClick={() => setActivarUser(usuario.id_usuario)}
                        className="text-green-600 hover:text-green-800 hover:bg-green-50 p-2 rounded-full transition-colors text-lg"
                    >
                        <FaCheckCircle />
                    </button>
                </>
            )
            
            }

        </div>

    </div>
  )
}

export default Usuario;
