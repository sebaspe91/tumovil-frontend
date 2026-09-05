import { useContext } from "react";
import ProveedorContext from "../context/ProveedorProvider";

const useProveedor = () => {
    return useContext(ProveedorContext);
}

export default useProveedor;