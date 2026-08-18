import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <>
      <main className="container mx-auto md:grid md:grid-cols-2 mt-5 gap-6 p-5 items-center">
        {/* Mostrar paginas hijos */}
        <Outlet />
      </main>
    </>
  )
}

export default AuthLayout
