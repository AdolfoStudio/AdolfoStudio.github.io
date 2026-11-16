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

## 6. Dominios y DNS — configuración en producción (activa desde el 16-11-2026)

Antes de configurar, ambas zonas estaban vacías (sin registros A, MX ni TXT): no había correo ni otros servicios que proteger. No se borró ningún registro.

**edwinadolfo.com** (zona en Cloudflare, plan Free)

| Registro / ajuste | Valor | Creado por |
|---|---|---|
| `CNAME @` | `edwinadolfo.pages.dev` (proxied) | Pages → Custom domains |
| `CNAME www` | `edwinadolfo.pages.dev` (proxied) | Pages → Custom domains |
| Redirect Rule "www.edwinadolfo.com to edwinadolfo.com" | `*://www.edwinadolfo.com/*` → `https://edwinadolfo.com/${2}`, 301, conserva la query | Rules → Redirect Rules |
| Always Use HTTPS | Activado | SSL/TLS → Edge Certificates |
| HSTS | Desactivado (activarlo solo tras unas semanas estable; difícil de revertir) | — |

**adolfo-studio.com** (zona en Cloudflare, plan Free)

| Registro / ajuste | Valor | Motivo |
|---|---|---|
| `A @` | `192.0.2.1` (proxied) | Marcador estándar para que Cloudflare atienda el dominio; el tráfico nunca llega a esa IP |
| `A www` | `192.0.2.1` (proxied) | Ídem |
| Redirect Rule "adolfo-studio.com to edwinadolfo.com/studio" | Todas las peticiones → `https://edwinadolfo.com/studio`, 301 | Sin web independiente; `/studio` → `/#studio` |

**Verificado el 16-11-2026**

- `http://edwinadolfo.com`, `http://www…` y `https://www…/ruta?query` → `https://edwinadolfo.com/ruta?query` (máx. 1 salto).
- Cualquier URL de `adolfo-studio.com` / `www.adolfo-studio.com` → `https://edwinadolfo.com/#studio` (2 saltos), sin bucles.
- Certificados válidos (renovación automática) para los cuatro nombres.
- `edwinadolfo.com` indexable (sin `X-Robots-Tag`), canonical correcto, `sitemap.xml` y `robots.txt` accesibles; `*.pages.dev` sigue con `noindex`.
- Vídeos con rangos (206) también en el dominio definitivo.

Para deshacer la puesta en producción: Pages → Custom domains → quitar `edwinadolfo.com`/`www`; en `adolfo-studio.com`, desactivar la Redirect Rule. Ningún cambio es irreversible.

Pendiente opcional: sustituir la web antigua de `main` (adolfostudio.github.io) por una redirección a `https://edwinadolfo.com`, y dar de alta el dominio y el sitemap en Google Search Console.

## 7. Riesgos y pendientes

- **Licencias de música** de los films (bloquea la versión definitiva en edwinadolfo.com).
- Créditos por confirmar: cliente de Lamego, crédito y marca de Fátima Bosch, géneros (Fashion film / Film de colección), fechas de los films.
- Cuota de Functions (ver §3) y límite de 25 MiB por archivo.
- La rama de producción es `redesign-2027`. Si en el futuro se integra en `main`, cambiar la rama de producción en Pages y retirar GitHub Pages de `main`, porque la web ya no está en la raíz del repositorio.
