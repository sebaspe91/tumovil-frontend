import FormularioFacturaVenta from "../../components/facturaVenta/FormularioFacturaVenta";

// esta pagina ("/factura-venta") ya NO muestra listas de facturas -- solo
// sirve para crear una factura nueva. El historial (facturas activas y
// eliminadas) se ve en otra pagina: HistorialFacturaVenta.jsx ("/facturas-historial")
function AmdinFacturaVenta() {
  return (
    <>
      <h2 className="font-black text-3xl text-center">Generar Factura de Venta</h2>

      <p className="text-xl mt-5 mb-6 text-center">
        Elige el {' '}
        <span className="text-primary-600 font-bold">Cliente</span>
        {' '}y agrega los{' '}
        <span className="text-primary-600 font-bold">Productos</span>
      </p>

      <div className="max-w-2xl mx-auto">
        <FormularioFacturaVenta />
      </div>
    </>
  )
}

export default AmdinFacturaVenta;
