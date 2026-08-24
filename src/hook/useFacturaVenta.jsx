import { useContext } from "react";
import FacturaVentaContext from "../context/FacturaVentaProvider";

const useFacturaVenta = () => {
    return useContext(FacturaVentaContext);
}

export default useFacturaVenta;