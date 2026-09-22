import {useState} from 'react';
import useMarca from '../../hook/useMarca';
import Alerta from '../Alerta';


function FormularioMarca() {
    // marca
    const {guardarMarca, marca, alerta, setAlerta, cerrarModalFormularioMarca} = useMarca();

    // Editar o crear
    const [marcaRegistrar, setMarcaRegistrar] = useState(() => ({
        id_marca: marca?.id_marca, // valida si es actualizar o crear
        nombre_marca: marca?.nombre_marca ?? '',
        codigo_marca: marca?.codigo_marca ?? ''
    }));

    // Editar
    const modoEdicion = Boolean(marcaRegistrar.id_marca);

    // funciones
    const handleSubmit = async e => {
        e.preventDefault();

        const {nombre_marca, codigo_marca} = marcaRegistrar;

        setTimeout(() => {
            setAlerta({});
        }, 3000);

        // validar
        if ([nombre_marca, codigo_marca].includes(undefined) || [nombre_marca, codigo_marca].includes('')) {
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            });
            return;
        }

        // Toda la validacion esta bien
        setAlerta({});

        try {
            const resultado = await guardarMarca(marcaRegistrar);
            setAlerta(resultado);

            // si el backend responde con error, se deja el formulario abierto y con los datos
            if (resultado?.error) return;

            // cerrams modal
            setTimeout(() => {
                cerrarModalFormularioMarca();
            }, 1200);

        } catch (error) {
            console.log(error);
            return {
                msg: error.response?.data?.msg || 'Fallo la opereacion con la Marca',
                error: true
            };
        }

    }

    const {msg} = alerta;
    
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='uppercase text-gray-600 block txt-xl font-bold mb-5'>
            <label htmlFor="nombre_marca">Nombre de la Marca</label>

            <input
                type="text"
                id="nombre_marca"
                placeholder="Nombre de la Marca"
                className='border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl'
                value={marcaRegistrar.nombre_marca || ''}
                onChange={
                    e => setMarcaRegistrar({
                        ...marcaRegistrar,
                        [e.target.id] : e.target.value
                    })
                }
            />
        </div>

        <div className='uppercase text-gray-600 block txt-xl font-bold mb-5'>
            <label htmlFor="codigo_marca">Codigo de la Marca</label>

            <input
                type="text"
                id="codigo_marca"
                placeholder="Nombre de la Marca"
                className='border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl'
                value={marcaRegistrar.codigo_marca || ''}
                onChange={
                    e => setMarcaRegistrar({
                        ...marcaRegistrar,
                        [e.target.id] : e.target.value
                    })
                }
            />
        </div>

        {msg &&
            <Alerta
                alerta={alerta}
            />
        }

        {/* boton Submit */}
        <input
            type="submit"
            value={modoEdicion ? 'Editar Marca' : 'Registrar Marca'}
            className="bg-primary-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-primary-800"
        />
    
      </form>
    </>
  )
}

export default FormularioMarca
