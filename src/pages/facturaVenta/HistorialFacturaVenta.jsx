import useFacturaVenta from "../../hook/useFacturaVenta";
import FacturaVentaDetalle from "../../components/facturaVenta/FacturaVentaDetalle";
import ListaFacturaVenta from "../../components/facturaVenta/ListaFacturaVenta";
import ListaFacturaVentaEliminadas from "../../components/facturaVenta/ListaFacturaVentaEliminadas";
import Modal from "../../components/Modal";

// pagina nueva ("/facturas-historial"): aca es donde viven las listas que
// antes estaban mezcladas con la de crear factura -- facturas activas,
// facturas eliminadas (en un modal) y el detalle de una factura (en otro
// modal). No usa ClientesProvider ni ProductosProvider porque aca no se
// elige nada, solo se consulta lo que ya existe.
function HistorialFacturaVenta() {
  const {
    modalDetalle,
    cerrarModalDetalle,
    facturaSeleccionada,

    modalEliminadas,
    setModalEliminadas
  } = useFacturaVenta();

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

      <h2 className="font-black text-3xl text-center">Historial de Facturas</h2>

      <p className="text-xl mt-5 mb-6 text-center">
        Todas las{' '}
        <span className="text-primary-600 font-bold">Facturas</span>
        {' '}registradas
      </p>

      {/* ver el detalle de una factura */}
      <Modal
        abierto={modalDetalle}
        onClose={cerrarModalDetalle}
        titulo="Detalle de la Factura"
        ancho="max-w-2xl"
      >
        {modalDetalle && facturaSeleccionada && <FacturaVentaDetalle />}
      </Modal>

      {/* lista de facturas eliminadas */}
      <Modal
        abierto={modalEliminadas}
        onClose={() => setModalEliminadas(false)}
        titulo="Facturas Eliminadas"
        ancho="max-w-4xl"
      >
        {/* solo se monta (y solo entonces se piden los datos) mientras el modal esta abierto */}
        {modalEliminadas && <ListaFacturaVentaEliminadas />}
      </Modal>

      <ListaFacturaVenta />
    </>
  )
}

export default HistorialFacturaVenta;
