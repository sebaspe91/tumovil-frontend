import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuth from "../../hook/useAuth";
import Alerta from "../../components/Alerta";
import clienteAxios from "../../config/axios";


function Login() {

    // state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alerta, setAlerta] = useState({});
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const {setAuth} = useAuth();

    const navigate = useNavigate();

    // test correo
    function validarCorreo(correo) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(correo);
    }

    const handleSubmit = async e => {
        e.preventDefault();

        setTimeout(() => {
            setAlerta({});
        }, 3000);        

        // validar campos
        if ([email, password].includes('')) {
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true                
            });
            return;
        }

        // validar correo
        if (!validarCorreo(email)) {
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

        // Toda la validacion esta bien
        setAlerta({});

        try {
            const url = '/usuarios/login';
            const {data} = await clienteAxios.post(url, {correo_user: email, password});
            
            // Almacenamos el token el LocalStorage
            localStorage.setItem('token', data.token); // verificar en <Inpeccionar - Application - Local storage - url

            // actualizamos el Auth
            setAuth(data);

            // redireccionar al usuario al perfil
            if (data.tipo_user === 'ADMIN') {
                navigate('/admin-users');
                return;
            }

            // usuario normal
            navigate('/factura-venta');
            
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
            <h1 className="text-primary-700 text-6xl font-black text-center">Incia Sesión en <span className="text-black">TuMovil</span></h1>
        </div> 
        <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
            

            {/* Mostrar alerta */}
            {msg && 
                <Alerta
                    alerta={alerta}
                />
            }

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
                        placeholder="Email de Registro"
                        className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                {/* password */}
                <div className="my-5">
                    <label 
                        className="uppercase text-gray-600 block txt-xl font-bold"
                    >
                        Contraseña
                    </label>

                    <div className="relative">
                        <input 
                            type={mostrarPassword ? 'text' : 'password'} 
                            placeholder="Ingrese su Contraseña"
                            className="border w-full p-3 mt-3 bg-gray-50 rounded-xl pr-12"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setMostrarPassword(!mostrarPassword)}
                        >
                            {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                </div>

                {/* boton Submit */}
                <input 
                    type="submit"
                    value="Inciar Sesión" 
                    className="bg-primary-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-primary-800"
                />
            </form>
            {/* Navegacion registrar y Recuperar contraseña */}
            <nav className="mt-10 lg:flex lg:justify-between">
                <Link 
                    className="block text-center my-5 text-gray-500"
                    to="/registrar">¿No tienes una cuenta? Regístrate</Link>
                <Link 
                    className="block text-center my-5 text-gray-500"
                    to="/olvide-password">Olvide mi Password</Link>
            </nav>
        </div>
    </>
  )
}

export default Login
