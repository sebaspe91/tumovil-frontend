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

    // logoFile: el archivo que se eligio en el <input type="file">
    // (todavia no se ha subido, solo esta seleccionado).
    // logoPreview: una URL temporal que genera el navegador para poder
    // mostrar ESE archivo en la pantalla antes de guardar (asi el
    // usuario ve una vista previa de lo que va a subir).
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    // Aca es donde antes estaba el useEffect. Copiar "empresa" a "datos"
    // ahora pasa dentro de un evento (el click de "Editar"), no de forma
    // automatica cada vez que "empresa" cambia -- por eso ya no aparece
    // la advertencia de React sobre llamar setState dentro de un efecto.
    const iniciarEdicion = () => {
        setDatos(empresa);
        setLogoFile(null);
        setLogoPreview(null);
        setEditando(true);
        setAlerta({});
    }

    // se llama cuando eliges un archivo en el input de tipo "file"
    const handleLogoChange = e => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        setLogoFile(archivo);
        // URL.createObjectURL crea un link temporal (solo funciona en
        // este navegador, en esta pestaña) que apunta al archivo que
        // esta en tu computador -- por eso podemos mostrarlo en el
        // <img> de una vez, sin haberlo subido todavia al backend.
        setLogoPreview(URL.createObjectURL(archivo));
    }

    // Cancelar: vuelve a modo solo-lectura y descarta cualquier cambio
    // que se haya escrito sin guardar.
    const cancelarEdicion = () => {
        setEditando(false);
        setLogoFile(null);
        setLogoPreview(null);
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

        // FormData es la unica forma de mandar un archivo junto con
        // texto en la misma peticion. Si no elegiste un logo nuevo, se
        // manda igual pero sin el campo "logo" -- el backend, al no
        // recibir archivo, deja el logo que ya estaba.
        const formData = new FormData();
        formData.append('nombre_empresa', nombre_empresa);
        formData.append('nit_empresa', nit_empresa);
        formData.append('correo_empresa', correo_empresa);
        formData.append('cel_empresa', cel_empresa);

        if (logoFile) {
            formData.append('logo', logoFile);
        }

        const resultado = await actualizarEmpresa(formData);
        setAlerta(resultado);

        // si se guardo bien, volvemos a modo solo-lectura
        if (!resultado?.error) {
            setEditando(false);
            setLogoFile(null);
            setLogoPreview(null);
        }
    }

    const {msg} = alerta;

    // que logo se muestra en el recuadro:
    // 1) si hay una vista previa de un archivo recien elegido, esa
    // 2) si no, pero la empresa ya tiene un logo guardado, se arma la
    //    URL completa apuntando al backend (ahi es donde vive el archivo)
    // 3) si no hay ninguno de los dos, no se muestra nada (recuadro vacio)
    const logoMostrar = logoPreview
        ? logoPreview
        : (empresa.logo_empresa
            ? `${import.meta.env.VITE_BACKEND_URL}/uploads/empresa/${empresa.logo_empresa}`
            : null);

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

                    {/* Logo */}
                    <div className="my-5">
                        <label className="uppercase text-gray-600 block txt-xl font-bold">
                            Logo de la empresa
                        </label>

                        <div className="flex items-center gap-4 mt-3">
                            <div className="w-24 h-24 border rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                                {logoMostrar ? (
                                    <img
                                        src={logoMostrar}
                                        alt="Logo de la empresa"
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400 text-center px-2">Sin logo</span>
                                )}
                            </div>

                            {/* el input de archivo solo aparece en modo edicion, igual que los demas campos */}
                            {editando && (
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleLogoChange}
                                    className="text-sm text-gray-600"
                                />
                            )}
                        </div>
                    </div>

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
