export default {
    async fetch(request, env) {
          const url = new URL(request.url);
          if (url.pathname === '/' || url.pathname === '/index.html') {
                  url.pathname = '/index.dc.html';
                  return env.ASSETS.fetch(new Request(url, request));
          }
          return env.ASSETS.fetch(request);
    }
};
