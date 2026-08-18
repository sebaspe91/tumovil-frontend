import { Link } from "react-router-dom";

function Login() {
  return (
    <>
        <div>
            <h1 className="text-primary-700 text-6xl font-black text-center">Incia Sesión en <span className="text-black">TuMovil</span></h1>
        </div> 
        <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
            
            <form action="">

                {/* Email */}
                <div className="my-5">
                    <label className="uppercase text-gray-600 block txt-xl font-bold">
                        Email
                    </label>

                    <input 
                        type="email" 
                        placeholder="Email de Registro"
                        className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                    />
                </div>

                {/* password */}
                <div className="my-5">
                    <label 
                        className="uppercase text-gray-600 block txt-xl font-bold"
                    >
                        Contraseña
                    </label>
                    <input 
                        type="password" 
                        placeholder="Ingrese su Contraseña"
                        className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                    />
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
