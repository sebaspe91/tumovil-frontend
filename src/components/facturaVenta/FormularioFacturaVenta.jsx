import { useState } from "react";
import useFacturaVenta from "../../hook/useFacturaVenta";
import Alerta from "../Alerta";
import SeleccionarClienteModal from "../clientes/SeleccionarClienteModal";
import SeleccionarProductoModal from "../productos/SeleccionarProductoModal";

function FormularioFacturaVenta() {

    const { guardarFactura, descargarPDF, alerta, setAlerta } = useFacturaVenta();

    // el cliente elegido para esta factura
    const [clienteElegido, setClienteElegido] = useState(null);
    const [modalSeleccionarCliente, setModalSeleccionarCliente] = useState(false);

    // el "carrito": cada linea es { producto, cantidad }
    const [lineas, setLineas] = useState([]);
    const [modalSeleccionarProducto, setModalSeleccionarProducto] = useState(false);

    const handleElegirCliente = cliente => {
        setClienteElegido(cliente);
        setModalSeleccionarCliente(false);
    }

    // "productosElegidos" es un array de { producto, cantidad } -- ahora el
    // selector deja marcar VARIOS productos de una sola vez (cada uno con su
    // propia cantidad), asi que aca hay que recorrerlos todos. Si alguno ya
    // estaba en el carrito, se le SUMA la cantidad elegida (sin pasarse del
    // stock); si no estaba, se agrega como linea nueva. El modal ya se cierra
    // solo (ver SeleccionarProductoModal.jsx), aca no hace falta cerrarlo
    const handleAgregarProductos = productosElegidos => {
        setLineas(anteriores => {
            let lineas = [...anteriores];

            productosElegidos.forEach(({ producto, cantidad }) => {
                const indice = lineas.findIndex(linea => linea.producto.id_producto === producto.id_producto);

                if (indice === -1) {
                    lineas.push({ producto, cantidad });
                } else {
                    const cantidadNueva = Math.min(lineas[indice].cantidad + cantidad, producto.cantidad_prod);
                    lineas[indice] = { ...lineas[indice], cantidad: cantidadNueva };
                }
            });

            return lineas;
        });
    }

    // mientras se escribe se deja el campo TAL CUAL esta (incluso vacio):
    // si se corrigiera en cada tecla, al borrar el numero quedaba vacio un
    // instante y la validacion lo convertia en "1" de una vez (Number('')
    // es 0, y "0 || 1" da 1), entonces no se podia borrar el 1 para
    // escribir otro numero. Ahora se corrige (minimo 1, maximo el stock)
    // recien cuando se SALE del campo, en "corregirCantidad"
    const handleCambiarCantidad = (idProducto, valor) => {
        // solo se aceptan numeros o el campo vacio (mientras se escribe)
        if (valor !== '' && !/^\d+$/.test(valor)) return;

        setLineas(anteriores => anteriores.map(linea =>
            linea.producto.id_producto === idProducto
                ? { ...linea, cantidad: valor }
                : linea
        ));
    }

    // se llama cuando el campo de cantidad pierde el foco (onBlur): aca se
    // corrige de una vez si quedo vacio o en 0 (minimo 1).
    // OJO: ya NO se recorta al stock. Antes, si escribias una cantidad mayor al
    // stock, al salir del campo se cambiaba sola y el usuario no entendia por que.
    // Ahora el campo se queda en ROJO con un mensaje (ver "excedeStock" mas abajo)
    // y no se puede generar la factura hasta corregirlo.
    const corregirCantidad = idProducto => {
        setLineas(anteriores => anteriores.map(linea => {
            if (linea.producto.id_producto !== idProducto) return linea;

            const cantidad = Math.max(1, Number(linea.cantidad) || 1);
            return { ...linea, cantidad };
        }));
    }

    // la cantidad escrita es MAYOR que el stock disponible de ese producto?
    const excedeStock = linea => Number(linea.cantidad) > linea.producto.cantidad_prod;

    // boton "Usar maximo": deja la cantidad en el stock disponible
    const handleUsarMaximo = idProducto => {
        setLineas(anteriores => anteriores.map(linea =>
            linea.producto.id_producto === idProducto
                ? { ...linea, cantidad: linea.producto.cantidad_prod }
                : linea
        ));
    }

    const hayExceso = lineas.some(excedeStock);

    const handleQuitarLinea = idProducto => {
        setLineas(anteriores => anteriores.filter(linea => linea.producto.id_producto !== idProducto));
    }

    const total = lineas.reduce((acumulado, linea) => acumulado + ((Number(linea.cantidad) || 0) * linea.producto.precio_venta), 0);

    // OJO: esto YA NO es el onSubmit de un <form> -- ver el comentario
    // grande mas abajo, junto al <div> que reemplazo al <form>, para la
    // explicacion completa de por que se cambio
    const handleSubmit = async () => {
        if (!clienteElegido) {
            setAlerta({ msg: 'Debe seleccionar un cliente', error: true });
            return;
        }

        if (lineas.length === 0) {
            setAlerta({ msg: 'Debe agregar al menos un producto', error: true });
            return;
        }

        // si alguna cantidad supera el stock no se manda nada al backend
        if (hayExceso) {
            setAlerta({ msg: 'Hay productos con una cantidad mayor al stock disponible (marcados en rojo)', error: true });
            return;
        }

        setAlerta({});

        const datos = {
            cliente_id: clienteElegido.id_cliente,
            productos: lineas.map(linea => ({
                producto_dc_id: linea.producto.id_producto,
                cantidad_dc_venta: Math.max(1, Math.min(Number(linea.cantidad) || 1, linea.producto.cantidad_prod))
            }))
        };

        const resultado = await guardarFactura(datos);

        // si el backend responde con error (ej. no alcanza el stock), se
        // deja el formulario abierto con los datos para que el usuario corrija
        if (resultado?.error) {
            setAlerta(resultado);
            return;
        }

        // la factura ya se guardo -- ahora, de una vez, se descarga el PDF.
        // "descargarPDF" espera a que el navegador reciba el archivo antes
        // de seguir, por eso el "await"
        setAlerta({ msg: 'Factura generada, descargando PDF...' });

        if (resultado.facturaId) {
            await descargarPDF(resultado.facturaId);
        }

        // se limpia el formulario (cliente y carrito) para poder registrar
        // la siguiente factura de una vez, sin salir de esta pagina
        setTimeout(() => {
            setClienteElegido(null);
            setLineas([]);
            setAlerta({});
        }, 1500);
    }

    const { msg } = alerta;

    // Antes este contenedor era un <form onSubmit={handleSubmit}>. El
    // problema: adentro (en SeleccionarClienteModal, dentro del modal
    // anidado para "crear cliente nuevo") hay OTRO <form>, el de
    // FormularioCliente -- y el buscador de SeleccionarModal tambien usa
    // su propio <form>. Un <form> no puede ir dentro de otro <form> (es
    // invalido en HTML), y el navegador se comporta de forma rara cuando
    // pasa: al hacer click en "Registrar Cliente" (el submit del form de
    // ADENTRO), el evento tambien disparaba el onSubmit de ESTE form de
    // afuera -- que revisaba "hay cliente elegido?", no habia ninguno
    // todavia (se estaba creando), y cortaba ahi mismo sin que se notara
    // nada raro en pantalla (esa alerta quedaba atras del modal). Por eso
    // el cliente nuevo no se guardaba. La solucion es simple: ESTE
    // contenedor ya no es un <form>, es un <div> comun, y el boton de
    // abajo ya no es "type=submit" sino un boton normal con onClick. Asi
    // no hay ningun <form> por fuera que pueda chocar con los de adentro
    return (
        <div className="flex flex-col gap-4">

            {msg && <Alerta alerta={alerta} />}

            <SeleccionarClienteModal
                abierto={modalSeleccionarCliente}
                onClose={() => setModalSeleccionarCliente(false)}
                onElegir={handleElegirCliente}
            />

            <SeleccionarProductoModal
                abierto={modalSeleccionarProducto}
                onClose={() => setModalSeleccionarProducto(false)}
                onElegir={handleAgregarProductos}
            />

            <div>
                <label className="font-bold uppercase text-xs text-gray-500">Cliente</label>
                <button
                    type="button"
                    onClick={() => setModalSeleccionarCliente(true)}
                    className="border-2 w-full p-2 mt-1 bg-gray-50 rounded-xl text-left hover:bg-gray-100"
                >
                    {clienteElegido
                        ? `${clienteElegido.nombre_cliente} ${clienteElegido.apellido_cliente} - ${clienteElegido.cedula_cliente}`
                        : 'Toca para elegir un cliente'}
                </button>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label className="font-bold uppercase text-xs text-gray-500">Productos</label>
                    <button
                        type="button"
                        onClick={() => setModalSeleccionarProducto(true)}
                        className="bg-primary-600 text-white uppercase font-bold text-xs px-4 py-2 rounded-lg hover:bg-primary-800"
                    >
                        + Agregar producto
                    </button>
                </div>

                {lineas.length ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 mt-2">
                        {lineas.map(linea => (
                            <div key={linea.producto.id_producto} className="flex flex-col gap-1 px-4 py-3 text-sm">
                            <div className="flex flex-col sm:grid sm:grid-cols-[2fr_90px_110px_110px_30px] gap-2 sm:items-center">
                                <span className="font-semibold text-primary-700">{linea.producto.nombre_prod}</span>

                                {/* si la cantidad supera el stock el campo se pinta de rojo */}
                                <input
                                    type="number"
                                    min="1"
                                    max={linea.producto.cantidad_prod}
                                    value={linea.cantidad}
                                    onChange={e => handleCambiarCantidad(linea.producto.id_producto, e.target.value)}
                                    onBlur={() => corregirCantidad(linea.producto.id_producto)}
                                    className={`border-2 p-1 rounded-lg w-20 sm:w-full text-center ${excedeStock(linea) ? 'bg-red-100 border-red-500 text-red-700 font-bold' : ''}`}
                                />

                                <span className="text-gray-500">$ {Number(linea.producto.precio_venta).toLocaleString('es-CO')}</span>

                                <span className="font-semibold">$ {((Number(linea.cantidad) || 0) * linea.producto.precio_venta).toLocaleString('es-CO')}</span>

                                <button
                                    type="button"
                                    onClick={() => handleQuitarLinea(linea.producto.id_producto)}
                                    className="text-red-500 hover:text-red-700 font-bold text-lg justify-self-end sm:justify-self-center"
                                    title="Quitar"
                                >
                                    &times;
                                </button>
                            </div>

                            {/* mensaje: por que esta en rojo y como arreglarlo */}
                            {excedeStock(linea) && (
                                <p className="text-xs text-red-600 font-semibold">
                                    Solo hay {linea.producto.cantidad_prod} unidad(es) en stock de este producto.{' '}
                                    <button
                                        type="button"
                                        onClick={() => handleUsarMaximo(linea.producto.id_producto)}
                                        className="underline hover:text-red-800"
                                    >
                                        Usar {linea.producto.cantidad_prod}
                                    </button>
                                </p>
                            )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 text-sm py-6 border border-dashed border-gray-200 rounded-xl mt-2">
                        Todavia no agregaste ningun producto
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between bg-primary-700 text-white rounded-xl px-5 py-3">
                <span className="font-bold uppercase text-sm">Total</span>
                <span className="font-black text-xl">$ {total.toLocaleString('es-CO')}</span>
            </div>

            <button
                type="button"
                onClick={handleSubmit}
                className="bg-primary-600 hover:bg-primary-800 cursor-pointer transition-colors text-white uppercase font-bold p-3 rounded-xl"
            >
                Generar Factura
            </button>
        </div>
    )
}

export default FormularioFacturaVenta;
