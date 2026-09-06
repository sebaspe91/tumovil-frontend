import { useContext } from "react";
import EmpresaContext from "../context/EmpresaProvider";

const useEmpresa = () => {
    return useContext(EmpresaContext);
}

export default useEmpresa;