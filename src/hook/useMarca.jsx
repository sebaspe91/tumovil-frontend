import { useContext } from "react";
import MarcaContext from "../context/MarcaProvider";

const useMarca = () => {
    return useContext(MarcaContext);
}

export default useMarca;