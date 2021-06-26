let IFRAME_CACHE = null;
export const getIframe = (): HTMLIFrameElement => {
  if (IFRAME_CACHE) return IFRAME_CACHE;
  IFRAME_CACHE = document.getElementById('dnd-iframe') as HTMLIFrameElement;
  return IFRAME_CACHE;
};

export const setIframe = (iframe: HTMLIFrameElement | null) =>
  (IFRAME_CACHE = iframe);

export const cleanCaches = () => {
  setIframe(null);
};
