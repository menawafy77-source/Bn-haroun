/**
 * Helper to resolve media paths for deployment compatibility.
 * Assets placed in the public/ folder are served from the root path.
 */
export const getPublicMediaPath = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${cleanPath}`;
};
