/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import routing from "./routing-policy.json";

interface Env {
  ASSETS: Fetcher;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  hostRuntime?: "node";
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const redirects: Record<string, string> = routing.redirects;

    if (redirects[url.pathname]) {
      return secure(Response.redirect(new URL(redirects[url.pathname], url), 308));
    }

    // No servir index.html heredados sobre las rutas de la aplicación. Los recursos
    // explícitos sí pasan por ASSETS y reciben los mismos controles que el HTML.
    if (routing.assetPaths.includes(url.pathname) || routing.assetPrefixes.some(prefix => url.pathname.startsWith(prefix))) {
      if (!env.ASSETS) {
        // El adaptador Node resuelve la señal de archivo estático de Vinext.
        // hostRuntime procede del contexto del servidor, nunca de un header.
        if (ctx?.hostRuntime === "node") return secure(await handler.fetch(request, env, ctx), url.pathname.startsWith("/archivo/"));
        return secure(new Response("Recurso no disponible", {status: 503}));
      }
      return secure(await env.ASSETS.fetch(request), url.pathname.startsWith("/archivo/"));
    }

    if (/^\/archivo\/?$/.test(url.pathname)) {
      const assetUrl = new URL(url);
      assetUrl.pathname = `${url.pathname.replace(/\/$/, "")}/index.html`;
      if (!env.ASSETS) return secure(Response.redirect(assetUrl, 307), url.pathname.startsWith("/archivo"));
      const asset = await env.ASSETS.fetch(new Request(assetUrl, request));
      if (asset.status !== 404) return secure(asset, url.pathname.startsWith("/archivo"));
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return secure(await handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths));
    }

    return secure(await handler.fetch(request, env, ctx), url.pathname.startsWith("/archivo/"));
  },
};

function secure(response: Response, archive = false): Response {
  const headers = new Headers(response.headers);
  headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  const signal = Symbol.for('vinext.static-file-signal');
  const descriptor = Object.getOwnPropertyDescriptor(response, signal);
  const staticPath = typeof descriptor?.value === 'string' ? descriptor.value : '';
  const mediaType = headers.get("Content-Type") ?? "";
  if (mediaType.includes("text/html") || /\.html$/.test(staticPath) || response.status >= 300) headers.set("Cache-Control", routing.htmlCacheControl);
  else if (mediaType.includes("application/pdf") || mediaType.includes("application/json") || /\.(pdf|json)$/.test(staticPath)) headers.set("Cache-Control", routing.mutableCacheControl);
  if (archive) headers.set("X-Robots-Tag", "noindex, nofollow");
  const secured = new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  // Vinext señala recursos públicos con un símbolo interno, no con un header del
  // cliente. Conservarlo evita respuestas 200 vacías al envolver la respuesta.
  if (descriptor && typeof descriptor.value === 'string') Object.defineProperty(secured, signal, descriptor);
  return secured;
}

export default worker;
