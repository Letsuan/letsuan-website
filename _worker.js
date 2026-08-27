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

// Component partials fetched internally by <dc-import> — must keep serving at
// their real .dc.html path, never redirected to a clean URL.
const COMPONENT_PARTIALS = new Set(['/Nav.dc.html', '/Footer.dc.html']);

export default {
      async fetch(request, env) {
              const url = new URL(request.url);
              let pathname = url.pathname;

              // Normalize trailing slash (except root).
              if (pathname.length > 1 && pathname.endsWith('/')) {
                        pathname = pathname.slice(0, -1);
                        return Response.redirect(new URL(pathname + url.search, url).toString(), 301);
              }

              // Legacy /page.dc or /page.dc.html -> clean /page (301), excluding component partials.
              if (!COMPONENT_PARTIALS.has(pathname)) {
                        const legacyMatch = pathname.match(/^(\/.*?)\.dc(?:\.html)?$/i);
                        if (legacyMatch) {
                                    const clean = legacyMatch[1] === '' || legacyMatch[1] === '/index' ? '/' : legacyMatch[1];
                                    return Response.redirect(new URL(clean + url.search, url).toString(), 301);
                        }
              }

              // Last path segment with a dot -> a real static asset (image, css, js, xml, txt...), serve as-is.
              const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1);
              const isAsset = lastSegment.includes('.');

              if (!isAsset) {
                        // Clean page route: /about -> about.dc.html, / -> index.dc.html.
                        const filePath = pathname === '/' ? '/index.dc.html' : pathname + '.dc.html';
                        let res = await env.ASSETS.fetch(new URL(filePath, url));
                        if (res.status >= 300 && res.status < 400) {
                                    const loc = res.headers.get('Location');
                                    if (loc) {
                                                  res = await env.ASSETS.fetch(new URL(loc, url));
                                    }
                        }
                        return withSecurityHeaders(res, pathname);
              }

              return withSecurityHeaders(await env.ASSETS.fetch(request), pathname);
      }
};
