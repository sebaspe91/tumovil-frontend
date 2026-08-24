import { createContext } from "react";


const FacturaVentaContext = createContext();


const FacturaVentaProvider = ({children}) => {
    return(
        <FacturaVentaContext.Provider>
            {children}
        </FacturaVentaContext.Provider>
    )
}


export {
    FacturaVentaProvider
}

export default FacturaVentaContext;