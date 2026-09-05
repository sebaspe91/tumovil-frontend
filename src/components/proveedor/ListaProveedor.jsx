import { useState } from "react";
import useProveedor from "../../hook/useProveedor";
import Proveedor from "./Proveedor";
import Paginacion from "../Paginacion";

function ListaProveedor() {

    const {proveedores, paginacionProveedor, busquedaProveedor, buscarProveedor, cambiarPaginaProveedor} = useProveedor();

    // cuando se clikea envia la peticion de busqueda al backend
    const [texto, setTexto] = useState(busquedaProveedor);

    // funcion
    const handleBuscar = e => {
        e.preventDefault();
        buscarProveedor(texto.trim());
    }

    const limpiarBusqueda = () => {
        setTexto('');
        buscarProveedor('');
    }

  return (
    <>
        <h2 className="font-black text-3xl text-center">Listado Proveedor</h2>

        <p className="text-xl mt-5 mb-6 text-center">
            Administra tus {' '}
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
                {busquedaProveedor && (
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

        {proveedores.length > 0 && (
            // cabecera de la "tabla": mismas columnas exactas que Cliente.jsx
            // (el grid-cols de aca y el de alla tienen que coincidir para que
            // quede todo alineado). Se oculta en movil -- con 8 columnas
            // angostas no cabe bien en una pantalla chica, ahi Cliente.jsx
            // pasa a formato de tarjeta apilada y esta cabecera no aplica
            <div className="hidden md:grid md:grid-cols-[60px_70px_1.2fr_1.2fr_1fr_1.4fr_1fr_110px] gap-4 items-center
                             bg-primary-700 text-white text-xs font-bold uppercase px-5 py-3 rounded-t-xl mx-5">
                <span></span>
                <span>ID</span>
                <span>Nombre</span>
                <span>Nit</span>
                <span>Correo</span>
                <span>Telefono</span>
                <span>Cuenta</span>
                <span className="text-right">Acciones</span>
            </div>
        )}

        {proveedores.length ? (
            <div className="md:border md:border-t-0 md:border-gray-200 md:rounded-b-xl md:overflow-hidden">
                {proveedores.map(proveedor => (
                    <Proveedor key={proveedor.id_proveedor} proveedor={proveedor} />
                ))}
            </div>
        ) : (
            <p className="text-xl mt-5 mb-10 text-center">
                {busquedaProveedor
                    ? <>No se encontraron Proveedores para {' '}<span className="text-primary-600 font-bold">"{busquedaProveedor}"</span></>
                    : <>No hay Proveedores registrados</>
                }
            </p>
        )}

        <Paginacion paginacion={paginacionProveedor} onCambiarPagina={cambiarPaginaProveedor} />
    </>
  )
}

export default ListaProveedor
