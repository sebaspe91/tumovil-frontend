import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useUsers from '../../hook/useUsers';
import Alerta from '../Alerta';


function FormularioUsers() {

    // sacamos los elementos de useUsers. alerta/setAlerta ahora viven en el
    // contexto (UsersProvider), no aca -- si fueran estado local, se
    // perderian cuando guardarUsuario fuerza el remontaje de este
    // componente al terminar de guardar (ver el key en AdminUsers.jsx)
    const {guardarUsuario, usuario, alerta, setAlerta, cerrarModalFormulario} = useUsers();

    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarRepetirPassword, setMostrarRepetirPassword] = useState(false);
    
    // remplaza el useEffct()
    const [usuarioRegistrar, setUsuarioRegistrar] = useState(() => ({
        id_usuario: usuario?.id_usuario, // necesario para que guardarUsuario sepa si es crear o actualizar
        nombre_user: usuario?.nombre_user ?? '',
        apellido_user: usuario?.apellido_user ?? '',
        cedula_user: usuario?.cedula_user ?? '',
        correo_user: usuario?.correo_user ?? '',
        password: '', // por seguridad
        telefono_user: usuario?.telefono_user ?? ''
    }));


    // true cuando estamos editando un usuario existente (viene con id_usuario),
    // false cuando es un registro nuevo
    const modoEdicion = Boolean(usuarioRegistrar.id_usuario);

    // funcioens

    // test correo
    function validarCorreo(correo) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(correo);
    }

    // submit
    const handleSubmit = async e => {
        e.preventDefault();

        const {nombre_user, apellido_user, cedula_user, correo_user, password, repetirPassword} = usuarioRegistrar;

        setTimeout(() => {
            setAlerta({});
        }, 3000);

        // campos siempre obligatorios. El password/repetirPassword NO entran
        // aca cuando estamos editando -- en edicion son opcionales
        const camposObligatorios = modoEdicion
            ? [nombre_user, apellido_user, cedula_user, correo_user]
            : [nombre_user, apellido_user, cedula_user, correo_user, password, repetirPassword];

        if (camposObligatorios.includes(undefined) || camposObligatorios.includes('')) {
            setAlerta({
                msg: 'Hay campos vacios que son obligatorios',
                error: true
            });
            return;
        }

        // validar correo
        if (!validarCorreo(correo_user)) {
            setAlerta({
                msg: 'El correo no tiene un formato válido (ej: correo@correo.com)',
                error: true
            });
            return;
        }

        // password: si es un registro nuevo, siempre se valida. Si estamos
        // editando, solo se valida si el usuario escribio algo en password
        // o repetirPassword -- es decir, si de verdad quiere cambiarlo.
        const quiereCambiarPassword = !modoEdicion || Boolean(password) || Boolean(repetirPassword);

        if (quiereCambiarPassword) {
            const tieneMayuscula = /[A-Z]/.test(password);
            const tieneCaracterEspecial = /[-+!@#$%^&*(),.?":|]/.test(password);
            const tieneMinimo4 = (password || '').length >= 4;

            if (!tieneMinimo4) {
                setAlerta({msg: 'El password debe tener mas de 4 caracteres', error: true});
                return;
            }
            if (!tieneCaracterEspecial) {
                setAlerta({msg: 'El password debe tener por lo menos un caracter especial', error: true});
                return;
            }
            if (!tieneMayuscula) {
                setAlerta({msg: 'El password debe tener por lo menos una mayuscula', error: true});
                return;
            }

            // comparar si los dos password son iguales
            if (password !== repetirPassword) {
                setAlerta({msg: 'Los passwords deben coinsidir', error: true});
                return;
            }
        }

        // Toda la validacion esta bien
        setAlerta({});

        // si no se quiere cambiar el password, no lo mandamos vacio al backend
        const {password: _password, repetirPassword: _repetirPassword, ...datosSinPassword} = usuarioRegistrar;
        const datosAEnviar = quiereCambiarPassword ? usuarioRegistrar : datosSinPassword;

        const resultado = await guardarUsuario(datosAEnviar);

        setAlerta(resultado);

        // si el backend respondio con un error (por ejemplo "el correo ya
        // esta registrado"), dejamos el modal abierto y los datos tal cual
        // los escribio el usuario, para que los pueda corregir sin tener
        // que volver a escribir todo -- antes esta linea limpiaba el
        // formulario SIEMPRE, incluso cuando algo habia salido mal
        if (resultado?.error) return;

        // si todo salio bien, mostramos el mensaje de exito un momento y
        // despues cerramos el modal (cerrarModalFormulario tambien limpia
        // el usuario seleccionado y la alerta en el contexto)
        setTimeout(() => {
            cerrarModalFormulario();
        }, 1200);
    }


    const {msg} = alerta;

  return (
    <>
        {/* El titulo (Registrar/Editar) ya lo muestra el encabezado del
            Modal en AdminUsers.jsx, por eso aca no se repite */}
        <form
            onSubmit={handleSubmit}
        >
            {/* nombre usuario */}
            <div className='uppercase text-gray-600 block txt-xl font-bold mb-5'>
                <label htmlFor="nombre_user">*Nombres del Usuario</label>

                <input 
                    type="text" 
                    id="nombre_user"
                    placeholder="Nombre del usuario"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl'
                    value={usuarioRegistrar.nombre_user || ''}
                    onChange={
                        e => setUsuarioRegistrar({
                            ...usuarioRegistrar,
                            [e.target.id] : e.target.value
                        })
                    }
                />
            </div>

            {/* apellido usuario */}
            <div className='uppercase text-gray-600 block txt-xl font-bold mb-5'>
                <label htmlFor="apellido_user">*Apellidos del Usuario</label>

                <input 
                    type="text" 
                    id="apellido_user"
                    placeholder="Apellido del usuario"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl'
                    value={usuarioRegistrar.apellido_user || ''}
                    onChange={
                        e => setUsuarioRegistrar({
                            ...usuarioRegistrar,
                            [e.target.id] : e.target.value
                        })
                    }
                />
            </div>

            {/* cedula usuario */}
            <div className='uppercase text-gray-600 block txt-xl font-bold mb-5'>
                <label htmlFor="cedula_user">*Cedula del Usuario</label>

                <input 
                    type="text" 
                    id="cedula_user"
                    placeholder="Cedula del usuario"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl'
                    value={usuarioRegistrar.cedula_user || ''}
                    onChange={
                        e => setUsuarioRegistrar({
                            ...usuarioRegistrar,
                            [e.target.id] : e.target.value
                        })
                    }
                />
            </div>

            {/* correo usuario */}
            <div className='uppercase text-gray-600 block txt-xl font-bold mb-5'>
                <label htmlFor="correo_user">*Correo del Usuario</label>

                <input 
                    type="email" 
                    id="correo_user"
                    placeholder="Correo del usuario"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl'
                    value={usuarioRegistrar.correo_user || ''}
                    onChange={
                        e => setUsuarioRegistrar({
                            ...usuarioRegistrar,
                            [e.target.id] : e.target.value
                        })
                    }
                />
            </div>

            {/* Usuario Password */}
            <div className="uppercase text-gray-600 block txt-xl font-bold mb-5">
                <label htmlFor='password'>
                    {modoEdicion ? 'Password (déjalo en blanco para no cambiarlo)' : '*Password'}
                </label>

                <div className="relative">
                    <input
                        type={mostrarPassword ? 'text' : 'password'}
                        id='password'
                        placeholder="Escribe tu Password"
                        className="border w-full p-3 mt-3 bg-gray-50 rounded-xl pr-12"
                        value={usuarioRegistrar.password || ''}
                        onChange={e => setUsuarioRegistrar({
                            ...usuarioRegistrar,
                            [e.target.id] : e.target.value
                        })}
                    />

                    <button
                        type="button"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>

            {/* Usuario Password */}
            <div className="uppercase text-gray-600 block txt-xl font-bold mb-5">
                <label htmlFor='repetirPassword'>
                    {modoEdicion ? 'Repetir Password (solo si lo vas a cambiar)' : '*Repetir Password'}
                </label>

                <div className="relative">
                    <input
                        type={mostrarRepetirPassword ? 'text' : 'password'}
                        id='repetirPassword'
                        placeholder="Escribe Nuevamente tu Password"
                        className="border w-full p-3 mt-3 bg-gray-50 rounded-xl pr-12"
                        value={usuarioRegistrar.repetirPassword || ''}
                        onChange={e => setUsuarioRegistrar({
                            ...usuarioRegistrar,
                            [e.target.id] : e.target.value
                        })}
                    />

                    <button
                        type="button"
                        onClick={() => setMostrarRepetirPassword(!mostrarRepetirPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        {mostrarRepetirPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            </div>


            {/* telefono usuario */}
            <div className='uppercase text-gray-600 block txt-xl font-bold mb-5'>
                <label htmlFor="telefono_user">Telefono del Usuario</label>

                <input 
                    type="text" 
                    id="telefono_user"
                    placeholder="Telefono del usuario"
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl'
                    value={usuarioRegistrar.telefono_user || ''}
                    onChange={
                        e => setUsuarioRegistrar({
                            ...usuarioRegistrar,
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
                value={modoEdicion ? 'Editar Usuario' : 'Registrar Usuario'}
                className="bg-primary-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-primary-800"
            />

        </form>

    </>
  )
}

export default FormularioUsers;
