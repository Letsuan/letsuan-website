export default {
    async fetch(request, env) {
          const url = new URL(request.url);
          if (url.pathname === '/' || url.pathname === '/index.html') {
                  url.pathname = '/index.dc';
                  return env.ASSETS.fetch(url);
          }
          return env.ASSETS.fetch(request);
    }
};
