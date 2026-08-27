function isLongCacheAsset(pathname) {
      return pathname.startsWith('/images/') || pathname.startsWith('/assets/');
}

function withSecurityHeaders(res, pathname) {
      const headers = new Headers(res.headers);
      headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'DENY');
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      if (isLongCacheAsset(pathname)) {
                headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      }
      return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

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
                        return withSecurityHeaders(res, url.pathname);
              }
              return withSecurityHeaders(await env.ASSETS.fetch(request), url.pathname);
      }
};
