import { useState } from "react";
import useProveedor from "../../hook/useProveedor";
import Alerta from "../Alerta";

function FormularioProveedor() {

    // elementos del provider de proveedor
    const {guardarProveedor, proveedor, alerta, setAlerta, cerrarModalFormularioProveedor} = useProveedor();

    // state para crear o editar proveedor
    const [proveedorRegistrar, setProveedorRegistrar] = useState(() => ({
        id_proveedor: proveedor?.id_proveedor, // valida editar o crear
        nombre_prov: proveedor?.nombre_prov ?? '',
        nit_prov: proveedor?.nit_prov ?? '',
        correo_prov: proveedor?.correo_prov ?? '',
        telefono_prov: proveedor?.telefono_prov ?? '',
        cuenta_prov: proveedor?.cuenta_prov ?? '',
    }));

    // editar
    const modoEdicion = Boolean(proveedorRegistrar.id_proveedor);

    // Funciones
    const handleSubmit = async e => {
        e.preventDefault();

        const {nombre_prov, nit_prov, correo_prov, telefono_prov} = proveedorRegistrar;

        setTimeout(() => {
            setAlerta({});
        }, 3000);

        // validar
        if ([nombre_prov, nit_prov, correo_prov, telefono_prov].includes(undefined) || [nombre_prov, nit_prov, correo_prov, telefono_prov].includes('')) {
            setAlerta({
                msg: 'Hay campos vacios que son obligatorios',
                error: true
            });
            return;
        }

        // Toda la validacion esta bien
        setAlerta({});

        try {
            const resultado = await guardarProveedor(proveedorRegistrar);

            setAlerta(resultado);

            // si el backend respondio con error, dejamos el formulario
            // abierto y con los datos tal cual, para que se puedan corregir
            if (resultado?.error) return;

            setTimeout(() => {
                cerrarModalFormularioProveedor();
            }, 1200);
        } catch (error) {
            console.log(error);
            return {
                msg: error.response?.data?.msg || 'Fallo la opereacion con el Cliente',
                error: true
            };
        }

    }

    const {msg} = alerta;

  return (
    <>
      <form 
        onSubmit={handleSubmit}
      >
        {/* Nombre del proveedor */}
        <div className="uppercase text-gray-600 block text-xl font-bold mb-5">
            <label htmlFor="nombre_prov">*Nombre del proveedor</label>
            <input 
                type="text"
                id="nombre_prov"
                placeholder="Nombre del proveedor"
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl"
                value={proveedorRegistrar.nombre_prov || ''}
                onChange={
                    e => setProveedorRegistrar({
                        ...proveedorRegistrar,
                        [e.target.id] : e.target.value
                    })
                }
            />
        </div>

        {/* Nit */}
        <div className="uppercase text-gray-600 block text-xl font-bold mb-5">
            <label htmlFor="nit_prov">*Nit</label>
            <input 
                type="text"
                id="nit_prov"
                placeholder="Nombre del proveedor"
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl"
                value={proveedorRegistrar.nit_prov || ''}
                onChange={
                    e => setProveedorRegistrar({
                        ...proveedorRegistrar,
                        [e.target.id] : e.target.value
                    })
                }
            />
        </div>

        {/* Correo */}
        <div className="uppercase text-gray-600 block text-xl font-bold mb-5">
            <label htmlFor="correo_prov">*Correo</label>
            <input 
                type="email"
                id="correo_prov"
                placeholder="Nombre del proveedor"
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl"
                value={proveedorRegistrar.correo_prov || ''}
                onChange={
                    e => setProveedorRegistrar({
                        ...proveedorRegistrar,
                        [e.target.id] : e.target.value
                    })
                }
            />
        </div>

        {/* Telefono */}
        <div className="uppercase text-gray-600 block text-xl font-bold mb-5">
            <label htmlFor="telefono_prov">*Telefono</label>
            <input 
                type="tel"
                id="telefono_prov"
                placeholder="Nombre del proveedor"
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl"
                value={proveedorRegistrar.telefono_prov || ''}
                onChange={
                    e => setProveedorRegistrar({
                        ...proveedorRegistrar,
                        [e.target.id] : e.target.value
                    })
                }
            />
        </div>

        {/* Cuenta bancaria */}
        <div className="uppercase text-gray-600 block text-xl font-bold mb-5">
            <label htmlFor="cuenta_prov">Nuemro de Cuenta</label>
            <input 
                type="text"
                id="cuenta_prov"
                placeholder="Nombre del proveedor"
                className="border-2 w-full p-2 mt-2 placeholder-gray-400 bg-gray-50 rounded-xl"
                value={proveedorRegistrar.cuenta_prov || ''}
                onChange={
                    e => setProveedorRegistrar({
                        ...proveedorRegistrar,
                        [e.target.id] : e.target.value
                    })
                }
            />
        </div>

        {msg &&
            <Alerta
                alerta={alerta}
            />
        }

        {/* boton */}
        <input 
            type="submit" 
            value={modoEdicion ? 'Editar Proveedor' : 'Registrar Proveedor'}
            className="bg-primary-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-primary-800"
        />
      </form>
    </>
  )
}

export default FormularioProveedor
