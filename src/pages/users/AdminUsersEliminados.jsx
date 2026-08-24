
import ListaUsuariosEliminados from '../../components/users/ListaUsuariosEliminados';



function AdminUsersEliminados() {
  return (
    <div className='flex flex-col md:flex-row gap-10 w-full'>
        <div>
            <ListaUsuariosEliminados />
        </div>
      
    </div>
  )
}

export default AdminUsersEliminados
