import { useState } from "react";
import useProducto from "../../hook/useProducto";
import useMarca from "../../hook/useMarca";
import Alerta from "../Alerta";
import SeleccionarMarcaModal from "../marcas/SeleccionarMarcaModal";

function FormularioProducto() {

    // producto
    const {guardarProducto, producto, alerta, setAlerta, cerrarModalFormularioProducto, categorias} = useProducto();

    // lista de marcas ya cargada por el MarcaProvider (mientras no este el modal selector)
    const {marcas} = useMarca();

    // Editar o crear, es para mostrar en el formulario vacio o lleno
    const [productoRegistrar, setProductoRegistrar] = useState(() => ({
        id_producto: producto?.id_producto,
        categoria_id: producto?.categoria_id ?? '',
        marca_id: producto?.marca_id ?? '',
        nombre_prod: producto?.nombre_prod ?? '',
        cantidad_prod: producto?.cantidad_prod ?? '',
        precio_compra: producto?.precio_compra ?? '',
        precio_venta: producto?.precio_venta ?? '',
        foto_producto: producto?.foto_producto ?? '',
        detalle_prod: producto?.detalle_prod ?? ''
    }));

    // imagen para guardarla
    const [logoFile, setLogoFile] = useState(null);

    // URL para mostrar la imagen: si ya habia una foto guardada (edicion),
    // arranca mostrando esa; si no, arranca en null
    const [logoPreview, setLogoPreview] = useState(() =>
        producto?.foto_producto
            ? `${import.meta.env.VITE_BACKEND_URL}/uploads/productos/${producto.foto_producto}`
            : null
    );

    // Seccion de marcas

    // marca que el usuario elige en el modal selector (para mostrar el
    // nombre en el boton, en vez de solo el id)
    const [marcaElegida, setMarcaElegida] = useState(null);

    // si el modal para buscar/elegir una marca esta abierto
    const [modalSeleccionarMarca, setModalSeleccionarMarca] = useState(false);

    // Editar
    const modoEdicion = Boolean(productoRegistrar.id_producto);

    // texto que se muestra en el boton de "Marca": la que se acaba de
    // elegir en el modal, o -- si estas editando un producto que ya
    // tenia marca y todavia no elegiste una nueva -- se busca en la
    // pagina de marcas que ya esta cargada (puede no encontrarla si esa
    // marca no viene en la pagina actual; en ese caso se muestra el id)
    const marcaEnListaActual = marcas.find(m => m.id_marca === Number(productoRegistrar.marca_id));

    // Muestra la imgaen depende si la tiene recien selelcionada o db
    const textoMarca = marcaElegida?.nombre_marca
        ?? marcaEnListaActual?.nombre_marca
        ?? (productoRegistrar.marca_id ? `Marca #${productoRegistrar.marca_id} (toca para cambiar)` : 'Seleccionar marca...');

    // se llama cuando el usuario hace click en una fila del modal selector
    const handleElegirMarca = marca => {
        setMarcaElegida(marca);
        setProductoRegistrar(prev => ({ ...prev, marca_id: marca.id_marca }));
        setModalSeleccionarMarca(false);
    }

    // funciones de validacion
    const esEnteroPositivo = numero => {
        return Number.isInteger(numero) && numero >= 0;
    }

    function esDoublePositivo(numero) {
        return Number.isFinite(numero) && numero > 0;
    }

    // maneja el cambio de cualquier input de texto/numero del formulario
    const handleChange = e => {
        setProductoRegistrar({
            ...productoRegistrar,
            [e.target.name]: e.target.value
        });
    }

    // se llama cuando eliges un archivo en el input de tipo "file"
    const handleLogoChange = e => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        setLogoFile(archivo);
        setLogoPreview(URL.createObjectURL(archivo));
    }

    // enviar el registro
    const handleSubmit = async e => {
        e.preventDefault();

        const {categoria_id, marca_id, nombre_prod, cantidad_prod, precio_compra, precio_venta, detalle_prod} = productoRegistrar;

        setTimeout(() => {
            setAlerta({});
        }, 3000);

        // validar campos obligatorios
        if ([categoria_id, marca_id, nombre_prod, cantidad_prod, precio_compra, precio_venta].includes(undefined) || [categoria_id, marca_id, nombre_prod, cantidad_prod, precio_compra, precio_venta].includes('')) {
            setAlerta({
                msg: 'Hay campos que son obligatorios',
                error: true
            });
            return;
        }

        if (!esEnteroPositivo(Number(cantidad_prod))) {
            setAlerta({
                msg: 'La Cantidad debe de ser un numero entero positivo',
                error: true
            });
            return;
        }

        if (!esEnteroPositivo(Number(categoria_id))) {
            setAlerta({
                msg: 'La Categoria tiene un formato invalido',
                error: true
            });
            return;
        }

        if (!esEnteroPositivo(Number(marca_id))) {
            setAlerta({
                msg: 'La Marca tiene un formato invalido',
                error: true
            });
            return;
        }

        if (!esDoublePositivo(Number(precio_compra))) {
            setAlerta({
                msg: 'El precio de compra debe tener un valor numerico y positivo',
                error: true
            });
            return;
        }

        if (!esDoublePositivo(Number(precio_venta))) {
            setAlerta({
                msg: 'El precio de venta debe tener un valor numerico y positivo',
                error: true
            });
            return;
        }

        // toda la validacion esta bien
        setAlerta({});

        try {
            // armamos el FormData con los campos de texto + el archivo (si hay uno nuevo)
            const formData = new FormData();

            formData.append('categoria_id', categoria_id);
            formData.append('marca_id', marca_id);
            formData.append('nombre_prod', nombre_prod);
            formData.append('cantidad_prod', cantidad_prod);
            formData.append('precio_compra', precio_compra);
            formData.append('precio_venta', precio_venta);
            formData.append('detalle_prod', detalle_prod);

            // la foto solo se manda si el usuario eligio una nueva
            if (logoFile) {
                formData.append('foto_producto', logoFile);
            }

            // si es edicion, el backend necesita saber cual producto es
            if (productoRegistrar.id_producto) {
                formData.append('id_producto', productoRegistrar.id_producto);
            }

            const resultado = await guardarProducto(formData);
            setAlerta(resultado);

            // si el backend responde con error, se deja el formulario abierto y con los datos
            if (resultado?.error) return;

            setTimeout(() => {
                cerrarModalFormularioProducto();
            }, 1200);

        } catch (error) {
            console.log(error);
            setAlerta({
                msg: error.response?.data?.msg || 'Fallo la operacion con el producto',
                error: true
            });
        }
    }

    const {msg} = alerta;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {msg && <Alerta alerta={alerta} />}

            <div>
                <label className="font-bold uppercase text-xs text-gray-500">Categoria</label>
                <select
                    name="categoria_id"
                    value={productoRegistrar.categoria_id}
                    onChange={handleChange}
                    className="border-2 w-full p-2 mt-1 bg-gray-50 rounded-xl"
                >
                    <option value="">-- Selecciona una categoria --</option>
                    {categorias.map(categoria => (
                        <option key={categoria.id_categoria} value={categoria.id_categoria}>
                            {categoria.nombre_categoria}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="font-bold uppercase text-xs text-gray-500">Marca</label>
                <button
                    type="button"
                    onClick={() => setModalSeleccionarMarca(true)}
                    className="border-2 w-full p-2 mt-1 bg-gray-50 rounded-xl text-left"
                >
                    {textoMarca}
                </button>
            </div>

            <SeleccionarMarcaModal
                abierto={modalSeleccionarMarca}
                onClose={() => setModalSeleccionarMarca(false)}
                onElegir={handleElegirMarca}
            />

            <div>
                <label className="font-bold uppercase text-xs text-gray-500">Nombre del producto</label>
                <input
                    type="text"
                    name="nombre_prod"
                    value={productoRegistrar.nombre_prod}
                    onChange={handleChange}
                    placeholder="Nombre del producto"
                    className="border-2 w-full p-2 mt-1 placeholder-gray-400 bg-gray-50 rounded-xl"
                />
            </div>

            <div>
                <label className="font-bold uppercase text-xs text-gray-500">Cantidad</label>
                <input
                    type="number"
                    name="cantidad_prod"
                    value={productoRegistrar.cantidad_prod}
                    onChange={handleChange}
                    placeholder="Cantidad disponible"
                    className="border-2 w-full p-2 mt-1 placeholder-gray-400 bg-gray-50 rounded-xl"
                />
            </div>

            <div className="flex gap-3">
                <div className="flex-1">
                    <label className="font-bold uppercase text-xs text-gray-500">Precio de compra</label>
                    <input
                        type="number"
                        step="0.01"
                        name="precio_compra"
                        value={productoRegistrar.precio_compra}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="border-2 w-full p-2 mt-1 placeholder-gray-400 bg-gray-50 rounded-xl"
                    />
                </div>

                <div className="flex-1">
                    <label className="font-bold uppercase text-xs text-gray-500">Precio de venta</label>
                    <input
                        type="number"
                        step="0.01"
                        name="precio_venta"
                        value={productoRegistrar.precio_venta}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="border-2 w-full p-2 mt-1 placeholder-gray-400 bg-gray-50 rounded-xl"
                    />
                </div>
            </div>

            <div>
                <label className="font-bold uppercase text-xs text-gray-500">Detalle</label>
                <textarea
                    name="detalle_prod"
                    value={productoRegistrar.detalle_prod}
                    onChange={handleChange}
                    placeholder="Detalle del producto (opcional)"
                    className="border-2 w-full p-2 mt-1 placeholder-gray-400 bg-gray-50 rounded-xl"
                />
            </div>

            <div>
                <label className="font-bold uppercase text-xs text-gray-500">Foto del producto</label>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleLogoChange}
                    className="mt-1"
                />
                {logoPreview && (
                    <img
                        src={logoPreview}
                        alt="Vista previa del producto"
                        className="mt-3 h-24 w-24 object-cover rounded-xl border"
                    />
                )}
            </div>

            <button
                type="submit"
                className="bg-primary-600 text-white uppercase font-bold px-6 py-3 rounded-md hover:bg-primary-800"
            >
                {modoEdicion ? 'Guardar Cambios' : 'Registrar Producto'}
            </button>
        </form>
    )
}

export default FormularioProducto;