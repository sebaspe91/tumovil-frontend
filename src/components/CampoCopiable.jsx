import { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

// Componente reutilizable para un campo de texto que se puede cortar (correo,
// cuenta, etc). Resuelve dos cosas a la vez:
//   1) "title" en el texto -> el navegador muestra el valor completo al
//      pasar el mouse por encima (tooltip nativo, sin JS).
//   2) Un icono de copiar al lado -> con un click copia el valor completo
//      al portapapeles, sin tener que seleccionarlo a mano.
//
// Props:
//   texto      -> el valor a mostrar y copiar (ej: el correo del cliente)
//   claseTexto -> clases extra opcionales para el texto (ej: negrilla en
//                 Nombre). Si no se manda, el texto se ve "normal".
function CampoCopiable({ texto, claseTexto = '' }) {

    // controla si mostramos el icono de "copiar" o el de "listo" (check verde)
    const [copiado, setCopiado] = useState(false);

    const copiar = async () => {
        if (!texto) return; // no hay nada que copiar (esta en "N/A")

        try {
            // metodo para copiar texto
            await navigator.clipboard.writeText(texto);
            setCopiado(true);

            // despues de 1.5 segundos volvemos a mostrar el icono normal
            setTimeout(() => setCopiado(false), 1500);
        } catch (error) {
            console.log('No se pudo copiar al portapapeles', error);
        }
    }

    return (
        <span className="flex items-center gap-1 min-w-0">
            {/* el texto: "truncate" lo corta con "...", "title" muestra el
                valor completo al pasar el mouse encima */}
            <span className={`truncate ${claseTexto}`} title={texto || ''}>
                {texto || 'N/A'}
            </span>

            {/* el boton de copiar solo aparece si hay algo que copiar */}
            {texto && (
                <button
                    type="button"
                    onClick={copiar}
                    title={copiado ? '¡Copiado!' : 'Copiar'}
                    className="shrink-0 text-gray-400 hover:text-primary-600 transition-colors"
                >
                    {copiado ? <FaCheck className="text-green-600" /> : <FaCopy />}
                </button>
            )}
        </span>
    )
}

export default CampoCopiable;
