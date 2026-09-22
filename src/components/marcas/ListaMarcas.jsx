import { useState } from "react";
import useMarca from "../../hook/useMarca";
import Marca from "./Marca";
import Paginacion from "../Paginacion";

function ListaMarcas() {
    
    const {marcas, paginacionMarca, busquedaMarca, buscarMarca, cambiarPaginaMarca} = useMarca();

    const [texto, setTexto] = useState(busquedaMarca);

    const handleBuscar = (e) => {
        e.preventDefault();
        buscarMarca(texto.trim());
    }

    const limpiarBusqueda = () => {
        setTexto('');
        buscarMarca('');
    }

  return (
    <>
        <h2 className="font-black text-3xl text-center">Lista de Marcas</h2>

        <p className="text-xl mt-5 mb-6 text-center">
        Administra tus {' '}
        <span className="text-primary-600 font-bold">Marcas</span>
        </p>

        <form onSubmit={handleBuscar} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
            <input
                type="text"
                value={texto}
                onChange={e => setTexto(e.target.value)}
                placeholder="Buscar por nombre o codigo de la marca"
                className="border-2 flex-1 p-2 placeholder-gray-400 bg-gray-50 rounded-xl mx-2"
            />
            <div className="flex flex-col gap-2 md:flex-row mx-2">
                <button
                    type="submit"
                    className="bg-primary-600 text-white uppercase font-bold px-5 py-2 rounded-xl hover:bg-primary-800"
                >
                    Buscar
                </button>
                {busquedaMarca && (
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

        {/* encabezado del cuadro */}
        {marcas.length > 0 && (
            <div className="hidden md:grid md:grid-cols-[60px_70px_2fr_0.7fr_110px] gap-4 items-center text-center
                bg-primary-700 text-white text-xs font-bold uppercase px-5 py-3 rounded-t-xl mx-5">
                <span></span>
                <span>ID</span>
                <span>Marcas</span>
                <span>Codigos</span>
                <span className="text-right">Acciones</span>
            </div>
        )}

        {marcas.length ? (
            <div className="md:border md:border-t-0 md:border-gray-200 md:rounded-b-xl md:overflow-hidden">
                {marcas.map(marca => (
                    <Marca key={marca.id_marca} marca={marca} />
                ))}
            </div>
        ):(
            <p className="text-xl mt-5 mb-10 text-center">
                {busquedaMarca
                    ? <>No se encontraron Marcas para {' '}<span className="text-primary-600 font-bold">"{busquedaMarca}"</span></>
                    : <>No hay Marcas registrados</>
                }
            </p>
        )}

        <Paginacion paginacion={paginacionMarca} onCambiarPagina={cambiarPaginaMarca} />
    </>
  )
}

export default ListaMarcas
