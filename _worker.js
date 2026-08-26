export default {
      async fetch(request, env) {
              const url = new URL(request.url);
              if (url.pathname === '/' || url.pathname === '/index.html') {
                        let res = await env.ASSETS.fetch(new URL('/index.dc', url));
                        if (res.status >= 300 && res.status < 400) {
                                    const loc = res.headers.get('Location');
                                    if (loc) {
                                                  res = await env.ASSETS.fetch(new URL(loc, url));
                                    }
                        }
                        return res;
              }
              return env.ASSETS.fetch(request);
      }
};
