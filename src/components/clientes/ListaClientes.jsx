import { useState } from "react";
import useClientes from "../../hook/useClientes";
import Cliente from "./Cliente";
import Paginacion from "../Paginacion";

function ListaClientes() {

    const {clientes, paginacionCliente, busquedaCliente, buscarCliente, cambiarPaginaCliente} = useClientes();

    // mismo patron que ListaUsuarios.jsx: el texto del input es local,
    // solo se convierte en busqueda de verdad (y dispara la peticion al
    // backend) cuando se envia el formulario
    const [texto, setTexto] = useState(busquedaCliente);

    const handleBuscar = (e) => {
        e.preventDefault();
        buscarCliente(texto.trim());
    }

    const limpiarBusqueda = () => {
        setTexto('');
        buscarCliente('');
    }

  return (
    <>
        <h2 className="font-black text-3xl text-center">Listado Clientes</h2>

        <p className="text-xl mt-5 mb-6 text-center">
        Administra tus {' '}
        <span className="text-primary-600 font-bold">Clientes</span>
        </p>

        <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
            <input
                type="text"
                value={texto}
                onChange={e => setTexto(e.target.value)}
                placeholder="Buscar por nombre, apellido, cédula o correo..."
                className="border-2 flex-1 p-2 placeholder-gray-400 bg-gray-50 rounded-xl"
            />
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="bg-primary-600 text-white uppercase font-bold px-5 py-2 rounded-xl hover:bg-primary-800"
                >
                    Buscar
                </button>
                {busquedaCliente && (
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

        {clientes.length > 0 && (
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
                <span>Apellidos</span>
                <span>Cédula</span>
                <span>Correo</span>
                <span>Teléfono</span>
                <span className="text-right">Acciones</span>
            </div>
        )}

        {clientes.length ? (
            <div className="md:border md:border-t-0 md:border-gray-200 md:rounded-b-xl md:overflow-hidden">
                {clientes.map(cliente => (
                    <Cliente key={cliente.id_cliente} cliente={cliente} />
                ))}
            </div>
        ) : (
            <p className="text-xl mt-5 mb-10 text-center">
                {busquedaCliente
                    ? <>No se encontraron clientes para {' '}<span className="text-primary-600 font-bold">"{busquedaCliente}"</span></>
                    : <>No hay clientes registrados</>
                }
            </p>
        )}

        <Paginacion paginacion={paginacionCliente} onCambiarPagina={cambiarPaginaCliente} />
    </>
  )
}

export default ListaClientes;
