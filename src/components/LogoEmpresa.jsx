import useEmpresa from "../hook/useEmpresa";

// Componente reutilizable para mostrar la marca de la empresa (Sidebar y
// Header lo usan). Si ya se subio un logo, muestra la imagen; si
// todavia no hay ninguno, muestra el nombre de la empresa como texto --
// asi la marca nunca desaparece mientras nadie ha subido un logo.
//
// Props:
//   claseImagen -> clases para el <img> (tamaño, margenes, etc)
//   claseTexto  -> clases para el texto de respaldo (cuando no hay logo)
function LogoEmpresa({claseImagen = 'h-10', claseTexto = 'font-bold text-2xl'}) {

    const {empresa} = useEmpresa();

    if (empresa?.logo_empresa) {
        const url = `${import.meta.env.VITE_BACKEND_URL}/uploads/empresa/${empresa.logo_empresa}`;

        return (
            <img
                src={url}
                alt={empresa.nombre_empresa || 'Logo de la empresa'}
                className={`${claseImagen} rounded-full object-cover bg-white p-0.5 shadow-sm`}
            />
        )
    }

    // todavia no hay logo subido -- se muestra el nombre como texto
    return (
        <span className={claseTexto}>
            {empresa?.nombre_empresa || 'TuMovil'}
        </span>
    )
}

export default LogoEmpresa;
