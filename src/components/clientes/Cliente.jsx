import { FaEdit, FaTrashAlt, FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import CampoCopiable from '../CampoCopiable';
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
    <div className="flex flex-col md:grid md:grid-cols-[60px_70px_1.1fr_1.1fr_0.7fr_1.8fr_0.8fr_110px] gap-3 md:gap-4 md:items-center
                     mx-5 my-4 md:my-0 bg-white shadow-md md:shadow-none p-5 md:p-0 rounded-xl md:rounded-none
                     md:border-b md:border-gray-100 md:px-5 md:py-3 md:hover:bg-gray-50 md:transition-colors text-primary-700">

        {/* avatar: solo aparece en la vista de tabla (md en adelante) */}
        <div className="hidden md:flex items-center justify-center text-gray-300 text-2xl">
            <FaUserCircle />
        </div>

        {/* ID: tambien solo en la vista de tabla */}
        <div className="hidden md:block md:min-w-0 text-sm text-gray-400 font-mono">
            #{id_cliente}
        </div>

        {/* Nombre: CampoCopiable con negrilla (claseTexto) para que se
            vea igual que antes, pero ahora tambien se puede copiar */}
        <p className="md:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 md:hidden">Nombre: </span>
            <CampoCopiable texto={nombre_cliente} claseTexto="md:font-semibold" />
        </p>

        {/* Apellidos */}
        <p className="md:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 md:hidden">Apellidos: </span>
            <CampoCopiable texto={apellido_cliente} />
        </p>

        {/* Cedula */}
        <p className="md:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 md:hidden">Cédula: </span>
            <CampoCopiable texto={cedula_cliente} />
        </p>

        {/* Correo: ahora usa CampoCopiable -- corta el texto largo con "...",
            muestra el valor completo al pasar el mouse (title) y deja
            copiarlo al portapapeles con el iconito */}
        <p className="md:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 md:hidden">Correo: </span>
            <CampoCopiable texto={correo_cliente} />
        </p>

        {/* Telefono */}
        <p className="md:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 md:hidden">Teléfono: </span>
            <CampoCopiable texto={telefono_cliente} />
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
                </button>
            </div>
        )}

    </div>
  )
}

export default Cliente;
