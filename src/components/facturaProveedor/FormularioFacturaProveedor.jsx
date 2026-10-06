import {useState} from 'react';
import useFacturaProveedor from '../../hook/useFacturaProveedor';
import useProducto from '../../hook/useProducto';
import Alerta from '../Alerta';
import SeleccionarProductoModal from '../productos/SeleccionarProductoModal';
import SeleccionarProvvedorModal from '../proveedor/SeleccionarProvvedorModal';

// =====================================================================
//  FormularioFacturaProveedor -- crear una FACTURA DE COMPRA
// =====================================================================
// Es la version "al reves" de FormularioFacturaVenta:
//   - en vez de un CLIENTE se elige un PROVEEDOR
//   - los productos NO tienen tope de stock (se esta COMPRANDO mercancia)
//   - cada linea lleva un PRECIO DE COMPRA editable, porque el proveedor
//     puede cobrar distinto en cada factura (el backend lo exige)
//   - al guardar, el backend SUMA las cantidades al stock

// Ganancia minima que el backend garantiza al vender (GANANCIA_MINIMA en
// facturaProveedorController.js). Se repite aca SOLO para avisarle al
// usuario, antes de guardar, que el precio de venta va a subir.
const GANANCIA_MINIMA = 5000;

function FormularioFacturaProveedor() {
    // PASO 1 -- funciones que vienen de los Providers
    const { guardarFactura, descargarPDF, alerta, setAlerta } = useFacturaProveedor();
    // del ProductosProvider: lo usamos al final para refrescar el stock en pantalla
    const { buscarProducto, filtrosProducto } = useProducto();

    // PASO 2 -- estado local del formulario
    // el Proveedor elegido para esta factura
    const [proveedorElegido, setProveedorElegido] = useState(null);
    const [modalSeleccionarProveedor, setModalSeleccionarProveedor] = useState(false);

    // el "carrito": cada linea es { producto, cantidad, precio }
    // (en compras el backend EXIGE el precio de compra de cada producto)
    const [lineas, setLineas] = useState([]);
    const [modalSeleccionarProducto, setModalSeleccionarProducto] = useState(false);

    // PASO 3 -- elegir proveedor (lo llama SeleccionarProvvedorModal al hacer click en una fila)
    const handleElegirProveedor = proveedor => {
        setProveedorElegido(proveedor);
        setModalSeleccionarProveedor(false);
    }

    // PASO 4 -- agregar productos al carrito. "productosElegidos" es un array de
    // { producto, cantidad } (el selector deja marcar VARIOS a la vez).
    const handleAgregarProductos = productosElegidos => {
        setLineas(anteriores => {
            let lineas = [...anteriores];

            productosElegidos.forEach(({ producto, cantidad }) => {
                // ¿ese producto ya esta en el carrito?
                const indice = lineas.findIndex(linea => linea.producto.id_producto === producto.id_producto);

                if (indice === -1) {
                    // no estaba: linea nueva. El precio arranca con el precio de compra que ya
                    // tiene el producto; luego se puede editar porque cada proveedor cobra distinto
                    lineas.push({ producto, cantidad, precio: producto.precio_compra });
                } else {
                    // compra: sin tope de stock, solo se suma lo que se va a comprar
                    const cantidadNueva = lineas[indice].cantidad + cantidad;
                    lineas[indice] = { ...lineas[indice], cantidad: cantidadNueva };
                }
            });

            return lineas;
        });
    }

    // PASO 5 -- editar cantidad y precio dentro del carrito.
    // Misma tecnica que en ventas: mientras se escribe se deja el campo TAL CUAL
    // (incluso vacio) y solo se corrige cuando el usuario SALE del campo (onBlur).
    // Si se corrigiera en cada tecla, al borrar el numero se convertiria en "1"
    // de inmediato y no se podria escribir otro.
    const handleCambiarCantidad = (idProducto, valor) => {
        // solo se aceptan numeros enteros o el campo vacio (mientras se escribe)
        if (valor !== '' && !/^\d+$/.test(valor)) return;

        setLineas(anteriores => anteriores.map(linea =>
            linea.producto.id_producto === idProducto
                ? { ...linea, cantidad: valor }
                : linea
        ));
    }

    // onBlur de la cantidad: minimo 1 (en compra NO hay maximo)
    const corregirCantidad = idProducto => {
        setLineas(anteriores => anteriores.map(linea => {
            if (linea.producto.id_producto !== idProducto) return linea;
            return { ...linea, cantidad: Math.max(1, Number(linea.cantidad) || 1) };
        }));
    }

    // precio de compra: solo digitos (el precio en la base es un entero, sin decimales)
    const handleCambiarPrecio = (idProducto, valor) => {
        if (valor !== '' && !/^\d+$/.test(valor)) return;

        setLineas(anteriores => anteriores.map(linea =>
            linea.producto.id_producto === idProducto
                ? { ...linea, precio: valor }
                : linea
        ));
    }

    // onBlur del precio: si lo dejaron vacio o en 0, vuelve al precio de compra
    // que tiene registrado el producto
    const corregirPrecio = idProducto => {
        setLineas(anteriores => anteriores.map(linea => {
            if (linea.producto.id_producto !== idProducto) return linea;
            const precio = Number(linea.precio) || Number(linea.producto.precio_compra) || 1;
            return { ...linea, precio };
        }));
    }

    const handleQuitarLinea = idProducto => {
        setLineas(anteriores => anteriores.filter(linea => linea.producto.id_producto !== idProducto));
    }

    // PASO 6 -- calculos que se muestran en pantalla
    // total = suma de (cantidad x precio) de cada linea
    const total = lineas.reduce((acumulado, linea) => acumulado + ((Number(linea.cantidad) || 0) * (Number(linea.precio) || 0)), 0);

    // Si con este precio de compra el producto ya no deja la ganancia minima, el
    // backend SUBE el precio de venta. Aca calculamos a cuanto, solo para avisar.
    // Devuelve null cuando no hace falta subirlo.
    const precioVentaAjustado = linea => {
        const precioMinimoVenta = (Number(linea.precio) || 0) + GANANCIA_MINIMA;
        return Number(linea.producto.precio_venta) < precioMinimoVenta ? precioMinimoVenta : null;
    }

    // PASO 7 -- guardar la factura.
    // OJO: esto NO es el onSubmit de un <form> (mismo motivo que en ventas): adentro hay
    // otros <form> (buscadores, "registrar proveedor") y un <form> no puede ir dentro de otro.
    // Por eso el contenedor es un <div> y el boton usa onClick.
    const handleSubmit = async () => {
        // validaciones rapidas antes de llamar al backend
        if (!proveedorElegido) {
            setAlerta({ msg: 'Debe seleccionar un proveedor', error: true });
            return;
        }

        if (lineas.length === 0) {
            setAlerta({ msg: 'Debe agregar al menos un producto', error: true });
            return;
        }

        // el precio de compra es obligatorio y mayor a cero en cada linea
        const hayPrecioInvalido = lineas.some(linea => !(Number(linea.precio) > 0));
        if (hayPrecioInvalido) {
            setAlerta({ msg: 'Todos los productos deben tener un precio de compra mayor a cero', error: true });
            return;
        }

        setAlerta({});

        // armamos EXACTAMENTE lo que espera registrarFacturaProveedor en el backend
        const datos = {
            proveedor_id: proveedorElegido.id_proveedor,
            productos: lineas.map(linea => ({
                producto_dp_id: linea.producto.id_producto,
                cantidad_dp_compra: Math.max(1, Number(linea.cantidad) || 1),
                precio_compra: Number(linea.precio)
            }))
        };

        const resultado = await guardarFactura(datos);

        // si el backend responde con error se deja el formulario con sus datos para corregir
        if (resultado?.error) {
            setAlerta(resultado);
            return;
        }

        // la factura ya se guardo: se descarga el PDF de una vez
        setAlerta({ msg: 'Factura generada, descargando PDF...' });

        if (resultado.facturaId) {
            await descargarPDF(resultado.facturaId);
        }

        // la compra cambio el stock y puede haber cambiado precios de venta:
        // se vuelve a pedir la lista de productos para que el selector no muestre datos viejos
        // ({...filtrosProducto} es un objeto NUEVO, por eso el Provider vuelve a consultar)
        buscarProducto({ ...filtrosProducto });

        // se limpia el formulario para registrar la siguiente compra
        setTimeout(() => {
            setProveedorElegido(null);
            setLineas([]);
            setAlerta({});
        }, 1500);
    }

    const { msg } = alerta;

    // PASO 8 -- lo que se dibuja
    return (
        <div className="flex flex-col gap-4">

            {msg && <Alerta alerta={alerta} />}

            {/* modal para elegir proveedor (tambien deja registrar uno nuevo) */}
            <SeleccionarProvvedorModal
                abierto={modalSeleccionarProveedor}
                onClose={() => setModalSeleccionarProveedor(false)}
                onElegir={handleElegirProveedor}
            />

            {/* modal para elegir productos: modo="compra" = sin tope de stock y con precio de compra */}
            <SeleccionarProductoModal
                abierto={modalSeleccionarProducto}
                onClose={() => setModalSeleccionarProducto(false)}
                onElegir={handleAgregarProductos}
                modo="compra"
            />

            {/* PROVEEDOR */}
            <div>
                <label className="font-bold uppercase text-xs text-gray-500">Proveedor</label>
                <button
                    type="button"
                    onClick={() => setModalSeleccionarProveedor(true)}
                    className="border-2 w-full p-2 mt-1 bg-gray-50 rounded-xl text-left hover:bg-gray-100"
                >
                    {proveedorElegido
                        ? `${proveedorElegido.nombre_prov} - NIT ${proveedorElegido.nit_prov}`
                        : 'Toca para elegir un proveedor'}
                </button>
            </div>

            {/* PRODUCTOS (el carrito) */}
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

                        {/* encabezado de columnas (solo en pantallas >= sm) */}
                        <div className="hidden sm:grid sm:grid-cols-[2fr_90px_120px_110px_30px] gap-2 bg-gray-50 text-xs font-bold uppercase text-gray-500 px-4 py-2">
                            <span>Producto</span>
                            <span className="text-center">Cantidad</span>
                            <span className="text-center">Precio compra</span>
                            <span>Subtotal</span>
                            <span></span>
                        </div>

                        {lineas.map(linea => {
                            const ajuste = precioVentaAjustado(linea);

                            return (
                                <div key={linea.producto.id_producto} className="flex flex-col gap-2 px-4 py-3 text-sm">
                                    <div className="flex flex-col sm:grid sm:grid-cols-[2fr_90px_120px_110px_30px] gap-2 sm:items-center">
                                        <span className="font-semibold text-primary-700">{linea.producto.nombre_prod}</span>

                                        {/* cantidad: sin "max", en compra no hay tope */}
                                        <input
                                            type="number"
                                            min="1"
                                            value={linea.cantidad}
                                            onChange={e => handleCambiarCantidad(linea.producto.id_producto, e.target.value)}
                                            onBlur={() => corregirCantidad(linea.producto.id_producto)}
                                            className="border-2 p-1 rounded-lg w-20 sm:w-full text-center"
                                            title="Cantidad a comprar"
                                        />

                                        {/* precio de compra editable */}
                                        <input
                                            type="number"
                                            min="1"
                                            value={linea.precio}
                                            onChange={e => handleCambiarPrecio(linea.producto.id_producto, e.target.value)}
                                            onBlur={() => corregirPrecio(linea.producto.id_producto)}
                                            className="border-2 p-1 rounded-lg w-28 sm:w-full text-center"
                                            title="Precio de compra (por unidad)"
                                        />

                                        <span className="font-semibold">
                                            $ {((Number(linea.cantidad) || 0) * (Number(linea.precio) || 0)).toLocaleString('es-CO')}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => handleQuitarLinea(linea.producto.id_producto)}
                                            className="text-red-500 hover:text-red-700 font-bold text-lg justify-self-end sm:justify-self-center"
                                            title="Quitar"
                                        >
                                            &times;
                                        </button>
                                    </div>

                                    {/* aviso: este costo obliga a subir el precio de venta */}
                                    {ajuste && (
                                        <p className="text-xs text-amber-600">
                                            Con este precio de compra, el precio de venta subira de $ {Number(linea.producto.precio_venta).toLocaleString('es-CO')} a $ {ajuste.toLocaleString('es-CO')} para dejar la ganancia minima.
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 text-sm py-6 border border-dashed border-gray-200 rounded-xl mt-2">
                        Todavia no agregaste ningun producto
                    </p>
                )}
            </div>

            {/* TOTAL */}
            <div className="flex items-center justify-between bg-primary-700 text-white rounded-xl px-5 py-3">
                <span className="font-bold uppercase text-sm">Total</span>
                <span className="font-black text-xl">$ {total.toLocaleString('es-CO')}</span>
            </div>

            <button
                type="button"
                onClick={handleSubmit}
                className="bg-primary-600 hover:bg-primary-800 cursor-pointer transition-colors text-white uppercase font-bold p-3 rounded-xl"
            >
                Generar Factura de Compra
            </button>
        </div>
    )
}

export default FormularioFacturaProveedor;
