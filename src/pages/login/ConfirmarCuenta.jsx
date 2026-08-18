import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Alerta from "../../components/Alerta";
import clienteAxios from "../../config/axios";


function ConfirmarCuenta() {

    const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [alerta, setAlerta] = useState({});

    const efectoEjecutado = useRef(false);

    // extraer los parametros o sea el token
    const params = useParams();
    const {id} = params;

    // enviar el token al bankend
    useEffect(() => {
        if (efectoEjecutado.current) return; // evita que el StictMode lo ejecute 2 veces
        efectoEjecutado.current = true;

        const confirmarCuenta = async () => {
            try {
                const url = `/usuarios/confirmar/${id}`;
                const {data} = await clienteAxios(url);

                setCuentaConfirmada(true);

                setAlerta({
                    msg: data.msg
                });

            } catch (error) {
                console.log(error);
                setAlerta({
                msg: error.response?.data?.msg || 'Hubo un error al confirmar tu cuenta', 
                error: true
                });
            }

            setCargando(false);
        }
        confirmarCuenta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return (
    <>
        <div>
            <h1 className="text-primary-700 text-6xl font-black text-center"> Confirma tu Cuenta y Empieza Administrar{' '}<span className="text-black">tus Productos</span></h1>
        </div> 

   

      {/* Formulario */}
      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">

        {/* condicion si hay algo en el msg de alerta mostrarlo */}
        {!cargando && <Alerta 
          alerta={alerta}
        />}

        {/* Cuando se halla confiramdo la cuenta que aparesca un boton */}
        {cuentaConfirmada && (
            <Link 
              className="block text-center my-5 text-gray-500"
              to="/">Iniciar Sesión</Link>
        )}
      </div>
    </>
  )
}

export default ConfirmarCuenta
