import { useState } from 'react';
import useClientes from '../../hook/useClientes';
import Alerta from '../Alerta';



function FormularioCliente() {

    // sacamos los elementos de cliente
    const {guardarCliente, cliente, alerta, setAlerta, cerrarModalFormularioCliente} = useClientes();

    // dar a entender si es guardar .id o crear
    const [clienteRegistrar, setClienteRegistrar] = useState(() => ({
        id_cliente: cliente?.id_cliente, // valida si es actualizar o crear
        nombre_cliente: cliente?.nombre_cliente ?? '',
        apellido_cliente: cliente?.apellido_cliente ?? '',
        cedula_cliente: cliente?.cedula_cliente ?? '',
        correo_cliente: cliente?.correo_cliente ?? '',
        telefono_cliente: cliente?.telefono_cliente ?? ''
    }));

    // si es para editar -- ojo, es id_cliente (no id_usuario: los clientes
    // no tienen ese campo, por eso antes esto siempre daba false)
    const modoEdicion = Boolean(clienteRegistrar.id_cliente);

    // funciones
    const handleSubmit = async e => {
        e.preventDefault();

        const {nombre_cliente, apellido_cliente, cedula_cliente, correo_cliente} = clienteRegistrar;

        setTimeout(() => {
            setAlerta({});
        }, 3000);

        // validar
        if ([nombre_cliente, apellido_cliente, cedula_cliente, correo_cliente].includes(undefined) || [nombre_cliente, apellido_cliente, cedula_cliente, correo_cliente].includes('')) {
            setAlerta({
                msg: 'Hay campos vacios que son obligatorios',
                error: true
            });
            return;
        }

        // Toda la validacion esta bien
        setAlerta({});

        try {
            const resultado = await guardarCliente(clienteRegistrar);

            setAlerta(resultado);

            // si el backend respondio con error, dejamos el formulario
            // abierto y con los datos tal cual, para que se puedan corregir
            if (resultado?.error) return;

            setTimeout(() => {
                cerrarModalFormularioCliente();
            }, 1200);

        } catch (error) {
            console.log(error);
            return {
                msg: error.response?.data?.msg || 'Fallo la opereacion con el Cliente',
                error: true
            };
        }


    }

    const {msg} = alerta;

  return (
    <>
        {/* El titulo (Registrar/Editar) lo muestra el encabezado del Modal
            en AdminCliente.jsx, por eso aca no se repite */}
        <form
            onSubmit={handleSubmit}
        >
            {/* nombre cliente */}
            <div className='uppercase text-gray-600 block txt-xl font-bold mb-5'>
                <label htmlFor="nombre_cliente">*Nombres del Cliente</label>

                <input
                    type="text"
                    id="nombre_cliente"
                    placeholder="Nombre del cliente"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl'
                    value={clienteRegistrar.nombre_cliente || ''}
                    onChange={
                        e => setClienteRegistrar({
                            ...clienteRegistrar,
                            [e.target.id] : e.target.value
                        })
                    }
                />
            </div>

            {/* apellido cliente */}
            <div className='uppercase text-gray-600 block txt-xl font-bold mb-5'>
                <label htmlFor="apellido_cliente">*Apellidos del Cliente</label>

                <input
                    type="text"
                    id="apellido_cliente"
                    placeholder="Apellido del cliente"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl'
                    value={clienteRegistrar.apellido_cliente || ''}
                    onChange={
                        e => setClienteRegistrar({
                            ...clienteRegistrar,
                            [e.target.id] : e.target.value
                        })
                    }
                />
            </div>

            {/* cedula cliente */}
            <div className='uppercase text-gray-600 block txt-xl font-bold mb-5'>
                <label htmlFor="cedula_cliente">*Cedula del Cliente</label>

                <input
                    type="text"
                    id="cedula_cliente"
                    placeholder="Cedula del cliente"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl'
                    value={clienteRegistrar.cedula_cliente || ''}
                    onChange={
                        e => setClienteRegistrar({
                            ...clienteRegistrar,
                            [e.target.id] : e.target.value
                        })
                    }
                />
            </div>

            {/* correo cliente */}
            <div className='uppercase text-gray-600 block txt-xl font-bold mb-5'>
                <label htmlFor="correo_cliente">*Correo del Cliente</label>

                <input
                    type="email"
                    id="correo_cliente"
                    placeholder="Correo del cliente"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl'
                    value={clienteRegistrar.correo_cliente || ''}
                    onChange={
                        e => setClienteRegistrar({
                            ...clienteRegistrar,
                            [e.target.id] : e.target.value
                        })
                    }
                />
            </div>

            {/* telefono cliente -- sin asterisco: no es obligatorio, igual
                que en FormularioUsers.jsx */}
            <div className='uppercase text-gray-600 block txt-xl font-bold mb-5'>
                <label htmlFor="telefono_cliente">Telefono del Cliente</label>

                <input
                    type="text"
                    id="telefono_cliente"
                    placeholder="Telefono del cliente"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl'
                    value={clienteRegistrar.telefono_cliente || ''}
                    onChange={
                        e => setClienteRegistrar({
                            ...clienteRegistrar,
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
                value={modoEdicion ? 'Editar Cliente' : 'Registrar Cliente'}
                className="bg-primary-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-primary-800"
            />

        </form>

    </>
  )
}

export default FormularioCliente;
