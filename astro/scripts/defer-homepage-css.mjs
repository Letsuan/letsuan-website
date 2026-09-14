// Eliminates render-blocking CSS on the homepage without touching Astro's
// build pipeline (which has no per-page "defer this stylesheet" hook):
// after a normal `npm run build`, this script post-processes just the two
// homepage output files (index.html, zh-TW.html) to
//   1. inline the full content of their page-specific stylesheets directly
//      into a <style> block in <head>, so first paint never waits on a
//      separate CSS request, and
//   2. convert the original <link rel="stylesheet"> tags to the same
//      non-blocking media=print/onload pattern already used for the
//      Google Fonts link in Layout.astro, with a <noscript> fallback,
//      so the browser still fetches (and caches) the real files for
//      the next page navigation.
//
// Deliberately does the whole file rather than a hand-picked "critical"
// subset: curating a subset risks missing a rule and causing a flash of
// incorrectly-laid-out content, and the homepage-specific CSS here is
// small enough (~29KB uncompressed, single-digit KB gzipped) that
// inlining all of it is a safe, zero-curation-risk tradeoff.
//
// Scope: homepage only (index.html / zh-TW.html). Re-run after every
// `npm run build` that touches the homepage, Hero.astro, or Nav.astro.
//
// Usage: node scripts/defer-homepage-css.mjs

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const distDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../dist');
const targets = ['index.html', 'zh-TW.html'];

async function processFile(file) {
  const filePath = path.join(distDir, file);
  const html = await readFile(filePath, 'utf-8');

  if (html.includes('data-critical-inlined')) {
    console.log(`skip (already processed): ${file}`);
    return;
  }

  const linkRe = /<link rel="stylesheet" href="([^"]+)">/g;
  const hrefs = [...html.matchAll(linkRe)].map((m) => m[1]);
  if (hrefs.length === 0) {
    console.log(`skip (no stylesheets found): ${file}`);
    return;
  }

  let inlinedCss = '';
  for (const href of hrefs) {
    const cssPath = path.join(distDir, href.replace(/^\//, ''));
    inlinedCss += await readFile(cssPath, 'utf-8');
  }

  let noscriptLinks = '';
  const deferred = html.replace(linkRe, (match, href) => {
    noscriptLinks += `<link rel="stylesheet" href="${href}">`;
    return `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all'">`;
  });

  const lastLinkEnd = deferred.lastIndexOf('">') + 2;
  const withNoscript =
    deferred.slice(0, lastLinkEnd) +
    `<noscript>${noscriptLinks}</noscript>` +
    `<style data-critical-inlined="true">${inlinedCss}</style>` +
    deferred.slice(lastLinkEnd);

  await writeFile(filePath, withNoscript, 'utf-8');
  console.log(`patched: ${file} (inlined ${inlinedCss.length} bytes of CSS from ${hrefs.length} file(s))`);
}

for (const file of targets) {
  await processFile(file);
}
