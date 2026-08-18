import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import clienteAxios from "../../config/axios";
import Alerta from "../../components/Alerta";

function NuevoPassword() {

  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [alerta, setAlerta] = useState({});
  const [passwordModificado, setPasswordModificado] = useState(false);
  const [tokenValido, setTokenValido] = useState(false);
  const efectoEjecutado = useRef(false);

  const params = useParams();
  const { token } = params;

  // Verificar el token apenas se carga la página
  useEffect(() => {
    if (efectoEjecutado.current) return;
    efectoEjecutado.current = true;

    const comprobarToken = async () => {
      try {
        const url = `/usuarios/olvide-password/${token}`;
        await clienteAxios(url);
        setTokenValido(true); // el token existe y es válido
      } catch (error) {
        setAlerta({
          msg: error.response?.data?.msg || 'Hubo un error al validar el enlace',
          error: true
        });
      }
    };
    comprobarToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneCaracterEspecial = /[-+!@#$%^&*(),.?":|]/.test(password);
    const tieneMinimo4 = password.length >= 4;

    if (password === "" || repetirPassword === "") {
      return setAlerta({ msg: 'Todos los campos son obligatorios', error: true });
    }
    if (!tieneMinimo4) {
      return setAlerta({ msg: 'El password debe tener mas de 4 caracteres', error: true });
    }
    if (!tieneCaracterEspecial) {
      return setAlerta({ msg: 'El password debe tener por lo menos un caracter especial', error: true });
    }
    if (!tieneMayuscula) {
      return setAlerta({ msg: 'El password debe tener por lo menos una mayuscula', error: true });
    }
    if (password !== repetirPassword) {
      return setAlerta({ msg: 'Los passwords deben coinsidir', error: true });
    }

    try {
      const url = `/usuarios/olvide-password/${token}`;
      await clienteAxios.post(url, { password });

      setAlerta({ msg: "Password Modificado Correctamente", error: false });
      setPasswordModificado(true);

    } catch (error) {
      setAlerta({
        msg: error.response?.data?.msg || 'Hubo un error al actualizar tu password',
        error: true
      });
    }
  }

  const { msg } = alerta;

  return (
    <>
        <div>
            <h1 className="text-primary-700 text-6xl font-black text-center">Escribe tu Nuevo Password y Comienza a Administrar{' '}<span className="text-black">tus Productos</span></h1>
        </div> 

      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">

        {msg && <Alerta alerta={alerta} />}

        {tokenValido && !passwordModificado && (
          <form action="" method="post" onSubmit={handleSubmit}>
            <div className="my-5">
              <label className="uppercase text-gray-600 block txt-xl font-bold">
                Nuevo Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Ingrese su Contraseña"
                className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="my-5">
              <label className="uppercase text-gray-600 block txt-xl font-bold">
                Repetir Nuevo Password
              </label>
              <input
                type="password"
                name="Repetirpassword"
                placeholder="Ingrese su Contraseña"
                className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                value={repetirPassword}
                onChange={e => setRepetirPassword(e.target.value)}
              />
            </div>

            <input
              type="submit"
              value="Recuperar Cuenta"
              className="bg-primary-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-primary-800 md:w-auto"
            />
          </form>

        )}

        {tokenValido && !passwordModificado && (
        
          <div>
            <Link
              className="block text-center my-5 text-gray-500"
              to="/olvide-password">
              Olvide mi Password
            </Link>
          </div> 
        )}       

        {passwordModificado && (
          <Link
            className="block text-center my-5 text-gray-500"
            to="/">
            Iniciar Sesión
          </Link>
        )}
      </div>
    </>
  )
}

export default NuevoPassword