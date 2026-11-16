# Edwin Adolfo × Adolfo Studio — infraestructura y despliegue

Documento de operación de la web. No contiene secretos. Este archivo no se publica: solo se sirve la carpeta `public/`.

## 1. Resumen

| Elemento | Valor |
|---|---|
| Alojamiento | Cloudflare Pages (plan gratuito) |
| Proyecto de Pages | `edwinadolfo` |
| URL de Pages | https://edwinadolfo.pages.dev (no indexable: `X-Robots-Tag: noindex`) |
| Repositorio | https://github.com/AdolfoStudio/AdolfoStudio.github.io |
| Rama de producción en Pages | `redesign-2027` |
| Rama `main` | Web antigua (GitHub Pages en adolfostudio.github.io). No se ha tocado. |
| Comando de build | `node build.mjs` (sin dependencias; cualquier Node ≥ 18) |
| Directorio publicado | `public/` (fijado en `wrangler.toml` → `pages_build_output_dir`) |
| Functions | `functions/assets/films/[[path]].js` (rangos de bytes para los vídeos) |
| Variables de entorno | Ninguna |
| Dominio canónico | `https://edwinadolfo.com` (canonical, hreflang, sitemap, Open Graph y datos estructurados ya apuntan aquí) |
| Dominio secundario | `adolfo-studio.com` → redirección 301 a `https://edwinadolfo.com/studio` (sección del estudio) |

## 2. Estructura del repositorio

```
build.mjs            Generador: textos EN/ES, proyectos, plantillas. Escribe en public/.
serve.mjs            Servidor local de vista previa (con soporte de rangos).
wrangler.toml        Configuración de Pages (directorio publicado).
functions/           Pages Functions (fuera de public/, obligatorio para que Pages las detecte).
lib/film-sizes.js    Generado por build.mjs: tamaño de cada vídeo (lo usa la Function).
public/              Lo que se publica:
  index.html, es/, work/, es/work/   Páginas generadas
  assets/css, assets/js              Estilos y JS
  assets/films/<proyecto>/           film.mp4, loop.mp4, poster.jpg, s1–s4.jpg
  _headers           Cabeceras (seguridad, caché de vídeo, noindex en *.pages.dev)
  _redirects         /studio → /#studio, /es/estudio → /es/#studio
  _routes.json       Generado: solo los .mp4 pasan por la Function
  404.html, sitemap.xml, robots.txt  Generados
```

## 3. Por qué hay una Function para los vídeos

Los archivos estáticos de Cloudflare Pages ignoran la cabecera `Range` y siempre devuelven el archivo completo (200). Safari/iOS necesitan respuestas `206 Partial Content` para reproducir MP4 y cualquier navegador las necesita para saltar en la línea de tiempo. La Function sirve los `.mp4` de `/assets/films/` con rangos; las imágenes de esa carpeta quedan excluidas en `_routes.json` y se sirven como estáticos.

- Límite del plan gratuito: 100 000 peticiones/día a Functions (solo cuentan los vídeos). Si se supera, los vídeos devuelven error 429 hasta el día siguiente; las páginas e imágenes siguen funcionando. Solución si el tráfico crece: plan Workers Paid (5 USD/mes) o mover los vídeos a un servicio de vídeo.
- Límite de Pages: 25 MiB por archivo. El vídeo más grande hoy es `angeles/film.mp4` (24,1 MiB). Cualquier vídeo nuevo debe quedar por debajo.

## 4. Cómo actualizar la web

Desde Claude Code, en esta carpeta, basta con pedir el cambio (texto, proyecto, imagen). El flujo es:

1. Editar `build.mjs` (textos y proyectos) o los archivos de `public/assets/`.
2. `node build.mjs` — regenera las páginas, `sitemap.xml`, `_routes.json` y `lib/film-sizes.js`.
3. `node serve.mjs` — vista previa local en http://localhost:4173 (o el puerto que indique `PORT`).
4. `git add -A && git commit -m "…" && git push` — Cloudflare compila y publica en 1–3 minutos.

Para revisar un cambio antes de que llegue a producción: crear otra rama (`git switch -c revision-x`), subirla (`git push -u origin revision-x`) y abrir `https://revision-x.edwinadolfo.pages.dev` (preview automática, no indexable). Cuando esté aprobada, integrarla en `redesign-2027`.

Credenciales locales (fuera del proyecto): el token de GitHub está en el llavero de macOS; la sesión de Wrangler en `~/Library/Preferences/.wrangler/` (cerrar con `npx wrangler logout`). Nunca se guardan en el repositorio; `.wrangler/` está en `.gitignore`.

## 5. Cómo volver a una versión anterior

- Inmediato: Cloudflare → Workers & Pages → `edwinadolfo` → Deployments → despliegue anterior → ⋯ → **Rollback to this deployment**.
- En el código: `git revert <commit>` y `git push` (Cloudflare publica la versión revertida).
- Listar despliegues desde la terminal: `npx wrangler pages deployment list --project-name edwinadolfo`.

## 6. Dominios y DNS — plan de puesta en producción (pendiente de aprobación)

Estado actual: las zonas `edwinadolfo.com` y `adolfo-studio.com` están activas en Cloudflare y vacías (sin registros A, MX ni TXT). No hay correo configurado que proteger.

Pasos cuando se apruebe la preview:

1. **edwinadolfo.com** — Pages → `edwinadolfo` → Custom domains → *Set up a custom domain* → `edwinadolfo.com`. Cloudflare crea el registro DNS (proxied) y el certificado SSL automáticamente.
2. **www.edwinadolfo.com** — añadirlo también como custom domain y crear en la zona `edwinadolfo.com` una *Redirect Rule* (plantilla "Redirect from WWW to root"): `www.edwinadolfo.com/*` → `https://edwinadolfo.com/${1}`, 301, conservando la query.
3. **HTTPS** — SSL/TLS → Edge Certificates → *Always Use HTTPS*: activado. HSTS: activarlo solo cuando todo esté verificado (es difícil de revertir).
4. **adolfo-studio.com** — en su zona, crear registros `A @ 192.0.2.1` y `A www 192.0.2.1` con proxy activado (marcador estándar; el tráfico nunca llega a esa IP) y una *Redirect Rule*: si el host es `adolfo-studio.com` o `www.adolfo-studio.com` → 301 a `https://edwinadolfo.com/studio`. No se crea ninguna web independiente.
5. Verificar: `http://`, `https://`, `www` y `adolfo-studio.com` terminan en `https://edwinadolfo.com` sin bucles; certificado válido; `/studio` llega a la sección del estudio.
6. Opcional después del lanzamiento: sustituir la web antigua de `main` (adolfostudio.github.io) por una redirección a `https://edwinadolfo.com`, y enviar el sitemap en Google Search Console.

## 7. Riesgos y pendientes

- **Licencias de música** de los films (bloquea la versión definitiva en edwinadolfo.com).
- Créditos por confirmar: cliente de Lamego, crédito y marca de Fátima Bosch, géneros (Fashion film / Film de colección), fechas de los films.
- Cuota de Functions (ver §3) y límite de 25 MiB por archivo.
- La rama de producción es `redesign-2027`. Si en el futuro se integra en `main`, cambiar la rama de producción en Pages y retirar GitHub Pages de `main`, porque la web ya no está en la raíz del repositorio.
