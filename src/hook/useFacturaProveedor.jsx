import { useContext } from "react";
import FacturaProveedorContext from "../context/FacturaProveedorProvider";

const useFacturaProveedor = () => {
    return useContext(FacturaProveedorContext);
}

export default useFacturaProveedor;