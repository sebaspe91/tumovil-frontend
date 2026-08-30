import useAuth from "../hook/useAuth";
import { FaUserAlt, FaUserTie } from 'react-icons/fa';

function Header() {

    const {auth} = useAuth();
    const {nombre_user, apellido_user, tipo_user} = auth;

    // se recalcula solo en cada render, a partir de "auth" -- no hace
    // falta useState ni useEffect: apenas actualizarPerfil haga setAuth()
    // con los datos nuevos, este componente se vuelve a renderizar solo
    // y nombreUsuario ya sale actualizado
    const nombreUsuario = `${nombre_user} ${apellido_user}`;

  return (
    <header className="py-3 bg-primary-600">

        <div className="container mx-auto flex flex-col lg:flex-row justify-center items-center">

            <h1 className="font-bold text-2xl text-primary-200 text-center lg:hidden">Tu<span className="text-white font-black">Movil</span></h1>

            <p className="flex items-center gap-2 font-bold text-center mt-2 lg:mt-0 text-primary-200 uppercase">
                {tipo_user === 'ADMIN' ? <FaUserTie /> : <FaUserAlt />} <span className="font-black text-primary-100">{nombreUsuario}</span>
            </p>

        </div>

    </header>
  )
}

export default Header
