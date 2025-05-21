import React, { useState } from 'react'
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

    if (!isFormValid) {
      setMensaje('Fallo inesperado de validacion')
      return
    }

    try {
      setMensaje('Guardando entrada...')
      
      // Generar un nuevo UUID para la entrada
      const id = uuidv4()
      
      // Insertar en la tabla 'entradas' de Supabase
      const { data, error } = await supabase
        .from('entradas')
        .insert([
          {
            id,
            nombre_comprador: nombreComprador.trim(),
            email_comprador: emailComprador.trim().toLowerCase(),
            cantidad: cantidad,
            id_alumno: idAlumno,
          }
        ])
        .select()

      if (error) throw error
      
      // Limpiar el formulario después de un envío exitoso
      setNombreComprador('')
      setEmailComprador('')
      setIdAlumno(null)
      setCantidad(1)
      
      setMensaje(`✅ Entrada registrada exitosamente con ID: ${id}`)
      
      // Aquí podrías usar el ID para generar un código QR
      // generarYMostrarQR(id)
      
    } catch (error) {
      console.error('Error al guardar la entrada:', error)
      setMensaje(`❌ Error al guardar: ${error.message}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Alta de entrada</h1>
      
      <div className="mb-6">
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del comprador
        </label>
        <input 
          id="nombre"
          value={nombreComprador} 
          onChange={(e) => setNombreComprador(e.target.value)} 
          placeholder="Nombre" 
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email del comprador
        </label>
        <input 
          id="email"
          value={emailComprador} 
          onChange={(e) => setEmailComprador(e.target.value)} 
          placeholder="Email" 
          type="email" 
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alumno
        </label>
        <AlumnoSelect value={idAlumno} onChange={setIdAlumno} required />
      </div>
      
      <div className="mb-6">
        <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-1">
          Cantidad de entradas
        </label>
        <input 
          id="cantidad"
          value={cantidad} 
          onChange={(e) => setCantidad(parseInt(e.target.value) || 0)} 
          type="number" 
          placeholder="Cantidad de entradas que compró" 
          min="1"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="mb-6">
        <button 
          type="submit" 
          disabled={!isFormValid}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${isFormValid 
            ? 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' 
            : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Generar entrada
        </button>
      </div>
      
      {mensaje && (
        <p className={`mt-4 p-3 rounded-md text-center ${
          mensaje.includes('❌') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {mensaje}
        </p>
      )}
    </form>
  )
}
