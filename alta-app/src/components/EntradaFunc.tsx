export function esGuidValido(idEntrada: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idEntrada);
}

export const calcularRestantes = (compradas: number, usadas: number) => {
  return compradas - usadas;
};

export const darEstado = (compradas: number, usadas: number) => {
  if (compradas === usadas) {
    return 'Ya usada';
  }
  if (usadas === 0) {
    return 'Pendiente';
  }
  if (usadas < compradas) {
    return 'Parcialmente usada';
  }
  return 'Usada de más';
};

export const darColorEstado = (compradas: number, usadas: number) => {
  if (compradas === usadas) {
    return 'red';
  }
  if (usadas === 0) {
    return 'green';
  }
  if (usadas < compradas) {
    return 'yellow';
  }
  return 'purple';
};
