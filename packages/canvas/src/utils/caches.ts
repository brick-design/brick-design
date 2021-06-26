let IFRAME_CACHE = null;
export const getIframe = (): HTMLIFrameElement => {
  if (IFRAME_CACHE) return IFRAME_CACHE;
  IFRAME_CACHE = document.getElementById('dnd-iframe') as HTMLIFrameElement;
  return IFRAME_CACHE;
};

export const setIframe = (iframe: HTMLIFrameElement | null) =>
  (IFRAME_CACHE = iframe);

export let LOCK_IDS:{[key:string]:string}|null=null;
export const setLockIds=(id:string)=>{
  if(!LOCK_IDS) LOCK_IDS={id};
  LOCK_IDS[id]=id;
};

export const getLockIds=()=>LOCK_IDS;

export const deleteIdFromLockIds=(id:string)=>{
  delete LOCK_IDS[id];
};


export const cleanCaches = () => {
  setIframe(null);
  setLockIds(null);
};


