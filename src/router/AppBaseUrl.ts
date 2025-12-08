export const routerAppBaseName: string = '/EntradasQR/';

export const getRouterBaseUrl = () => {
  if (import.meta.env.PROD) {
    return `https://ensamblesmp.github.io${routerAppBaseName}`;
  } else {
    return `${window.location.origin}${routerAppBaseName}`;
  }
}