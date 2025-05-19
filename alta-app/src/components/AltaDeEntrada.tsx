import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import AlumnoSelect from './AlumnoSelect'

export default function AltaDeEntrada() {
  const [nombreComprador, setNombreComprador] = useState('')
  const [emailComprador, setEmailComprador] = useState('')
  const [idAlumno, setIdAlumno] = useState<number | null>(null)
  const [cantidad, setCantidad] = useState(1)
  const [mensaje, setMensaje] = useState('')

  // Validar si los campos obligatorios están completos
  const isFormValid = Boolean(
    idAlumno !== null && 
    cantidad >= 1
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = uuidv4() // esto va en el QR

    const { error } = await supabase.from('entradas').insert({
      id,
      nombre_comprador: nombreComprador,
      email_comprador: emailComprador,
      id_alumno: idAlumno,
      cantidad,
    })

    if (error) {
      setMensaje('Error al guardar: ' + error.message)
    } else {
      setMensaje('Entrada registrada. QR generado con ID: ' + id)
      // Acá podrías usar el ID para generar un QR y mostrarlo
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Alta de entrada</h1>
      
      <div className="form-group">
        <label htmlFor="nombre">Nombre del comprador</label>
        <input 
          id="nombre"
          value={nombreComprador} 
          onChange={(e) => setNombreComprador(e.target.value)} 
          placeholder="Nombre" 
          required 
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email del comprador</label>
        <input 
          id="email"
          value={emailComprador} 
          onChange={(e) => setEmailComprador(e.target.value)} 
          placeholder="Email" 
          type="email" 
          required 
        />
      </div>
      
      <div className="form-group">
        <label>Alumno</label>
        <AlumnoSelect value={idAlumno} onChange={setIdAlumno} required />
      </div>
      
      <div className="form-group">
        <label htmlFor="cantidad">Cantidad de entradas</label>
        <input 
          id="cantidad"
          value={cantidad} 
          onChange={(e) => setCantidad(parseInt(e.target.value))} 
          type="number" 
          placeholder="Cantidad de entradas que compró" 
          min={1} 
        />
      </div>
      
      <div className="form-group">
        <button 
          type="submit" 
          disabled={!isFormValid}
        >
          Generar entrada
        </button>
      </div>
      
      {mensaje && <p>{mensaje}</p>}
    </form>
  )
}
