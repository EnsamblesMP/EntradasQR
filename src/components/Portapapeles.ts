import { toaster } from '../chakra/toaster';

const copiarConExecCommand = (htmlContent: string): boolean => {
  try {
    // Crear elemento temporal oculto
    const tempElement = document.createElement('div');
    tempElement.style.position = 'fixed';
    tempElement.style.left = '-9999px';
    tempElement.innerHTML = htmlContent;
    document.body.appendChild(tempElement);

    // Seleccionar el contenido
    const range = document.createRange();
    range.selectNodeContents(tempElement);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    // Ejecutar comando de copia
    const success = document.execCommand('copy');

    // Limpiar
    selection?.removeAllRanges();
    document.body.removeChild(tempElement);

    return success;
  } catch (err) {
    console.error('Error en execCommand:', err);
    return false;
  }
};

export const copiarHtmlAlPortapapeles = async (htmlElementToCopy: HTMLElement) => {
  const htmlContent = htmlElementToCopy.innerHTML;
  const textContent = htmlContent
    .replace(/<div[^>]*>/g, '') // Remove divs but keep content
    .replace(/<\/div>/g, '\n')  // Replace div ends with newlines
    .replace(/<p[^>]*>/g, '') // Remove p but keep content
    .replace(/<\/p>/g, '\n')  // Replace p ends with newlines
    .replace(/<br[^>]*>/g, '\n') // Replace <br> with newlines
    .replace(/<[^>]*>/g, '')     // Remove all remaining HTML tags
    .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines to 2
    .trim();

  // Intentar con Clipboard API moderna (funciona en Chrome)
  try {
    const clipboardItem = new ClipboardItem({
      ["text/plain"]: new Blob([textContent], { type: 'text/plain' }),
      ["text/html"]: new Blob([htmlContent], { type: 'text/html' }),
    });
    await navigator.clipboard.write([clipboardItem]);
    toaster.create({
      description: `Texto ${textContent !== htmlContent
        ? 'formateado ' : ''}copiado al portapapeles`,
      type: 'success',
    });
    return;
  } catch (err) {
    console.log('Clipboard API falló, intentando con execCommand...', err);
  }

  // Fallback: document.execCommand (mejor compatibilidad con Firefox)
  if (copiarConExecCommand(htmlContent)) {
    toaster.create({
      description: `Texto ${textContent !== htmlContent
        ? 'formateado ' : ''}copiado al portapapeles`,
      type: 'success',
    });
    return;
  }

  // Último recurso: copiar solo texto plano
  try {
    await navigator.clipboard.writeText(textContent);
    toaster.create({
      description: 'Texto copiado al portapapeles (sin formato)',
      type: 'success',
    });
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    toaster.create({
      description: 'Error al copiar al portapapeles',
      type: 'error',
    });
  }
};