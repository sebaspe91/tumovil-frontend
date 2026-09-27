import { createContext, useState, useEffect } from "react";
import useAuth from "../hook/useAuth";
import clienteAxios from "../config/axios";

const ProductosContext = createContext();

const PRODUCTOS_POR_PAGINA = 5;

// valores por defecto de los filtros de busqueda de productos (todo vacio = sin filtrar)
const FILTROS_PRODUCTO_INICIALES = {
    nombre_prod: '',
    codigo_prod: '',
    categoria_id: '',
    marca_id: '',
    tipoPrecio: '', // '' | 'venta' | 'compra'
    precioMin: '',
    precioMax: ''
};

const ProductosProvider = ({children}) => {

    // usuario autenticado
    const {auth} = useAuth();

    // Productos Activos
    const [productos, setProductos] = useState([]);
    const [paginaProducto, setPaginaProducto] = useState(1);
    const [filtrosProducto, setFiltrosProducto] = useState(FILTROS_PRODUCTO_INICIALES);
    const [paginacionProducto, setPaginacionProducto] = useState({
        total: 0,
        totalPaginas: 1,
        paginaActual: 1,
        limite: PRODUCTOS_POR_PAGINA
    });

    // Productos Activos Eliminados
    const [productosEliminados, setProductosEliminados] = useState([]);
    const [paginaProductoEliminados, setPaginaProductoEliminados] = useState(1);
    const [filtrosProductoEliminados, setFiltrosProductoEliminados] = useState(FILTROS_PRODUCTO_INICIALES);
    const [paginacionProductoEliminados, setPaginacionProductoEliminados] = useState({
        total: 0,
        totalPaginas: 1,
        paginaActual: 1,
        limite: PRODUCTOS_POR_PAGINA
    });

    // producto a mostrar
    const [productoMostrar, setProductoMostrar] = useState({});
    // categorisa
    const [categorias, setCategorias] = useState([]);

    // General
    const [producto, setProducto] = useState({});

    // Modal
    const [modalFormularioProducto, setModalFormularioProducto] = useState(false);
    const [modalMostrarProducto, setModalMostrarProducto] = useState(false);

    const [alerta, setAlerta] = useState({});

    // Generar el config para enviar archivos -> expliacion en EmpresaProvider.jsx
    const generarConfig = (multipart = false) => { 
        const token = localStorage.getItem('token');

        if (!token) return; // termina operacion

        const headers = {
            Authorization: `Bearer ${token}`
        }

        if (!multipart) {
            headers["Content-Type"] = "application/json";
        }

        return {headers}
    }

    // obtenr categorias
    const obtenerCategorias = async () => {
        const config = generarConfig();
        if (!config) return;

        try {
            const url = "productos/categorias";
            const {data} = await clienteAxios(url, config);
            setCategorias(data.categorias);
        } catch (error) {
            console.log(error.response?.data?.msg || error.message);
        }
    }

    // llamado de la funcion
    useEffect(() => {
        const cargar = async () => {
            await obtenerCategorias();
        }
        cargar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // obtener productos activos
    const obtenerProductos = async (paginaAConsultar, filtros = FILTROS_PRODUCTO_INICIALES) => {
        const config = generarConfig();
        if (!config) return;

        try {
            // armamos los parametros de la url solo con los filtros que tengan valor
            const parametros = new URLSearchParams();
            parametros.set('pagina', paginaAConsultar);
            parametros.set('limite', PRODUCTOS_POR_PAGINA);

            if (filtros.nombre_prod) parametros.set('nombre_prod', filtros.nombre_prod);
            if (filtros.codigo_prod) parametros.set('codigo_prod', filtros.codigo_prod);
            if (filtros.categoria_id) parametros.set('categoria_id', filtros.categoria_id);
            if (filtros.marca_id) parametros.set('marca_id', filtros.marca_id);

            // el rango de precio: solo se envia el par que corresponde al tipo elegido
            if (filtros.tipoPrecio === 'venta') {
                if (filtros.precioMin) parametros.set('precioVentaMin', filtros.precioMin);
                if (filtros.precioMax) parametros.set('precioVentaMax', filtros.precioMax);
            } else if (filtros.tipoPrecio === 'compra') {
                if (filtros.precioMin) parametros.set('precioCompraMin', filtros.precioMin);
                if (filtros.precioMax) parametros.set('precioCompraMax', filtros.precioMax);
            }

            const url = `/productos?${parametros.toString()}`;

            const {data} = await clienteAxios(url, config);

            // si elimina el ultipo producto
            if (data.productos.length === 0 && paginaAConsultar > 1 && data.paginacion.total > 0) {
                setPaginaProducto(paginaAConsultar - 1);
                return;
            }

            setProductos(data.productos); // trae los productos de la DB
            setPaginacionProducto(data.paginacion); // datos de la paginacion

        } catch (error) {
            console.log(error.response?.data?.msg || error.message);
        }
    }

    // obtener productos activos Eliminados
    const obtenerProductosEliminados = async (paginaAConsultar, filtros = FILTROS_PRODUCTO_INICIALES) => {
        const config = generarConfig();
        if (!config) return;

        try {
            // mismos filtros que en obtenerProductos, pero apuntando al endpoint de eliminados
            const parametros = new URLSearchParams();
            parametros.set('pagina', paginaAConsultar);
            parametros.set('limite', PRODUCTOS_POR_PAGINA);

            if (filtros.nombre_prod) parametros.set('nombre_prod', filtros.nombre_prod);
            if (filtros.codigo_prod) parametros.set('codigo_prod', filtros.codigo_prod);
            if (filtros.categoria_id) parametros.set('categoria_id', filtros.categoria_id);
            if (filtros.marca_id) parametros.set('marca_id', filtros.marca_id);

            if (filtros.tipoPrecio === 'venta') {
                if (filtros.precioMin) parametros.set('precioVentaMin', filtros.precioMin);
                if (filtros.precioMax) parametros.set('precioVentaMax', filtros.precioMax);
            } else if (filtros.tipoPrecio === 'compra') {
                if (filtros.precioMin) parametros.set('precioCompraMin', filtros.precioMin);
                if (filtros.precioMax) parametros.set('precioCompraMax', filtros.precioMax);
            }

            const url = `/productos/eliminados?${parametros.toString()}`;

            const {data} = await clienteAxios(url, config);

            // si elimina el ultipo producto
            if (data.productos.length === 0 && paginaAConsultar > 1 && data.paginacion.total > 0) {
                setPaginaProductoEliminados(paginaAConsultar - 1);
                return;
            }

            setProductosEliminados(data.productos); // trae los productos de la DB
            setPaginacionProductoEliminados(data.paginacion); // datos de la paginacion

        } catch (error) {
            console.log(error.response?.data?.msg || error.message);
        }
    }

    // Llamados para obtener las productos
    useEffect(() => {
        const cargar = async () => {
            await obtenerProductos(paginaProducto, filtrosProducto)
        }

        cargar();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth, paginaProducto, filtrosProducto]);

    // Llamados para obtener las productos Eliminados
    useEffect(() => {
        const cargar = async () => {
            await obtenerProductosEliminados(paginaProductoEliminados, filtrosProductoEliminados)
        }

        cargar();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth, paginaProductoEliminados, filtrosProductoEliminados]);

    // busqueda de Producto activas: recibe el objeto completo de filtros
    const buscarProducto = nuevosFiltros => {
        setFiltrosProducto(nuevosFiltros);
        setPaginaProducto(1);
    }

    // Esta funcion esta conectada a listaProducto y esta conecta a toda la paginacion
    const cambiarPaginaProducto = numero => {
        setPaginaProducto(numero);
    }

    // lo mismo para la lista de Producto eliminadas
    const buscarProductoEliminadas = nuevosFiltros => {
        setFiltrosProductoEliminados(nuevosFiltros);
        setPaginaProductoEliminados(1);
    }

    const cambiarPaginaProductoEliminados = numero => {
        setPaginaProductoEliminados(numero);
    }

    // Registrar o actualizar Productos
    const guardarProducto = async productoAGuardar => {

        // valida si tiene algun archivo
        const esFormData = productoAGuardar instanceof FormData;

        const config = generarConfig(esFormData);
        if (!config) return;

        const idProducto = esFormData ? productoAGuardar.get('id_producto') : productoAGuardar.id_producto;
        
        if (idProducto) {
            // actualizar
            
            try {
                const url = `/productos/${idProducto}`;
                await clienteAxios.put(url, productoAGuardar, config);
                await obtenerProductos(paginaProducto, filtrosProducto);

                return {
                    msg: "El producto se actualizo correctamente"
                };

            } catch (error) {
                const msg = error.response?.data?.msg || 'No se pudo actualizar el producto';
                console.log(msg);
                return {
                    msg,
                    error: true
                }
            }
        } else {
            
            try {
                // registrar
                const url = `/productos`;
                await clienteAxios.post(url, productoAGuardar, config);

                setFiltrosProducto(FILTROS_PRODUCTO_INICIALES);
                setPaginaProducto(1);

                await obtenerProductos(1, FILTROS_PRODUCTO_INICIALES);

                return {
                    msg: 'El producto se registro correctamente'
                };

            } catch (error) {
                const msg = error.response?.data?.msg || 'No se pudo registrar el producto';
                console.log(msg);
                return {
                    msg,
                    error: true
                }        
            }
        }
    }

    // MODAL

    // Abre el modal en modo edicion
    const setEditarProducto = productoSeleccionada => {
        setProducto(productoSeleccionada );
        setModalFormularioProducto(true);
    }

    // abre el modal en modo nuevo crear
    const nuevoProducto = () => {
        setProducto({});
        setModalFormularioProducto(true);
    }

    // cerrar el modal y limpiar todo lo que hay en el formulario
    const cerrarModalFormularioProducto = () => {
        setModalFormularioProducto(false);
        setProducto({});
        setAlerta({});
    }

    // cerrar el modal y limpiar todo lo que hay en el formulario
    const cerrarModalMostrarProducto = () => {
        setModalMostrarProducto(false);
        setProductoMostrar({});
        setAlerta({});
    }

    // eliminar producto
    const setEliminarProducto = async id => {
        const confirmar = confirm('¿Confirma que desea eliminar el producto?');
        if (!confirmar) return;

        try {
            const config = generarConfig();
            if (!config) return;

            const url = `/productos/eliminar/${id}`;
            const {data} = await clienteAxios.put(url, {}, config);

            await obtenerProductos(paginaProducto, filtrosProducto);
            await obtenerProductosEliminados(paginaProductoEliminados, filtrosProductoEliminados);

            return {
                msg: data.msg
            };

        } catch (error) {
            return {
                msg: error.response?.data?.msg || 'No se pudo eliminar el Producto',
                error: true
            };   
        }
    }

    // Activar producto
    const setActivarProducto = async id => {
        const confirmar = confirm('¿Desea activar este producto?');
        if (!confirmar) return;

        try {
            const config = generarConfig();
            if (!config) return;

            const url = `/productos/${id}`;
            const {data} = await clienteAxios.patch(url, {}, config);

            // se actualizan las dos listas: la marca desaparece de "eliminados"
            // y tiene que aparecer de nuevo en la lista de activas
            await obtenerProductosEliminados(paginaProductoEliminados, filtrosProductoEliminados);
            await obtenerProductos(paginaProducto, filtrosProducto);

            return {
                msg: data.msg
            };

        } catch (error) {
            console.log(error);
            return {
                msg: error.response?.data?.msg || 'No se pudo activar el producto',
                error: true
            };
        }
    }

    // mostrar un producto
    const mostrarProducto = async productoM => {
        setProductoMostrar(productoM);
        setModalMostrarProducto(true);
    }

  return (
    <>
        <ProductosContext.Provider
            value={{
                productos,
                paginacionProducto,
                filtrosProducto,
                buscarProducto,
                cambiarPaginaProducto,

                productosEliminados,
                paginacionProductoEliminados,
                filtrosProductoEliminados,
                buscarProductoEliminadas,
                cambiarPaginaProductoEliminados,

                guardarProducto,
                setEditarProducto,
                nuevoProducto,
                modalFormularioProducto,
                cerrarModalFormularioProducto,
                producto,

                setEliminarProducto,
                setActivarProducto,

                alerta,
                setAlerta,

                categorias,

                mostrarProducto,
                productoMostrar,
                modalMostrarProducto,
                cerrarModalMostrarProducto
            }}
        >
            {children}
        </ProductosContext.Provider> 
    </>
  )
}

export {ProductosProvider};
export default ProductosContext;