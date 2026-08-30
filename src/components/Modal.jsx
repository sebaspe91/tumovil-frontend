import { useEffect } from "react";

// Modal generico y reutilizable: cualquier pantalla lo puede usar para
// mostrar lo que sea (un formulario, una confirmacion, etc.) adentro de
// una ventana flotante en vez de tener que dejarlo siempre visible en la
// pagina.
//
// Props:
//   abierto  -> boolean: si es false, el modal ni siquiera se dibuja
//   onClose  -> funcion que se llama para cerrarlo (click afuera, la X, o Escape)
//   titulo   -> texto que va en el encabezado
//   children -> lo que se muestra adentro (en AdminUsers.jsx sera <FormularioUsers />)
function Modal({ abierto, onClose, titulo, children }) {

    // cerrar con la tecla Escape mientras el modal este abierto
    useEffect(() => {
        if (!abierto) return; // si el modal esta cerrado, no hace falta escuchar nada

        const cerrarConEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', cerrarConEscape);

        // "cleanup": cuando el modal se cierra (o el componente se
        // desmonta) hay que quitar el listener, si no se queda pegado
        // escuchando teclas para siempre
        return () => document.removeEventListener('keydown', cerrarConEscape);
    }, [abierto, onClose]);

    // si no esta abierto, el componente no renderiza nada (null = nada en el DOM)
    if (!abierto) return null;

    return (
        // Fondo oscuro que cubre toda la pantalla.
        // fixed inset-0  -> lo saca del flujo normal y lo estira a los 4 bordes de la ventana
        // bg-black/50    -> negro al 50% de opacidad (el "/50" es la opacidad en Tailwind)
        // z-[60]         -> por encima de todo lo demas (el Sidebar usa hasta z-50)
        // flex items-center justify-center -> centra la tarjeta blanca en medio de la pantalla
        <div
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={onClose} // click en el fondo oscuro = cerrar
        >
            {/* La tarjeta blanca del modal en si */}
            <div
                className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // evita que el click "suba" hasta el fondo y lo cierre sin querer
            >
                <div className="flex items-center justify-between p-5 border-b">
                    <h3 className="font-black text-xl text-primary-700">{titulo}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 text-2xl leading-none px-2"
                        aria-label="Cerrar"
                    >
                        &times;
                    </button>
                </div>

                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
