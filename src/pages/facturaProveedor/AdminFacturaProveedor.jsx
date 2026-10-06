import FormularioFacturaProveedor from "../../components/facturaProveedor/FormularioFacturaProveedor";

// esta pagina ("/factura-compra") solo sirve para CREAR una factura de compra.
// El historial (facturas activas y eliminadas) vive en otra pagina:
// HistorialFacturaProveedor.jsx ("/facturas-compra"). Es el mismo reparto que en ventas.
function AdminFacturaProveedor() {
  return (
    <>
      <h2 className="font-black text-3xl text-center">Generar Factura de Compra</h2>

      <p className="text-xl mt-5 mb-6 text-center">
        Elige el {' '}
        <span className="text-primary-600 font-bold">Proveedor</span>
        {' '}y agrega los{' '}
        <span className="text-primary-600 font-bold">Productos</span>
      </p> 

      <div className="max-w-2xl mx-auto">
        <FormularioFacturaProveedor />
      </div>
    </>
  )
}

export default AdminFacturaProveedor;
