import { useEffect } from "react";
import useFacturaProveedor from "../../hook/useFacturaProveedor";
import useRefrescarAlVolver from "../../hook/useRefrescarAlVolver";
import FacturaProveedorDetalle from "../../components/facturaProveedor/FacturaProveedorDetalle";
import ListaFacturaProveedor from "../../components/facturaProveedor/ListaFacturaProveedor";
import ListaFacturaProveedorEliminadas from "../../components/facturaProveedor/ListaFacturaProveedorEliminadas";
import Alerta from "../../components/Alerta";
import Modal from "../../components/Modal";

// Pagina "/facturas-compra": el HISTORIAL de compras. Aqui viven la lista de facturas
// activas, la de eliminadas (en un modal) y el detalle de una factura (en otro modal).
// No usa ProveedorProvider ni ProductosProvider: aqui no se elige nada, solo se consulta
// lo que ya existe. Es la pareja de /factura-compra (la pagina para CREAR).
function HistorialFacturaProveedor() {
  // PASO 1 -- lo que necesitamos del Provider
  const {
    modalDetalle,
    cerrarModalDetalle,
    facturaSeleccionada,

    modalEliminadas,
    setModalEliminadas,

    alerta,
    setAlerta,
    refrescarFacturas
  } = useFacturaProveedor();

  // PASO 2 -- las alertas (ej. "No se puede eliminar: parte de esa mercancia ya se
  // vendio") se borran solas a los 8 segundos. El "return" limpia el temporizador si la
  // alerta cambia antes o si se sale de la pagina.
  useEffect(() => {
    if (!alerta?.msg) return;

    const temporizador = setTimeout(() => setAlerta({}), 8000);
    return () => clearTimeout(temporizador);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerta]);

  // PASO 3 -- si dejas esta pagina abierta, generas una compra en otra pestana y
  // vuelves, la lista se vuelve a pedir sola (ver hook/useRefrescarAlVolver.jsx)
  useRefrescarAlVolver(refrescarFacturas);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center md:justify-end gap-3 mb-6 md:mr-5">
        {/* abre el modal con la lista de Facturas Eliminadas (no navega a otra pagina) */}
        <button
          type="button"
          onClick={() => setModalEliminadas(true)}
          className="bg-gray-600 text-white uppercase font-bold px-6 py-3 rounded-md hover:bg-gray-800"
        >
          Facturas Eliminadas
        </button>
      </div>

      <h2 className="font-black text-3xl text-center">Historial de Facturas de Compras</h2>

      <p className="text-xl mt-5 mb-6 text-center">
        Todas las{' '}
        <span className="text-primary-600 font-bold">Facturas</span>
        {' '}de compra registradas
      </p>

      {/* mensajes de eliminar / reactivar / descargar PDF */}
      {alerta?.msg && <Alerta alerta={alerta} />}

      {/* ver el detalle de una factura */}
      <Modal
        abierto={modalDetalle}
        onClose={cerrarModalDetalle}
        titulo="Detalle de la Factura de Compra"
        ancho="max-w-2xl"
      >
        {modalDetalle && facturaSeleccionada && <FacturaProveedorDetalle />}
      </Modal>

      {/* lista de facturas eliminadas */}
      <Modal
        abierto={modalEliminadas}
        onClose={() => setModalEliminadas(false)}
        titulo="Facturas de Compra Eliminadas"
        ancho="max-w-4xl"
      >
        {/* solo se monta (y solo entonces se piden los datos) mientras el modal esta abierto */}
        {modalEliminadas && <ListaFacturaProveedorEliminadas />}
      </Modal>

      <ListaFacturaProveedor />
    </>
  )
}

export default HistorialFacturaProveedor;
