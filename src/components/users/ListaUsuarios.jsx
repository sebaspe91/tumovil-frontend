import { useState } from "react";
import useUsers from "../../hook/useUsers";
import Usuario from "./Usuario";
import Paginacion from "../Paginacion";

function ListaUsuarios() {

    const {usuarios, paginacion, busqueda, buscarUsuarios, cambiarPagina} = useUsers();

    // texto que se ve mientras se escribe en el input. Es distinto de
    // "busqueda" (la que vive en el contexto): "busqueda" es la que ya se
    // envio al backend, "texto" es lo que hay en el input en este momento.
    // Si fueran el mismo estado, cada letra que el usuario escriba
    // dispararia una peticion al backend -- separandolos, la peticion solo
    // sale cuando se envia el formulario (Enter o el boton Buscar).
    const [texto, setTexto] = useState(busqueda);

    const handleBuscar = (e) => {
        e.preventDefault();
        buscarUsuarios(texto.trim());
    }

    const limpiarBusqueda = () => {
        setTexto('');
        buscarUsuarios('');
    }

  return (
    <>
        <h2 className="font-black text-3xl text-center">Listado Usuarios</h2>

        <p className="text-xl mt-5 mb-6 text-center">
        Administra tus {' '}
        <span className="text-primary-600 font-bold">Usuarios</span>
        </p>

        {/* Buscador: filtra por nombre, apellido, cedula o correo. La
            busqueda real se hace en el backend (ver usuarioController.js),
            aca solo mandamos el texto. */}
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
                {busqueda && (
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

        {usuarios.length ? (
            usuarios.map(usuario => (
                <Usuario
                    key={usuario.id_usuario}
                    usuario={usuario}
                />
            ))
        ) : (
            <>
                {busqueda ? (
                    <p className="text-xl mt-5 mb-10 text-center">
                        No se encontraron usuarios para {' '}
                        <span className="text-primary-600 font-bold">"{busqueda}"</span>
                    </p>
                ) : (
                    <>
                        <h2 className="font-black text-3xl text-center">No Hay Usuarios</h2>
                        <p className="text-xl mt-5 mb-10 text-center">
                        Comienza agregando Usuarios {' '}
                        <span className="text-primary-600 font-bold">y apareceran en este lugar</span>
                        </p>
                    </>
                )}
            </>
        )}

        <Paginacion paginacion={paginacion} onCambiarPagina={cambiarPagina} />
    </>
  )
}

export default ListaUsuarios;
