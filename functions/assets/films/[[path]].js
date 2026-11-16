// Cloudflare Pages Function — byte-range support for the films.
// Pages static assets ignore `Range` headers (they always answer 200 with the whole file).
// Safari/iOS need 206 Partial Content to play and seek MP4, so .mp4 requests under
// /assets/films/ are answered here; every other file falls through to the static asset.
import SIZES from '../../../lib/film-sizes.js';

const CACHE = 'public, max-age=86400, stale-while-revalidate=604800';

function parseRange(header, size) {
  const m = /^bytes=(\d*)-(\d*)$/.exec((header || '').trim());
  if (!m || (m[1] === '' && m[2] === '')) return null; // absent or multi-range: send whole file
  let start, end;
  if (m[1] === '') { start = Math.max(size - Number(m[2]), 0); end = size - 1; } // suffix: bytes=-N
  else { start = Number(m[1]); end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1); }
  if (start >= size || start > end) return 'unsatisfiable';
  return { start, end };
}

function slice(body, start, end) {
  let pos = 0;
  return body.pipeThrough(new TransformStream({
    transform(chunk, controller) {
      const from = pos, to = pos + chunk.byteLength;
      pos = to;
      if (to <= start) return;
      if (from > end) { controller.terminate(); return; }
      controller.enqueue(chunk.subarray(Math.max(start - from, 0), Math.min(end + 1 - from, chunk.byteLength)));
      if (to > end) controller.terminate();
    },
  }));
}

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url);
  if (!url.pathname.endsWith('.mp4') || (request.method !== 'GET' && request.method !== 'HEAD')) return next();

  const asset = await env.ASSETS.fetch(new Request(url.toString())); // whole file, no Range
  const size = Number(asset.headers.get('content-length')) || SIZES[url.pathname] || 0;
  if (!asset.ok || !asset.body || !size) return asset;

  const headers = new Headers(asset.headers);
  headers.set('accept-ranges', 'bytes');
  headers.set('cache-control', CACHE);
  headers.set('content-type', 'video/mp4');

  const range = parseRange(request.headers.get('range'), size);
  if (range === 'unsatisfiable') {
    asset.body.cancel();
    return new Response(null, { status: 416, headers: { 'content-range': `bytes */${size}` } });
  }
  if (!range) {
    headers.set('content-length', String(size));
    if (request.method === 'HEAD') { asset.body.cancel(); return new Response(null, { status: 200, headers }); }
    return new Response(asset.body, { status: 200, headers });
  }
  headers.set('content-range', `bytes ${range.start}-${range.end}/${size}`);
  headers.set('content-length', String(range.end - range.start + 1));
  if (request.method === 'HEAD') { asset.body.cancel(); return new Response(null, { status: 206, headers }); }
  let body = slice(asset.body, range.start, range.end);
  if (typeof FixedLengthStream === 'function') { // Workers runtime: guarantees an exact Content-Length
    const fixed = new FixedLengthStream(range.end - range.start + 1);
    body.pipeTo(fixed.writable).catch(() => {});
    body = fixed.readable;
  }
  return new Response(body, { status: 206, headers });
}
