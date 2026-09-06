import { useState } from "react";
import useEmpresa from "../../hook/useEmpresa";
import Alerta from "../../components/Alerta";

function AdminEmpresa() {

    const {empresa, actualizarEmpresa} = useEmpresa();

    // mientras "editando" sea false, los campos se ven pero no se pueden
    // tocar (se muestran directo desde "empresa", el dato real del
    // contexto). Solo al hacer click en "Editar Datos" se copian esos
    // valores a "datos" y se habilitan los inputs.
    const [editando, setEditando] = useState(false);
    const [datos, setDatos] = useState({});
    const [alerta, setAlerta] = useState({});

    // Aca es donde antes estaba el useEffect. Copiar "empresa" a "datos"
    // ahora pasa dentro de un evento (el click de "Editar"), no de forma
    // automatica cada vez que "empresa" cambia -- por eso ya no aparece
    // la advertencia de React sobre llamar setState dentro de un efecto.
    const iniciarEdicion = () => {
        setDatos(empresa);
        setEditando(true);
        setAlerta({});
    }

    // Cancelar: vuelve a modo solo-lectura y descarta cualquier cambio
    // que se haya escrito sin guardar.
    const cancelarEdicion = () => {
        setEditando(false);
        setAlerta({});
    }

    const handleSubmit = async e => {
        e.preventDefault();

        const {nombre_empresa, nit_empresa, correo_empresa, cel_empresa} = datos;

        setTimeout(() => {
            setAlerta({});
        }, 3000);

        // validar campos obligatorios
        if ([nombre_empresa, nit_empresa, correo_empresa, cel_empresa].includes(undefined) || [nombre_empresa, nit_empresa, correo_empresa, cel_empresa].includes('')) {
            setAlerta({
                msg: 'Hay campos vacios que son obligatorios',
                error: true
            });
            return;
        }

        setAlerta({});

        const resultado = await actualizarEmpresa(datos);
        setAlerta(resultado);

        // si se guardo bien, volvemos a modo solo-lectura
        if (!resultado?.error) {
            setEditando(false);
        }
    }

    const {msg} = alerta;

    // clases del input segun si se puede editar o no
    const claseInput = editando
        ? "border w-full p-3 mt-3 bg-gray-50 rounded-xl"
        : "border w-full p-3 mt-3 bg-gray-100 text-gray-500 rounded-xl cursor-not-allowed";

    return (
        <>
            <div>
                <h1 className="text-primary-700 text-6xl font-black text-center">
                    Datos de la {' '}<span className="text-black">Empresa</span>
                </h1>
            </div>

            <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white md:mx-10">
                <form onSubmit={handleSubmit}>

                    {/* Nombre */}
                    <div className="my-5">
                        <label className="uppercase text-gray-600 block txt-xl font-bold">
                            *Nombre de la empresa
                        </label>

                        <input
                            type="text"
                            name="nombre_empresa"
                            disabled={!editando}
                            placeholder="Escribe el nombre de la empresa"
                            className={claseInput}
                            value={(editando ? datos.nombre_empresa : empresa.nombre_empresa) || ''}
                            onChange={e => setDatos({
                                ...datos,
                                [e.target.name]: e.target.value
                            })}
                        />
                    </div>

                    {/* Nit */}
                    <div className="my-5">
                        <label className="uppercase text-gray-600 block txt-xl font-bold">
                            *Nit
                        </label>

                        <input
                            type="text"
                            name="nit_empresa"
                            disabled={!editando}
                            placeholder="Escribe el Nit de la empresa"
                            className={claseInput}
                            value={(editando ? datos.nit_empresa : empresa.nit_empresa) || ''}
                            onChange={e => setDatos({
                                ...datos,
                                [e.target.name]: e.target.value
                            })}
                        />
                    </div>

                    {/* Correo */}
                    <div className="my-5">
                        <label className="uppercase text-gray-600 block txt-xl font-bold">
                            *Correo
                        </label>

                        <input
                            type="email"
                            name="correo_empresa"
                            disabled={!editando}
                            placeholder="Escribe el correo de la empresa"
                            className={claseInput}
                            value={(editando ? datos.correo_empresa : empresa.correo_empresa) || ''}
                            onChange={e => setDatos({
                                ...datos,
                                [e.target.name]: e.target.value
                            })}
                        />
                    </div>

                    {/* Celular */}
                    <div className="my-5">
                        <label className="uppercase text-gray-600 block txt-xl font-bold">
                            *Celular
                        </label>

                        <input
                            type="tel"
                            inputMode="tel"
                            name="cel_empresa"
                            disabled={!editando}
                            placeholder="Escribe el celular de la empresa"
                            className={claseInput}
                            value={(editando ? datos.cel_empresa : empresa.cel_empresa) || ''}
                            onChange={e => setDatos({
                                ...datos,
                                [e.target.name]: e.target.value
                            })}
                        />
                    </div>

                    {msg &&
                        <Alerta
                            alerta={alerta}
                        />
                    }

                    {/* Solo-lectura: un boton que habilita la edicion.
                        Editando: Guardar (submit real) + Cancelar. Asi
                        nunca se puede guardar sin haber entrado a
                        edicion a proposito. */}
                    {!editando ? (
                        <button
                            type="button"
                            onClick={iniciarEdicion}
                            className="bg-primary-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-primary-800"
                        >
                            Editar Datos
                        </button>
                    ) : (
                        <div className="flex gap-3 mt-5">
                            <button
                                type="submit"
                                className="flex-1 bg-primary-700 py-3 px-10 rounded-xl text-white uppercase font-bold hover:cursor-pointer hover:bg-primary-800"
                            >
                                Guardar Cambios
                            </button>
                            <button
                                type="button"
                                onClick={cancelarEdicion}
                                className="flex-1 border-2 text-gray-600 py-3 px-10 rounded-xl uppercase font-bold hover:cursor-pointer hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                        </div>
                    )}

                </form>
            </div>
        </>
    )
}

export default AdminEmpresa;
