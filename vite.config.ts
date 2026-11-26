import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        try {
          const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
          const pathname = parsedUrl.pathname;

          let entryPath = '';
          if (pathname === '/api/track' || pathname === '/api/track/') {
            entryPath = '/api/track.ts';
          } else if (pathname === '/api/orders' || pathname === '/api/orders/') {
            entryPath = '/api/orders.ts';
          } else if (pathname === '/api/shipments' || pathname === '/api/shipments/') {
            entryPath = '/api/shipments.ts';
          } else if (pathname === '/api/couriers' || pathname === '/api/couriers/') {
            entryPath = '/api/couriers.ts';
          } else if (pathname.startsWith('/api/webhooks/courier')) {
            entryPath = '/api/webhooks/courier.ts';
          }

          if (entryPath) {
            const handlerModule = await server.ssrLoadModule(entryPath);
            if (handlerModule && handlerModule.default) {
              let body: any = null;
              if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
                const buffers: Buffer[] = [];
                for await (const chunk of req) {
                  buffers.push(chunk);
                }
                const rawBody = Buffer.concat(buffers).toString();
                try {
                  body = rawBody ? JSON.parse(rawBody) : {};
                } catch {
                  body = rawBody;
                }
              }

              const query: Record<string, string> = {};
              parsedUrl.searchParams.forEach((val, key) => {
                query[key] = val;
              });

              const apiReq: any = req;
              apiReq.query = query;
              apiReq.body = body;
              apiReq.socket = req.socket || {};

              const apiRes: any = res;
              apiRes.status = (statusCode: number) => {
                res.statusCode = statusCode;
                return apiRes;
              };
              apiRes.json = (data: any) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return apiRes;
              };

              await handlerModule.default(apiReq, apiRes);
              return;
            }
          }

          next();
        } catch (err: any) {
          console.error('[Vite API Middleware Error]', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err?.message || 'Server error' }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiDevMiddleware()],
});
