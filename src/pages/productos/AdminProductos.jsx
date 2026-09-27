import { useState } from "react";
import FormularioProducto from "../../components/productos/FormularioProducto";
import ProductoDetalle from "../../components/productos/ProductoDetalle";
import ListaProductos from "../../components/productos/ListaProductos";
import ListaProductosEliminados from "../../components/productos/ListaProductosEliminados";
import Modal from "../../components/Modal";
import useProducto from "../../hook/useProducto";

function AdminProductos() {
  const {
    producto, 
    modalFormularioProducto, 
    nuevoProducto, 
    cerrarModalFormularioProducto,
    modalMostrarProducto,
    cerrarModalMostrarProducto,
    productoMostrar
  } = useProducto();

  // modal propio de esta pagina para mostrar los productos eliminados
  const [modalProductosEliminadas, setModalProductosEliminadas] = useState(false);

    // modo edicion
  const modoEdicion = Boolean(producto?.id_producto);

  return (
    <>

      <div className="flex flex-col md:flex-row justify-center md:justify-end gap-3 mb-6 md:mr-5">
        <button
          type="button"
          onClick={nuevoProducto}
          className="bg-primary-600 text-white uppercase font-bold px-6 py-3 rounded-md hover:bg-primary-800"
        >
          + Nuevo Producto
        </button>

        {/* abre el modal con la lista de Productos Eliminadas (no navega a otra pagina) */}
        <button
          type="button"
          onClick={() => setModalProductosEliminadas(true)}
          className="bg-gray-600 text-white uppercase font-bold px-6 py-3 rounded-md hover:bg-gray-800"
        >
          Productos Eliminados
        </button>
      </div>

      {/* Crear o editar un producto */}
      <Modal
        abierto={modalFormularioProducto}
        onClose={cerrarModalFormularioProducto}
        titulo={modoEdicion ? 'Editar Producto' : 'Registrar Producto'}
      >
        {modalFormularioProducto && <FormularioProducto key={producto?.id_producto ?? 'nuevo'} />}
      </Modal>

      {/* para mostrar el producto */}
      <Modal
        abierto={modalMostrarProducto}
        onClose={cerrarModalMostrarProducto}
        titulo="Producto"
      >
        {modalMostrarProducto && <ProductoDetalle key={productoMostrar?.id_producto ?? 'nuevo'} />}
      </Modal>

      {/* lista de producto eliminados */}
      <Modal
        abierto={modalProductosEliminadas}
        onClose={() => setModalProductosEliminadas(false)}
        titulo='Productos Eliminados'
        ancho='max-w-4xl'
      >
        {/* solo se monta (y solo entonces se piden/usan los datos) mientras el modal esta abierto */}
        {modalProductosEliminadas && <ListaProductosEliminados />}
      </Modal>

     <ListaProductos />
    </>
  )
}

export default AdminProductos;
