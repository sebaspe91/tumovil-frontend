import { useState } from "react";
import useFacturaVenta from "../../hook/useFacturaVenta";
import FacturaVenta from "./FacturaVenta";

function ListaFacturaVenta() {
    const { facturas } = useFacturaVenta();

    // esta busqueda es 100% local (en el navegador): el endpoint de
    // facturas no soporta filtrar por texto como si lo hace Productos, asi
    // que filtramos aca mismo el array que ya se cargo completo, sin pedir
    // nada nuevo al servidor
    const [texto, setTexto] = useState('');

    const facturasFiltradas = texto.trim()
        ? facturas.filter(factura => {
            const nombreCompleto = `${factura.cliente?.nombre_cliente ?? ''} ${factura.cliente?.apellido_cliente ?? ''}`.toUpperCase();
            const cedula = factura.cliente?.cedula_cliente ?? '';
            const busqueda = texto.trim().toUpperCase();
            return nombreCompleto.includes(busqueda) || cedula.includes(busqueda);
        })
        : facturas;

  return (
    <>
        <div className="max-w-xl mx-auto mb-8">
            <input
                type="text"
                value={texto}
                onChange={e => setTexto(e.target.value)}
                placeholder="Buscar por nombre, apellido o cedula del cliente"
                className="border-2 w-full p-2 placeholder-gray-400 bg-gray-50 rounded-xl"
            />
        </div>

        {facturasFiltradas.length > 0 && (
            <div className="hidden lg:grid lg:grid-cols-[100px_1.6fr_1.2fr_80px_1fr_150px] gap-4 items-center
                bg-primary-700 text-white text-xs font-bold uppercase px-5 py-3 rounded-t-xl mx-5">
                <span className="text-left">Fecha</span>
                <span className="text-left">Cliente</span>
                <span className="text-left">Vendedor</span>
                <span className="text-left">Items</span>
                <span className="text-left">Total</span>
                <span className="text-right">Acciones</span>
            </div>
        )}

        {facturasFiltradas.length ? (
            <div className="lg:border lg:border-t-0 lg:border-gray-200 lg:rounded-b-xl lg:overflow-hidden">
                {facturasFiltradas.map(factura => (
                    <FacturaVenta key={factura.id_fact_cli} factura={factura} />
                ))}
            </div>
        ):(
            <p className="text-xl mt-5 mb-10 text-center">
                {texto
                    ? <>No se encontraron facturas para {' '}<span className="text-primary-600 font-bold">"{texto}"</span></>
                    : <>No hay facturas registradas</>
                }
            </p>
        )}
    </>
  )
}

export default ListaFacturaVenta;
