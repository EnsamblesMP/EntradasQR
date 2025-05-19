import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

interface Alumno {
  alumno_id: number;
  alumno_nombre: string;
}

interface AlumnoSelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
  required?: boolean;
}

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const AlumnoSelect = ({ value, onChange, required = false }: AlumnoSelectProps) => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const obtenAlumnos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('alumnos_con_grupo')
          .select('alumno_id, alumno_nombre')
          .eq('grupo_year', getCurrentYear())
          .order('alumno_nombre', { ascending: true });
        
        if (error) throw error;
        
        setAlumnos(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando alumnos');
        console.error('Error cargando alumnos:', err);
      } finally {
        setLoading(false);
      }
    };
    
    obtenAlumnos();
  }, []);
  
  return (
    <div>
      {loading ? (
        <p>Cargando alumnos...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
          required={required}
          className="form-select"
        >
          <option value="">Seleccionar alumno</option>
          {alumnos.map((alumno) => (
            <option key={alumno.alumno_id} value={alumno.alumno_id}>
              {alumno.alumno_nombre}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default AlumnoSelect;
