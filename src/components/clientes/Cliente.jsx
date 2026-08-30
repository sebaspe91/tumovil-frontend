import { FaEdit, FaTrashAlt, FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import useClientes from '../../hook/useClientes';

function Cliente({cliente}) {

    const {setEditarCliente, setEliminarCliente, setActivarCliente} = useClientes();

    const {id_cliente, nombre_cliente, apellido_cliente, cedula_cliente, correo_cliente, telefono_cliente, estado_cli} = cliente;

  return (
    // el mismo div cambia de "flex flex-col" (movil, todo apilado) a
    // "grid" con columnas fijas (desde md) -- por eso los hijos de aca
    // abajo no cambian entre las dos vistas, solo cambia como el
    // contenedor los acomoda. Las columnas coinciden EXACTO con las de
    // la cabecera en ListaClientes.jsx para que todo quede alineado.
    <div className="flex flex-col md:grid md:grid-cols-[60px_70px_1.2fr_1.2fr_1fr_1.4fr_1fr_110px] gap-3 md:gap-4 md:items-center
                     mx-5 my-4 md:my-0 bg-white shadow-md md:shadow-none p-5 md:p-0 rounded-xl md:rounded-none
                     md:border-b md:border-gray-100 md:px-5 md:py-3 md:hover:bg-gray-50 md:transition-colors text-primary-700">

        {/* avatar: solo aparece en la vista de tabla (md en adelante) */}
        <div className="hidden md:flex items-center justify-center text-gray-300 text-2xl">
            <FaUserCircle />
        </div>

        {/* ID: tambien solo en la vista de tabla */}
        <div className="hidden md:block text-sm text-gray-400 font-mono">
            #{id_cliente}
        </div>

        {/* Nombre */}
        <p>
            <span className="font-bold uppercase text-xs text-gray-500 md:hidden">Nombre: </span>
            <span className="md:font-semibold">{nombre_cliente}</span>
        </p>

        {/* Apellidos */}
        <p>
            <span className="font-bold uppercase text-xs text-gray-500 md:hidden">Apellidos: </span>
            <span>{apellido_cliente}</span>
        </p>

        {/* Cedula */}
        <p>
            <span className="font-bold uppercase text-xs text-gray-500 md:hidden">Cédula: </span>
            <span>{cedula_cliente || 'N/A'}</span>
        </p>

        {/* Correo: "truncate" en la vista de tabla para que un correo
            largo no rompa el ancho de la columna -- se corta con "..." */}
        <p className="md:truncate">
            <span className="font-bold uppercase text-xs text-gray-500 md:hidden">Correo: </span>
            <span>{correo_cliente || 'N/A'}</span>
        </p>

        {/* Telefono */}
        <p>
            <span className="font-bold uppercase text-xs text-gray-500 md:hidden">Teléfono: </span>
            <span>{telefono_cliente || 'N/A'}</span>
        </p>

        {/* Acciones: mismo patron que en Usuario.jsx -- Editar/Eliminar
            si el cliente esta activo, Activar si esta eliminado */}
        {estado_cli ? (
            <div className="flex md:justify-end gap-2 mt-1 md:mt-0">
                <button
                    type="button"
                    title="Editar"
                    onClick={() => setEditarCliente(cliente)}
                    className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-md transition-colors"
                >
                    <FaEdit />
                </button>

                <button
                    type="button"
                    title="Eliminar"
                    onClick={() => setEliminarCliente(id_cliente)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                >
                    <FaTrashAlt />
                </button>
            </div>
        ) : (
            <div className="flex md:justify-end mt-1 md:mt-0">
                <button
                    type="button"
                    title="Activar"
                    onClick={() => setActivarCliente(id_cliente)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-bold"
                >
                    <FaCheckCircle />
                    <span>Activar</span>
                </button>
            </div>
        )}

    </div>
  )
}

export default Cliente;
