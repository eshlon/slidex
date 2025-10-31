const BASE_PATH = '/slidex';

/**
 * A wrapper around the native fetch function that automatically prepends the 
 * Next.js basePath and ensures a trailing slash, as configured in next.config.ts.
 * @param path The API endpoint path (e.g., '/api/presentations/generate-outline').
 * @param options The standard fetch options (method, headers, body, etc.).
 * @returns A Promise that resolves to the Response object.
 */
export async function fetchApi(path: string, options: RequestInit = {}) {
  // Ensure the path starts with a slash for consistent joining.
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Construct the full URL with the base path.
  let url = `${BASE_PATH}${formattedPath}`;

  // Ensure the final URL has a trailing slash as required by next.config.ts.
  if (!url.endsWith('/')) {
    url += '/';
  }

  return fetch(url, options);
}
