import { FaEdit, FaTrashAlt, FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import CampoCopiable from '../CampoCopiable';
import useProveedor from '../../hook/useProveedor';

function Proveedor({proveedor}) {

    const {setEditarProveedor, setEliminarProveedor, setActivarProveedor} = useProveedor();

    const {id_proveedor, nombre_prov, nit_prov, correo_prov, telefono_prov, cuenta_prov, estado_prov} = proveedor;

  return (
    <div className="flex flex-col md:grid md:grid-cols-[60px_70px_1.2fr_0.7fr_1.8fr_0.8fr_1fr_110px] gap-3 md:gap-4 md:items-center md:text-center
                     mx-5 my-4 md:my-0 bg-white shadow-md md:shadow-none p-5 md:p-0 rounded-xl md:rounded-none
                     md:border-b md:border-gray-100 md:px-5 md:py-3 md:hover:bg-gray-50 md:transition-colors text-primary-700">

        {/* avatar: solo aparece en la vista de tabla (md en adelante) */}
        <div className="hidden md:flex items-center justify-center text-gray-300 text-2xl">
            <FaUserCircle />
        </div>

        {/* ID: tambien solo en la vista de tabla */}
        <div className="hidden md:block md:min-w-0 text-sm text-gray-400 font-mono">
            #{id_proveedor}
        </div>

        {/* Nombre: CampoCopiable con negrilla (claseTexto) para que se
            vea igual que antes, pero ahora tambien se puede copiar */}
        <p className="md:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 md:hidden">Nombre: </span>
            <CampoCopiable texto={nombre_prov} claseTexto="md:font-semibold" />
        </p>

        {/* Nit */}
        <p className="md:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 md:hidden">Nit: </span>
            <CampoCopiable texto={nit_prov} />
        </p>

        {/* Correo: CampoCopiable -- corta el texto largo, muestra el valor
            completo al pasar el mouse y deja copiarlo con el iconito */}
        <p className="md:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 md:hidden">Correo: </span>
            <CampoCopiable texto={correo_prov} />
        </p>

        {/* Telefono */}
        <p className="md:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 md:hidden">Telefono: </span>
            <CampoCopiable texto={telefono_prov} />
        </p>

        {/* Cuenta: mismo CampoCopiable */}
        <p className="md:min-w-0">
            <span className="font-bold uppercase text-xs text-gray-500 md:hidden">Cuenta: </span>
            <CampoCopiable texto={cuenta_prov} />
        </p>

        {/* Acciones: mismo patron que en Usuario.jsx -- Editar/Eliminar
            si el cliente esta activo, Activar si esta eliminado */}
        {estado_prov ? (
            <div className="flex md:justify-end gap-2 mt-1 md:mt-0">
                <button
                    type="button"
                    title="Editar"
                    onClick={() => setEditarProveedor(proveedor)}
                    className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-md transition-colors"
                >
                    <FaEdit />
                </button>

                <button
                    type="button"
                    title="Eliminar"
                    onClick={() => setEliminarProveedor(id_proveedor)}
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
                    onClick={() => setActivarProveedor(id_proveedor)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-bold"
                >
                    <FaCheckCircle />
                </button>
            </div>
        )}

    </div>
  )
}

export default Proveedor
