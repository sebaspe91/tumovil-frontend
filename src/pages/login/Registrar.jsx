import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // imagenes de font Awesome
import Alerta from '../../components/Alerta';
import clienteAxios from '../../config/axios';

function Registrar() {
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarRepetirPassword, setMostrarRepetirPassword] = useState(false);
    const [perfil, setPerfil] = useState({});
    const [alerta, setAlerta] = useState({});


    // funciones

    // test correo
    function validarCorreo(correo) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(correo);
    }

    const handleSubmit = async e => {
        e.preventDefault();

        const {nombre_user, apellido_user, cedula_user, correo_user, password, repetirPassword} = perfil;

        setTimeout(() => {
            setAlerta({});
        }, 3000);

        // validar
        if ([nombre_user, apellido_user, cedula_user, correo_user, password, repetirPassword].includes(undefined) || [nombre_user, apellido_user, cedula_user, correo_user, password, repetirPassword].includes('')) {
            setAlerta({
                msg: 'Hay campos vacios que son obligatorios',
                error: true
            });
            return;
        }

        // validar correo
        const testCorreo = validarCorreo(correo_user);
        if (!testCorreo) {
            setAlerta({msg: 'El correo no tiene un formato válido (ej: correo@correo.com)', error: true});
            return;
        }

        // password

        const tieneMayuscula = /[A-Z]/.test(password);
        const tieneCaracterEspecial = /[-+!@#$%^&*(),.?":|]/.test(password);
        const tieneMinimo4 = password.length >= 4;

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

        // Toda la validacion esta bien
        setAlerta({});

        try {
            const url = '/usuarios';
            const data = await clienteAxios.post(url, perfil);
            console.log(data)
            setAlerta({
                msg: 'Creado Correctamente, revisa tu correo'
            });

            // borrar los datos de los campos
            setPerfil({});

        } catch (error) {
            console.log(error);
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });
        }
    }

    const {msg} = alerta;

  return (
    <>
        <div>
            <h1 className="text-primary-700 text-6xl font-black text-center"> Crea tu Cuenta y Administra{' '}<span className="text-black">tus Productos</span></h1>
        </div> 
        <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
            
            <div>
                <form 
                    action=""
                    onSubmit={handleSubmit}
                >
                    
                    {/* Usuario */}
                    <div className="my-5">
                        <label className="uppercase text-gray-600 block txt-xl font-bold">
                            *Nombres
                        </label>

                        <input 
                            type="text" 
                            name='nombre_user'
                            placeholder="Escribe tus Nombres"
                            className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                            value={perfil.nombre_user || ''}
                            onChange={e => setPerfil({
                                ...perfil,
                                [e.target.name] : e.target.value
                            })}
                        />
                    </div>

                    {/* Usuario apellido */}
                    <div className="my-5">
                        <label className="uppercase text-gray-600 block txt-xl font-bold">
                            *Apellidos
                        </label>

                        <input 
                            type="text" 
                            name='apellido_user'
                            placeholder="Escribe tus Apellidos"
                            className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                            value={perfil.apellido_user || ''}
                            onChange={e => setPerfil({
                                ...perfil,
                                [e.target.name] : e.target.value
                            })}
                        />
                    </div>
                    
                    {/* Usuario Cedula */}
                    <div className="my-5">
                        <label className="uppercase text-gray-600 block txt-xl font-bold">
                            *Cedula
                        </label>

                        <input 
                            type="text" 
                            name='cedula_user'
                            placeholder="Escribe tu Cedula"
                            className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                            value={perfil.cedula_user || ''}
                            onChange={e => setPerfil({
                                ...perfil,
                                [e.target.name] : e.target.value
                            })}
                        />
                    </div>

                    {/* Usuario Correo */}
                    <div className="my-5">
                        <label className="uppercase text-gray-600 block txt-xl font-bold">
                            *Correo
                        </label>

                        <input 
                            type="email" 
                            placeholder="Escribe tu Correo"
                            name='correo_user'
                            className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                            value={perfil.correo_user || ''}
                            onChange={e => setPerfil({
                                ...perfil,
                                [e.target.name] : e.target.value
                            })}
                        />
                    </div>

                    {/* Usuario Password */}
                    <div className="my-5">
                        <label className="uppercase text-gray-600 block txt-xl font-bold">
                            *Password
                        </label>

                        <div className="relative">
                            <input
                                type={mostrarPassword ? 'text' : 'password'}
                                name='password'
                                placeholder="Escribe tu Password"
                                className="border w-full p-3 mt-3 bg-gray-50 rounded-xl pr-12"
                                value={perfil.password || ''}
                                onChange={e => setPerfil({
                                    ...perfil,
                                    [e.target.name] : e.target.value
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
                    <div className="my-5">
                        <label className="uppercase text-gray-600 block txt-xl font-bold">
                            *Repetir Password
                        </label>

                        <div className="relative">
                            <input
                                type={mostrarRepetirPassword ? 'text' : 'password'}
                                name='repetirPassword'
                                placeholder="Escribe Nuevamente tu Password"
                                className="border w-full p-3 mt-3 bg-gray-50 rounded-xl pr-12"
                                value={perfil.repetirPassword || ''}
                                onChange={e => setPerfil({
                                    ...perfil,
                                    [e.target.name] : e.target.value
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

                    {/* Usuario Correo */}
                    <div className="my-5">
                        <label className="uppercase text-gray-600 block txt-xl font-bold">
                            Telefono
                        </label>

                        <input 
                            type="tel" 
                            name='telefono_user'
                            placeholder="Escribe tu Telefono"
                            className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                            value={perfil.telefono_user || ''}
                            onChange={e => setPerfil({
                                ...perfil,
                                [e.target.name] : e.target.value
                            })}
                        />
                    </div>

                    {/* boton Submit */}
                    <input 
                        type="submit"
                        value="Crear Cuenta" 
                        className="bg-primary-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-primary-800"
                    />

                    {msg && 
                        <Alerta 
                            alerta={alerta}
                        />
                    }
                </form>
                {/* Navegacion registrar y Recuperar contraseña */}
                <nav className="mt-10 lg:flex lg:justify-between">
                    <Link 
                        className="block text-center my-5 text-gray-500"
                        to="/">¿Ya tienes una cuenta? Inicia Sesión</Link>
                    <Link 
                        className="block text-center my-5 text-gray-500"
                        to="/olvide-password">Olvide mi Password</Link>
                </nav>
            </div>

        </div>
    </>
  )
}

export default Registrar
