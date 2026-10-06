import { useEffect, useRef } from 'react';

// =====================================================================
//  useRefrescarAlVolver -- vuelve a pedir los datos cuando regresas a la pestana
// =====================================================================
// Problema que resuelve: el historial de facturas solo pide los datos cuando
// ENTRAS a la pagina. Si dejas el historial abierto en una pestana, generas una
// factura en OTRA pestana y vuelves, la lista seguia mostrando lo viejo.
// Este hook escucha cuando la pestana vuelve a estar visible (o la ventana
// recupera el foco) y llama a la funcion "refrescar" que le pases.
//
// Uso:  useRefrescarAlVolver(refrescarFacturas);
const useRefrescarAlVolver = refrescar => {
    // PASO 1 -- guardamos la ULTIMA version de "refrescar" en una referencia.
    // Asi el listener (que se registra una sola vez) siempre llama a la version
    // actual, con la pagina y los filtros que el usuario tiene en este momento.
    const refrescarRef = useRef(refrescar);

    useEffect(() => {
        refrescarRef.current = refrescar;
    });

    // PASO 2 -- registramos los listeners UNA sola vez (por eso el [] al final)
    useEffect(() => {
        let ultimaVez = 0;

        const alVolver = () => {
            // si la pestana sigue oculta no se hace nada
            if (document.visibilityState !== 'visible') return;

            // "visibilitychange" y "focus" suelen dispararse casi juntos al volver:
            // este candado evita pedir los datos dos veces seguidas
            const ahora = Date.now();
            if (ahora - ultimaVez < 1000) return;
            ultimaVez = ahora;

            refrescarRef.current();
        };

        document.addEventListener('visibilitychange', alVolver);
        window.addEventListener('focus', alVolver);

        // PASO 3 -- al salir de la pagina se quitan los listeners (si no, quedarian
        // pegados y seguirian pidiendo datos de una pagina que ya no existe)
        return () => {
            document.removeEventListener('visibilitychange', alVolver);
            window.removeEventListener('focus', alVolver);
        };
    }, []);
};

export default useRefrescarAlVolver;
