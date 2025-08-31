
import { toaster } from '../chakra/toaster';

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
  try {
    const clipboardItem = new ClipboardItem({
      ["text/plain"]: textContent,
      ["text/html"]: htmlContent,
    });
    navigator.clipboard.write([clipboardItem]).then(() => {
      toaster.create({
        description: `Texto ${textContent !== htmlContent
          ? 'formateado ' : ''}copiado al portapapeles`,
        type: 'success',
      });
    }).catch(err => {
      console.error('Error al copiar con HTML: ', err);
      toaster.create({
        description: 'Error al copiar con HTML',
        type: 'error',
      });
    });
  } catch {
    // si falla intentar copiar sin formato nomas
    try {
      await navigator.clipboard.writeText(textContent);
      toaster.create({
        description: 'Texto copiado al portapapeles',
        type: 'success',
      });
    } catch (err) {
      console.error('Error al copiar al portapeles:', err);
      toaster.create({
        description: 'Error al copiar al portapeles',
        type: 'error',
      });
    }
  }
};