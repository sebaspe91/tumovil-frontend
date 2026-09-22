import { FaEdit, FaTrashAlt, FaCheckCircle, FaCertificate } from 'react-icons/fa';
import CampoCopiable from '../CampoCopiable';
import useMarca from '../../hook/useMarca';

function Marca({marca}) {

    const {setEditarMarca, setEliminarMarca, setActivarMarca} = useMarca();

    const {id_marca, nombre_marca, codigo_marca, estado_marca} = marca;

  return (
    <div className='flex flex-col md:grid md:grid-cols-[60px_70px_2fr_0.7fr_110px]  gap-3 md:gap-4 md:items-center
        mx-5 my-4 md:my-0 bg-white shadow-md md:shadow-none p-5 md:p-0 rounded-xl md:rounded-none
        md:border-b md:border-gray-100 md:px-5 md:py-3 md:hover:bg-gray-50 md:transition-colors text-primary-700'>
      
      {/* icono */}
      <div className="hidden md:flex items-center justify-center text-gray-300 text-2xl">
        <FaCertificate />
      </div>
      
      <div className="hidden md:block md:min-w-0 text-sm text-gray-400 font-mono text-center">
        #{id_marca}
      </div>

      <p className="md:min-w-0 text-center font-bold">
        <span className="font-bold uppercase text-xs text-gray-500 md:hidden text-center">Nombre: </span>
        {nombre_marca}
      </p>

      <p className="md:min-w-0 text-center font-bold">
        <span className="font-bold uppercase text-xs text-gray-500 md:hidden text-center">Codigo: </span>
        {codigo_marca}
      </p>

      {/* botones */}
      {estado_marca ? (
            <div className="flex md:justify-end gap-2 mt-1 md:mt-0">
                <button
                    type="button"
                    title="Editar"
                    onClick={() => setEditarMarca(marca)}
                    className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-md transition-colors"
                >
                    <FaEdit />
                </button>

                <button
                    type="button"
                    title="Eliminar"
                    onClick={() => setEliminarMarca(id_marca)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                >
                    <FaTrashAlt />
                </button>
            </div>
      ):(
            <div className="flex md:justify-end mt-1 md:mt-0">
                <button
                    type="button"
                    title="Activar"
                    onClick={() => setActivarMarca(id_marca)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-bold"
                >
                    <FaCheckCircle />
                </button>
            </div>
      )}
    </div>
  )
}

export default Marca
