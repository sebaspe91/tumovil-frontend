import { useState } from "react";
import useClientes from "../../hook/useClientes";
import Cliente from "./Cliente";
import Paginacion from "../Paginacion";


function ListaClientesEliminados() {

    const {clientesEliminados, paginacionClienteEliminados, busquedaClienteEliminados, buscarClienteEliminados, cambiarPaginaClienteEliminados} = useClientes();

    const [texto, setTexto] = useState(busquedaClienteEliminados);

    const handleBuscar = (e) => {
        e.preventDefault();
        buscarClienteEliminados(texto.trim());
    }

    const limpiarBusqueda = () => {
        setTexto('');
        buscarClienteEliminados('');
    }

  return (
    <>
        <h2 className="font-black text-3xl text-center">Listado Clientes Eliminados</h2>

        <p className="text-xl mt-5 mb-6 text-center">
        Recupera tus {' '}
        <span className="text-primary-600 font-bold">Clientes</span>
        </p>

        <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
            <input
                type="text"
                value={texto}
                onChange={e => setTexto(e.target.value)}
                placeholder="Buscar por nombre, apellido, cédula o correo..."
                className="border-2 flex-1 p-2 placeholder-gray-400 bg-gray-50 rounded-xl mx-2"
            />
            <div className="flex flex-col gap-2 md:flex-row mx-2">
                <button
                    type="submit"
                    className="bg-primary-600 text-white uppercase font-bold px-5 py-2 rounded-xl hover:bg-primary-800"
                >
                    Buscar
                </button>
                {busquedaClienteEliminados && (
                    <button
                        type="button"
                        onClick={limpiarBusqueda}
                        className="border-2 text-gray-600 uppercase font-bold px-5 py-2 rounded-xl hover:bg-gray-100"
                    >
                        Limpiar
                    </button>
                )}
            </div>
        </form>

        {clientesEliminados.length > 0 && (

            <div className="hidden md:grid md:grid-cols-[60px_70px_1.2fr_1.2fr_1fr_1.4fr_1fr_110px] gap-4 items-center
                             bg-primary-700 text-white text-xs font-bold uppercase px-5 py-3 rounded-t-xl mx-5">
                <span></span>
                <span>ID</span>
                <span>Nombre</span>
                <span>Apellidos</span>
                <span>Cédula</span>
                <span>Correo</span>
                <span>Teléfono</span>
                <span className="text-right">Acción</span>
            </div>
        )}

        {clientesEliminados.length ? (
            <div className="md:border md:border-t-0 md:border-gray-200 md:rounded-b-xl md:overflow-hidden">
                {clientesEliminados.map(cliente => (
                    <Cliente key={cliente.id_cliente} cliente={cliente} />
                ))}
            </div>
        ) : (
            <p className="text-xl mt-5 mb-10 text-center">
                {busquedaClienteEliminados
                    ? <>No se encontraron clientes para {' '}<span className="text-primary-600 font-bold">"{busquedaClienteEliminados}"</span></>
                    : <>No hay clientes Eliminados</>
                }
            </p>
        )}

        <Paginacion paginacion={paginacionClienteEliminados} onCambiarPagina={cambiarPaginaClienteEliminados} />
    </>
  )
}

export default ListaClientesEliminados
