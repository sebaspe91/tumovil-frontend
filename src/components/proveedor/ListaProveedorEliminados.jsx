import { useState } from "react";
import useProveedor from "../../hook/useProveedor";
import Proveedor from "./Proveedor";
import Paginacion from "../Paginacion";

function ListaProveedorEliminados() {

    const {proveedoresEliminados, PaginacionProveedorEliminados, busquedaProveedorEliminados, buscarProveedorEliminados, cambiarPaginaProveedorEliminados} = useProveedor();

    const [texto, setTexto] = useState(busquedaProveedorEliminados);

    const handleBuscar = (e) => {
        e.preventDefault();
        buscarProveedorEliminados(texto.trim());
    }

    const limpiarBusqueda = () => {
        setTexto('');
        buscarProveedorEliminados('');
    }

  return (
    <>
        <h2 className="font-black text-3xl text-center">Listado Proveedores Eliminados</h2>

        <p className="text-xl mt-5 mb-6 text-center">
        Recupera tus {' '}
        <span className="text-primary-600 font-bold">Proveedores</span>
        </p>

        <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
            <input
                type="text"
                value={texto}
                onChange={e => setTexto(e.target.value)}
                placeholder="Buscar por nombre, Nit, correo, telefono o cuenta..."
                className="border-2 flex-1 p-2 placeholder-gray-400 bg-gray-50 rounded-xl mx-2"
            />
            <div className="flex flex-col gap-2 md:flex-row mx-2">
                <button
                    type="submit"
                    className="bg-primary-600 text-white uppercase font-bold px-5 py-2 rounded-xl hover:bg-primary-800"
                >
                    Buscar
                </button>
                {busquedaProveedorEliminados && (
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

        {proveedoresEliminados.length > 0 && (

            <div className="hidden md:grid md:grid-cols-[60px_70px_1.2fr_1.2fr_1fr_1.4fr_1fr_110px] gap-4 items-center
                             bg-primary-700 text-white text-xs font-bold uppercase px-5 py-3 rounded-t-xl mx-5">
                <span></span>
                <span>ID</span>
                <span>Nombre</span>
                <span>Nit</span>
                <span>Correo</span>
                <span>Telefono</span>
                <span>Cuenta</span>
                <span className="text-right">Acción</span>
            </div>
        )}

        {proveedoresEliminados.length ? (
            <div className="md:border md:border-t-0 md:border-gray-200 md:rounded-b-xl md:overflow-hidden">
                {proveedoresEliminados.map(proveedor => (
                    <Proveedor key={proveedor.id_proveedor} proveedor={proveedor} />
                ))}
            </div>
        ) : (
            <p className="text-xl mt-5 mb-10 text-center">
                {busquedaProveedorEliminados
                    ? <>No se encontraron Proveedores para {' '}<span className="text-primary-600 font-bold">"{busquedaProveedorEliminados}"</span></>
                    : <>No hay Proveedores Eliminados</>
                }
            </p>
        )}

        <Paginacion paginacion={PaginacionProveedorEliminados} onCambiarPagina={cambiarPaginaProveedorEliminados} />
    </>
  )
}

export default ListaProveedorEliminados
