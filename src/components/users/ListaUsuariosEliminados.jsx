import { useState } from "react";
import useUsers from "../../hook/useUsers";
import Usuario from "./Usuario";
import Paginacion from "../Paginacion";

function ListaUsuariosEliminados() {

    const {
        usuariosEliminados,
        paginacionEliminados,
        busquedaEliminados,
        buscarUsuariosEliminados,
        cambiarPaginaEliminados
    } = useUsers();

    // mismo patron que en ListaUsuarios.jsx: el texto del input es local,
    // solo se convierte en busqueda de verdad (y dispara la peticion al
    // backend) cuando se envia el formulario
    const [texto, setTexto] = useState(busquedaEliminados);

    const handleBuscar = (e) => {
        e.preventDefault();
        buscarUsuariosEliminados(texto.trim());
    }

    const limpiarBusqueda = () => {
        setTexto('');
        buscarUsuariosEliminados('');
    }

  return (
    <>
        <h2 className="font-black text-3xl text-center">Listado Usuarios Eliminados</h2>

        <p className="text-xl mt-5 mb-6 text-center">
        Activa tus {' '}
        <span className="text-primary-600 font-bold">Usuarios</span>
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
                {busquedaEliminados && (
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

        {usuariosEliminados.length ? (
            usuariosEliminados.map(usuario => (
                <Usuario
                    key={usuario.id_usuario}
                    usuario={usuario}
                />
            ))
        ) : (
            <p className="text-xl mt-5 mb-10 text-center">
                {busquedaEliminados
                    ? <>No se encontraron usuarios eliminados para {' '}<span className="text-primary-600 font-bold">"{busquedaEliminados}"</span></>
                    : <>No hay usuarios eliminados</>
                }
            </p>
        )}

        <Paginacion paginacion={paginacionEliminados} onCambiarPagina={cambiarPaginaEliminados} />
    </>
  )
}

export default ListaUsuariosEliminados;
