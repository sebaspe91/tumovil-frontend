import { Link } from "react-router-dom";
import { useState } from "react";
import Alerta from "../../components/Alerta";
import clienteAxios from "../../config/axios";

function OlvidePassword() {

    // state
    const [correo_user, setCorreo_user] = useState('');
    const [alerta, setAlerta] = useState({});

    // test correo
    function validarCorreo(correo) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(correo);
    }

    // evento submit
    const handleSubmit = async e => {
        e.preventDefault();

        setTimeout(() => {
            setAlerta({});
        }, 3000);


        // validacion de campos
        if (correo_user === '') {
        return setAlerta({
            msg: "El campo debe de estar debidamente deligenciado",
            error: true
        });
        }

        // validar correo
        const testCorreo = validarCorreo(correo_user);
        if (!testCorreo) {
        return setAlerta({
            msg: 'El correo no tiene un formato válido (ej: correo@correo.com)', 
            error: true
        });
        
        }

        // Validacion correcta

        setAlerta({});

        try {
        const url = "usuarios/olvide-password";
        const {data} = await clienteAxios.post(url, {correo_user});

        // mostrar el mensjae
        setAlerta({
            msg: data.msg,
            error: false
        });
        } catch (error) {
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
            <h1 className="text-primary-700 text-6xl font-black text-center"> Recupera tu Password y{' '}<span className="text-black">tus Productos</span></h1>
        </div> 

        <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">

            {msg && <Alerta alerta={alerta}/>}
            
            <form 
                action=""
                onSubmit={handleSubmit}
            >

                {/* Email */}
                <div className="my-5">
                    <label className="uppercase text-gray-600 block txt-xl font-bold">
                        Email
                    </label>

                    <input 
                        type="email" 
                        name="correo_user"
                        placeholder="Email de Registro"
                        className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                        value={correo_user}
                        onChange={e => setCorreo_user(e.target.value)}
                    />
                </div>


                {/* boton Submit */}
                <input 
                    type="submit"
                    value="Enviar Instrucciones" 
                    className="bg-primary-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-primary-800"
                />
            </form>

            {/* Navegacion registrar y Recuperar contraseña */}
            <nav className="mt-10 lg:flex lg:justify-between">
                <Link 
                    className="block text-center my-5 text-gray-500"
                    to="/">¿Ya tienes una cuenta? Inicia Sesión</Link>
                <Link 
                    className="block text-center my-5 text-gray-500"
                    to="/registrar">¿No tienes una cuenta? Regístrate</Link>
            </nav>
        </div>
    </>
  )
}

export default OlvidePassword
