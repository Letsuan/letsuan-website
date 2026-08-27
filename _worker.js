function isLongCacheAsset(pathname) {
      return pathname.startsWith('/images/') || pathname.startsWith('/assets/');
}

const UTF8_TEXT_ASSETS = new Set(['/llms.txt', '/llms-full.txt']);

function withSecurityHeaders(res, pathname) {
      const headers = new Headers(res.headers);
      headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'DENY');
      headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      if (isLongCacheAsset(pathname)) {
                headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      }
      if (UTF8_TEXT_ASSETS.has(pathname)) {
                headers.set('Content-Type', 'text/plain; charset=utf-8');
      } else if ((headers.get('Content-Type') || '').startsWith('text/html')) {
                headers.set('Content-Type', 'text/html; charset=utf-8');
      }
      return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

function legacyDcHtmlRedirect(url) {
      if (!url.pathname.endsWith('.dc.html')) return null;
      const stripped = url.pathname.slice(0, -'.dc.html'.length);
      const target = stripped === '/index' || stripped === '' ? '/' : stripped;
      const dest = new URL(target, url);
      dest.search = url.search;
      return dest.toString();
}

export default {
      async fetch(request, env) {
              const url = new URL(request.url);
              const redirect = legacyDcHtmlRedirect(url);
              if (redirect) {
                      return Response.redirect(redirect, 301);
              }
              return withSecurityHeaders(await env.ASSETS.fetch(request), url.pathname);
      }
};
