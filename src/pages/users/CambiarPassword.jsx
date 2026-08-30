import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuth from "../../hook/useAuth";
import Alerta from "../../components/Alerta";

function CambiarPassword() {
  
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarRepetirPassword, setMostrarRepetirPassword] = useState(false);

    // state
  const [alerta, setAlerta] = useState({});
  const [passwordObjt, setPasswordObjt] = useState({
    actualPassword: '',
    password: '',    
    repetirPassword: ''
  });

  const {guardarPassword} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    
    const {password, repetirPassword} = passwordObjt;


    // validar

    if (Object.values(password).some(campo => campo === '')) {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      });
      return;
    }

    // validar

    // validar si el password es el mismo

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

    const resultado = await guardarPassword(passwordObjt);
    setAlerta(resultado);

    // si no hubo error, mandamos al usuario de vuelta a Editar Perfil --
    // el setTimeout es para que alcance a ver el mensaje de exito antes
    // de que la pantalla cambie
    if (!resultado?.error) {
      setTimeout(() => {
        navigate('/admin-users/perfil');
      }, 1500);
    }
  }

  const {msg} = alerta;

  return (
    <>
      <h2 className="font-black text-3xl text-center mt-10">Cambiar Password</h2>
      <p className="text-xl mt-5 mb-10 text-center">
        Modifica tu {''}
        <span className="text-indigo-500 font-bold">Password aquí</span>
      </p>

      <div className="flex justify-center">
        <div className="w-full md:w-1/2 bg-white shadow rounded-lg p-5">

          {msg && 
            <Alerta 
              alerta={alerta}
            />
          }
        
          <form 
            action=""
            onSubmit={handleSubmit}    
          >
            <div className="my-3">
                <label htmlFor="" className="uppercase font-bold text-gray-600">Password Actual</label>
                <input 
                    type="password"
                    className="border bg-gray-50 w-full p-2 mt-5 rounded-lg" 
                    name="actualPassword"
                    placeholder="Escribe tu password actual"
                    value={passwordObjt.actualPassword || ''}
                    onChange={e => setPasswordObjt({
                        ...passwordObjt,
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
                        value={passwordObjt.password || ''}
                        onChange={e => setPasswordObjt({
                            ...passwordObjt,
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
                        value={passwordObjt.repetirPassword || ''}
                        onChange={e => setPasswordObjt({
                            ...passwordObjt,
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

            {/* boton submit */}
            <input 
                type="submit" 
                value="Actualizar Password" 
                className="bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800"
            />
          </form>
        </div>
      </div>      
    </>
  )
}

export default CambiarPassword
