// Controles de paginacion reutilizables. Vive aca (y no dentro de
// components/users/) a proposito: es un componente "tonto" que no sabe
// nada de usuarios, solo recibe numeros y una funcion para avisar cuando
// cambia de pagina -- por eso sirve igual para productos, clientes,
// proveedores o cualquier otra lista paginada que agregues despues,
// mientras el backend le responda con la misma forma de "paginacion".
//
// Props:
//   paginacion    -> { total, totalPaginas, paginaActual, limite } (lo que devuelve el backend)
//   onCambiarPagina -> funcion(numeroDePagina) que se llama al hacer click
function Paginacion({ paginacion, onCambiarPagina }) {
    const { total, totalPaginas, paginaActual } = paginacion;

    // si no hay resultados, o solo hay una pagina, no vale la pena mostrar botones
    if (total === 0 || totalPaginas <= 1) return null;

    const esPrimeraPagina = paginaActual <= 1;
    const esUltimaPagina = paginaActual >= totalPaginas;

    return (
        <div className="flex items-center justify-center gap-4 mt-6 mb-4">
            <button
                type="button"
                disabled={esPrimeraPagina}
                onClick={() => onCambiarPagina(paginaActual - 1)}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white font-bold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-primary-800"
            >
                Anterior
            </button>

            <span className="text-sm font-bold text-gray-600">
                Página {paginaActual} de {totalPaginas}
            </span>

            <button
                type="button"
                disabled={esUltimaPagina}
                onClick={() => onCambiarPagina(paginaActual + 1)}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white font-bold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-primary-800"
            >
                Siguiente
            </button>
        </div>
    );
}

export default Paginacion;
