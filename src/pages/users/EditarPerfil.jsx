import { useState, useEffect } from "react";
import useAuth from "../../hook/useAuth";
import Alerta from "../../components/Alerta";


function EditarPerfil() {

    const {auth, actualizarPerfil} = useAuth();

    const [perfil, setPerfil] = useState({});
    const [alerta, setAlerta] = useState({});

    useEffect(() => {
        const editar = () => {
            setPerfil(auth);
        }
        editar();
    }, [auth]);

    // test correo
    function validarCorreo(correo) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(correo);
    }

    const handleSubmit = async e => {
        e.preventDefault();
        
        const {nombre_user, apellido_user, cedula_user, correo_user} = perfil;

        setTimeout(() => {
            setAlerta({});
        }, 3000);

        // validar
        if ([nombre_user, apellido_user, cedula_user, correo_user].includes(undefined) || [nombre_user, apellido_user, cedula_user, correo_user].includes('')) {
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

        // Toda la validacion esta bien
        setAlerta({});

        // Todo bien

        // para mostrar las alertas del servidor que ya estan en return debe de colocarse una variable que reciba la informacion de ese return
        
       const resultado = await actualizarPerfil(perfil);

       setAlerta(resultado);

    }

    // Extraemos el msg de alerta
    const {msg} = alerta;

  return (
    <>
        <div>
            <h1 className="text-primary-700 text-6xl font-black text-center"> Edita tu{' '}<span className="text-black">Perfil</span></h1>
        </div> 
        <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white md:mx-10">
            
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

                    {msg && 
                        <Alerta 
                            alerta={alerta}
                        />
                    }

                    {/* boton Submit */}
                    <input 
                        type="submit"
                        value="Editar Perfil" 
                        className="bg-primary-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-primary-800"
                    />

                </form>

            </div>

        </div>
    </>
  )
}

export default EditarPerfil
