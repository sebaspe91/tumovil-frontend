import { useContext } from "react";
import ProductosContext from "../context/ProductosProvider";

const useProducto = () => {
    return useContext(ProductosContext);
}

export default useProducto;