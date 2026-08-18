

function Alerta({alerta}) {
    const {msg, error} = alerta;
  return (
    <div className={`${ error ? 'from-red-400 to-red-600' : 'from-primary-400 to-primary-600' } bg-gradient-to-br p-3 mb-10 mt-5 text-white font-bold text-center rounded-lg text-sm uppercase`}>
      <p>{msg}</p>
    </div>
  )
}

export default Alerta
