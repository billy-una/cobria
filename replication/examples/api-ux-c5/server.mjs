import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { crearAplicacion } from '../ecosistema-app/src/composition.mjs';

const archivos = {'/':['index.html','text/html; charset=utf-8'], '/app.js':['app.js','text/javascript; charset=utf-8'], '/style.css':['style.css','text/css; charset=utf-8']};
const mensajes = {401:'Sesión de demostración ausente o vencida.',403:'No tiene permiso para realizar esta acción.',400:'Revise los campos y el formato de la solicitud.',404:'Ruta no disponible.',405:'Método no permitido.',413:'La solicitud supera 4096 bytes.',415:'Envíe contenido JSON.',500:'No fue posible completar la operación.'};
const campos = ['id','ambito','especie','cantidad','revision','observadaEn'];

// Solo loopback. Las sesiones se inyectan desde el servidor, nunca desde el cuerpo.
// No es un proveedor de identidad ni una implementación de producción.
export async function abrirTaller({sesiones = new Map(), app = crearAplicacion(), puerto = 0,
  directorioPublico = new URL('./public/', import.meta.url), rutasLectura = {}, finalidad = 'aprendizaje-c5'} = {}) {
  const sesionesLocales = new Map([...sesiones].map(([token, session]) => [token, structuredClone(session)]));
  const server = http.createServer(async (req, res) => {
    const traceId = randomUUID();
    res.setHeader('cache-control','no-store');
    res.setHeader('x-content-type-options','nosniff');
    res.setHeader('referrer-policy','no-referrer');
    res.setHeader('x-frame-options','DENY');
    res.setHeader('content-security-policy', "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    const enviar = (estado, cuerpo, tipo = 'application/json; charset=utf-8') => {
      res.writeHead(estado, {'content-type':tipo});
      res.end(typeof cuerpo === 'string' || Buffer.isBuffer(cuerpo) ? cuerpo : JSON.stringify(cuerpo));
    };
    const problema = (estado) => enviar(estado, {type:'about:blank',title:mensajes[estado],status:estado,detail:mensajes[estado],traceId}, 'application/problem+json');
    try {
      const origin = `http://127.0.0.1:${server.address().port}`;
      if (req.headers.host !== new URL(origin).host) return problema(403);
      if (req.headers.origin && req.headers.origin !== origin) return problema(403);
      const url = new URL(req.url, origin);
      if (archivos[url.pathname] && req.method === 'GET') {
        const [archivo,tipo] = archivos[url.pathname];
        return enviar(200, await readFile(new URL(archivo, directorioPublico)), tipo);
      }
      const extension = Object.hasOwn(rutasLectura, url.pathname) ? rutasLectura[url.pathname] : null;
      if (url.pathname !== '/api/observaciones' && !extension) return problema(404);
      if (extension && req.method !== 'GET') {res.setHeader('allow','GET');return problema(405);}
      if (!['GET','POST'].includes(req.method)) { res.setHeader('allow','GET, POST'); return problema(405); }
      const token = /^Bearer ([A-Za-z0-9_-]{16,128})$/.exec(req.headers.authorization ?? '')?.[1];
      const session = sesionesLocales.get(token);
      if (!session || !Number.isFinite(session.expiraEn) || session.expiraEn <= Date.now()) return problema(401);
      // La finalidad es del taller y no puede ampliarse mediante datos del cliente.
      const contexto = {...session, finalidad, traceId};
      if (extension) {
        if ([...url.searchParams.keys()].some(key => !extension.parametros.includes(key)) ||
          [...new Set(url.searchParams.keys())].some(key => url.searchParams.getAll(key).length !== 1)) return problema(400);
        const result = await extension.ejecutar(Object.fromEntries(url.searchParams), contexto);
        return enviar(result.estado, result.cuerpo, result.contentType ?? 'application/json; charset=utf-8');
      }
      let respuesta;
      if (req.method === 'GET') {
        if ([...url.searchParams.keys()].some(key => !['ambito','limite','cursor'].includes(key)) || [...new Set(url.searchParams.keys())].some(key => url.searchParams.getAll(key).length !== 1)) return problema(400);
        respuesta = await app.listarController.ejecutar({parametros:{ambito:url.searchParams.get('ambito')},consulta:Object.fromEntries(url.searchParams),contexto});
      } else {
        if (url.search) return problema(400);
        if (!/^application\/json(?:\s*;\s*charset=utf-8)?$/i.test(req.headers['content-type'] ?? '')) return problema(415);
        let bytes = 0; const chunks = [];
        for await (const chunk of req) { bytes += chunk.length; if (bytes > 4096) { problema(413); req.resume(); return; } chunks.push(chunk); }
        let cuerpo;
        try { cuerpo = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return problema(400); }
        if (!cuerpo || Array.isArray(cuerpo) || typeof cuerpo !== 'object' || Object.keys(cuerpo).some(key => !campos.includes(key)) || !campos.every(key => Object.hasOwn(cuerpo,key))) return problema(400);
        if (!['id','ambito','especie','observadaEn'].every(key => typeof cuerpo[key] === 'string' && cuerpo[key].length <= 160) || !['cantidad','revision'].every(key => Number.isSafeInteger(cuerpo[key]))) return problema(400);
        const fecha = cuerpo.observadaEn;
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(fecha) || !Number.isFinite(Date.parse(fecha))) return problema(400);
        if (new Date(fecha).toISOString() !== (fecha.includes('.') ? fecha : fecha.replace('Z','.000Z'))) return problema(400);
        const clave = req.headers['idempotency-key'];
        if (typeof clave !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(clave)) return problema(400);
        respuesta = await app.registrarController.ejecutar({cuerpo,contexto:{...contexto,claveIdempotencia:clave}});
      }
      return enviar(respuesta.estado, respuesta.cuerpo, respuesta.contentType ?? 'application/json; charset=utf-8');
    } catch { if (!res.headersSent) problema(500); else res.end(); }
  });
  server.requestTimeout = 5000;
  server.headersTimeout = 5000;
  await new Promise((resolve,reject) => { server.once('error',reject); server.listen(puerto,'127.0.0.1',resolve); });
  return {url:`http://127.0.0.1:${server.address().port}`, app, cerrar:() => new Promise((resolve,reject) => { server.close(error => error ? reject(error) : resolve()); server.closeAllConnections(); })};
}
