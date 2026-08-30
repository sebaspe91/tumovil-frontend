import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hook/useAuth";
import { 
    FaUsers, 
    FaUserFriends,
    FaBoxOpen, 
    FaFileInvoice, 
    FaBuilding,
    FaChevronDown, 
    FaChevronRight, 
    FaUserCircle,
    FaTags, 
    FaTruck, 
    FaBars, 
    FaTimes
} from 'react-icons/fa';

// Configuración del menú: cada ítem sabe qué roles pueden verlo
const menuItems = [
    {
        id: 'perfil',
        label: 'Perfil',
        icon: FaUserCircle,
        roles: ['ADMIN', 'VENDEDOR'], // ambos pueden verlo
        submenu: [
            { label: 'Editar Perfil', to: '/admin-users/perfil', roles: ['ADMIN', 'VENDEDOR'] },
            { label: 'Cambiar Password', to: '/admin-users/cambiar-password', roles: ['ADMIN', 'VENDEDOR'] },
        ]
    },
    {
        id: 'usuarios', // valor unico
        label: 'Usuarios', // muestra en pantalla
        icon: FaUsers, // icono a mostrar
        roles: ['ADMIN'], // tipo_users, rol para mostrar segun admin
        submenu: [ // sub lista 
            { label: 'Lista de usuarios', to: '/admin-users', roles: ['ADMIN'] },
            { label: 'Usuarios eliminados', to: '/admin-users/eliminados', roles: ['ADMIN'] },
        ]
    },
    {
        id: 'cliente',
        label: 'Clientes',
        icon: FaUserFriends,
        roles: ['ADMIN', 'VENDEDOR'], // SOLO admin
        submenu: [
            { label: 'Lista de clientes', to: '/clientes', roles: ['ADMIN', 'VENDEDOR'] },
            { label: 'Crear clientes', to: '/clientes/crear', roles: ['ADMIN', 'VENDEDOR'] },
        ]
    },
    {
        id: 'productos',
        label: 'Productos',
        icon: FaBoxOpen,
        roles: ['ADMIN', 'VENDEDOR'], // ambos, pero el submenú puede variar
        submenu: [
            { label: 'Lista de productos', to: '/admin-productos', roles: ['ADMIN', 'VENDEDOR'] },
            { label: 'Crear producto', to: '/admin-productos/crear', roles: ['ADMIN'] }, // solo admin crea
            { label: 'Marcas', to: '/admin-marcas', icon: FaTags, roles: ['ADMIN'] },
        ]
    },
    {
        id: 'facturas',
        label: 'Facturas',
        icon: FaFileInvoice,
        roles: ['ADMIN', 'VENDEDOR'],
        submenu: [
            { label: 'Facturas clientes', to: '/facturas-cliente', roles: ['ADMIN', 'VENDEDOR'] },
            { label: 'Facturas proveedor', to: '/facturas-proveedor', icon: FaTruck, roles: ['ADMIN'] }, // solo admin
        ]
    },
    {
        id: 'empresa',
        label: 'Empresa',
        icon: FaBuilding,
        to: '/admin-empresa',
        roles: ['ADMIN'] // SOLO admin
    },
];

function Sidebar() {
    const { auth, cerrarSesion } = useAuth();
    const { tipo_user } = auth;

    // state para controlar la pantalla y menus con submenus
    const [menuAbierto, setMenuAbierto] = useState(null);
    const [sidebarAbierto, setSidebarAbierto] = useState(false);
    const location = useLocation(); // señala que menu estamos

    // mira que menu esta seleccionado para resaltarlo
    const toggleMenu = (menu) => {
        setMenuAbierto(menuAbierto === menu ? null : menu);
    }

    // valida cual es la ruta seleccionada 
    const esRutaActiva = (ruta) => location.pathname === ruta;
    // valida cual es la subRuta seleccionada
    const tieneSubrutaActiva = (submenu) => submenu?.some(item => location.pathname === item.to);

    // clases reutilizables
    const claseLinkActivo = "bg-primary-500 font-black";
    const claseLinkNormal = "hover:bg-primary-500";

    // Filtra los ítems principales según el rol del usuario logueado
    const menuFiltrado = menuItems.filter(item => item.roles.includes(tipo_user));

    return (
        <>
            {/* boton desplegable de menu */}
            <button
                onClick={() => setSidebarAbierto(true)}
                className="lg:hidden fixed top-4 left-4 z-30 bg-primary-600 text-white p-3 rounded-lg shadow-lg"
            >
                <FaBars className="text-xl" />
            </button>

            {/* coloca la pantalla mas oscura detras del menu */}
            {sidebarAbierto && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarAbierto(false)}
                />
            )}

            {/* el menu vertical */}
            <aside 
                className={`
                    w-64 bg-primary-600 min-h-screen text-white
                    fixed top-0 left-0 z-50 transition-transform duration-300
                    lg:translate-x-0 lg:static lg:z-auto
                    ${sidebarAbierto ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* el contendor de menu */}
                <div className="p-5">
                    {/* contenedor del titulo y boton X */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black">TuMovil</h2>
                        <button onClick={() => setSidebarAbierto(false)} className="lg:hidden text-white">
                            {/* icono X tamaño xl */}
                            <FaTimes className="text-xl" />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {/* toma cada objeto de menuFiltrado para mostrarlo en el menu de lainterfaz */}
                        {menuFiltrado.map(item => {
                            const Icon = item.icon;

                            // Ítem SIN submenú (enlace directo)
                            if (!item.submenu) {
                                return (
                                    <Link 
                                        key={item.id} // el id del objeto
                                        to={item.to} // la direccion
                                        onClick={() => setSidebarAbierto(false)} // si da click se cierra el panel del menu
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${esRutaActiva(item.to) ? claseLinkActivo : claseLinkNormal}`} // selleciona la ruta que esta leyendo
                                    >
                                        {/* colocamos el icono que tiene el objeto */}
                                        <Icon className="text-lg" />
                                        <span className="font-semibold uppercase text-sm">{item.label}</span>
                                    </Link>
                                );
                            }

                            // Filtra también el submenú por rol
                            const submenuFiltrado = item.submenu.filter(sub => sub.roles.includes(tipo_user));

                            // Si tras filtrar no queda ningún subenlace, no muestres el padre
                            if (submenuFiltrado.length === 0) return null;

                            // Ítem CON submenú
                            return (
                                // div del sub menu
                                <div key={item.id}>
                                    {/* boton del submenu */}
                                    <button
                                        onClick={() => toggleMenu(item.id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${tieneSubrutaActiva(submenuFiltrado) ? claseLinkActivo : claseLinkNormal}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="text-lg" />
                                            <span className="font-semibold uppercase text-sm">{item.label}</span>
                                        </div>
                                        {menuAbierto === item.id ? <FaChevronDown /> : <FaChevronRight />}
                                    </button>

                                    {menuAbierto === item.id && (
                                        <div className="flex flex-col ml-8 mt-1 gap-1">
                                            {submenuFiltrado.map(sub => {
                                                const SubIcon = sub.icon;
                                                return (
                                                    <Link 
                                                        key={sub.to}
                                                        to={sub.to}
                                                        onClick={() => setSidebarAbierto(false)}
                                                        className={`p-2 text-sm rounded-lg flex items-center gap-2 ${esRutaActiva(sub.to) ? claseLinkActivo : claseLinkNormal}`}
                                                    >
                                                        {SubIcon && <SubIcon className="text-xs" />}
                                                        {sub.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                    <div className="mt-10 text-center">
                        {/* Boton de cerrar Sesión */}
                        <button
                            type="button"
                            className="text-white text-sm uppercase font-bold hover:bg-primary-500 p-3 border"
                            onClick={cerrarSesion}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar;