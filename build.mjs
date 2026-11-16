// Edwin Adolfo × Adolfo Studio — static site generator.
// No dependencies. Run:  node build.mjs
// Edit the content below, run the build, commit the generated HTML (written to ./public).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, 'public'); // published directory (Cloudflare Pages: pages_build_output_dir)
const SITE = 'https://edwinadolfo.com';
const EMAIL = 'adolfoestudio@gmail.com';
const WHATSAPP = 'https://wa.me/34617969909';
const INSTAGRAM = 'https://www.instagram.com/adolfostudio/';
const FORM = 'https://formspree.io/f/moeqnpoo';

/* ───────────── Projects ─────────────
   kind:   'film'   → signed work, shown in Selected Work
           'studio' → Adolfo Studio productions, shown in The Studio
   orient: 'h' (16:9) | 'v' (9:16)
   Only state what is verified. Leave year empty when unknown. */
const projects = [
  {
    id: 'ro', slug: 'the-world-outside', kind: 'film', independent: true, orient: 'h', dur: '1:00', year: '2026',
    title: 'The World Outside',
    client: { en: 'Outside the Rick Owens show', es: 'A las puertas del desfile de Rick Owens' },
    cat: { en: 'Independent editorial film', es: 'Film editorial independiente' },
    place: { en: 'Paris', es: 'París' },
    desc: {
      en: 'The real show was outside. In the streets around Rick Owens in Paris, the city turns people into sculpture. Stone stays in black and white; colour arrives only with the body.',
      es: 'El desfile de verdad estaba fuera. En las calles que rodean a Rick Owens en París, la ciudad convierte a las personas en escultura. La piedra se queda en blanco y negro; el color solo llega con el cuerpo.',
    },
    note: {
      en: 'An independent film by Edwin Adolfo. Not commissioned by, or affiliated with, Rick Owens.',
      es: 'Film independiente de Edwin Adolfo. No es un encargo de Rick Owens ni guarda relación con la marca.',
    },
  },
  {
    id: 'vanson', slug: 'broken-symmetry', kind: 'film', orient: 'h', dur: '1:37', year: 'SS27',
    title: 'Broken Symmetry',
    client: { en: 'Vanson Leathers × Blackpicasso', es: 'Vanson Leathers × Blackpicasso' },
    cat: { en: 'Fashion film', es: 'Fashion film' },
    place: { en: 'Paris', es: 'París' },
    desc: {
      en: 'Arriving in Paris without asking permission. The city offers perfect symmetry; the jackets break it. The collection takes the room look by look, and the designer appears only at the end — in colour, while the audience turns black and white.',
      es: 'Llegar a París sin pedir permiso. La ciudad ofrece simetría perfecta; las chaquetas la rompen. La colección se impone look a look y el diseñador aparece solo al final: en color, mientras el público pasa a blanco y negro.',
    },
  },
  {
    id: 'bureau', slug: 'the-bureau-fashion-week', kind: 'film', orient: 'h', dur: '1:31', year: '',
    title: 'The Bureau Fashion Week',
    client: { en: 'The Bureau Fashion Week', es: 'The Bureau Fashion Week' },
    cat: { en: 'Fashion week film', es: 'Film de fashion week' },
    place: { en: 'Paris', es: 'París' },
    desc: {
      en: 'A fashion week held in a single film. Instead of covering each show, the edit stops on a face, a gesture, a reaction — until the whole week reads as one runway.',
      es: 'Una fashion week contenida en un solo film. En lugar de cubrir cada desfile, el montaje se detiene en un rostro, un gesto, una reacción, hasta que toda la semana se lee como una sola pasarela.',
    },
  },
  {
    id: 'krissy', slug: 'krissy-king', kind: 'film', orient: 'v', dur: '0:40', year: '',
    title: 'Krissy King',
    client: { en: 'Krissy King', es: 'Krissy King' },
    cat: { en: 'Collection film', es: 'Film de colección' },
    place: { en: 'Paris', es: 'París' },
    desc: {
      en: 'Black, white and a single motif. The polka dot sets the rhythm of the edit, from the faces to the full line of the runway.',
      es: 'Negro, blanco y un solo motivo. El lunar marca el ritmo del montaje, de los rostros a la línea completa de la pasarela.',
    },
  },
  {
    id: 'spring', slug: 'spring-colors', kind: 'film', orient: 'v', dur: '0:23', year: '',
    title: 'Spring Colors',
    client: { en: 'Spring Colors Madrid', es: 'Spring Colors Madrid' },
    cat: { en: 'Fashion film', es: 'Fashion film' },
    place: { en: 'Madrid', es: 'Madrid' },
    desc: {
      en: 'Fur, sequins and gold thread, between the streets of Madrid and a gilded interior. A short piece in which the detail carries the whole story.',
      es: 'Piel, lentejuelas e hilo de oro, entre las calles de Madrid y un interior dorado. Una pieza breve en la que el detalle sostiene toda la historia.',
    },
  },
  {
    id: 'huxley', slug: 'the-house-of-grace-huxley', kind: 'film', orient: 'v', dur: '0:50', year: '',
    title: 'The House of Grace Huxley',
    client: { en: 'The House of Grace Huxley', es: 'The House of Grace Huxley' },
    cat: { en: 'Collection film', es: 'Film de colección' },
    place: { en: 'Paris', es: 'París' },
    desc: {
      en: 'It opens on the Trocadéro metro sign and closes on the house’s final bow. In between, patchwork denim and military green, filmed close enough to read the seams.',
      es: 'Empieza en el cartel del metro de Trocadéro y termina en el saludo final de la casa. Entre medias, denim de patchwork y verde militar, filmados tan cerca que se leen las costuras.',
    },
  },
  {
    id: 'misspt', slug: 'miss-best-portugal', kind: 'studio', orient: 'h', dur: '1:43', year: '',
    title: 'Miss Best Portugal',
    client: { en: 'Miss Best Portugal', es: 'Miss Best Portugal' },
    cat: { en: 'Event film', es: 'Film de evento' },
    place: { en: 'Portugal', es: 'Portugal' },
    desc: {
      en: 'A national final seen from the wings: rehearsal in an empty theatre, the stage, and the seconds after the crown, when no one is performing any more.',
      es: 'Una final nacional vista desde dentro: el ensayo con el teatro vacío, el escenario y los segundos después de la corona, cuando ya nadie actúa.',
    },
  },
  {
    id: 'fatima', slug: 'fatima-bosch-in-madrid', kind: 'studio', orient: 'h', dur: '1:37', year: '',
    title: 'Fátima Bosch in Madrid',
    titleEs: 'Fátima Bosch en Madrid',
    client: { en: 'Miss Universe Spain', es: 'Miss Universe Spain' },
    cat: { en: 'Event film', es: 'Film de evento' },
    place: { en: 'Madrid', es: 'Madrid' },
    desc: {
      en: 'Miss Universe Fátima Bosch on her visit to Madrid. A day of stages, cameras and greetings, filmed for what happens in between.',
      es: 'La Miss Universo Fátima Bosch en su visita a Madrid. Un día de escenarios, cámaras y saludos, filmado por lo que ocurre entre medias.',
    },
  },
  {
    id: 'eco', slug: 'fashion-eco-angels', kind: 'studio', orient: 'h', dur: '1:16', year: '',
    title: 'Fashion Eco Angels',
    client: { en: 'Fashion Eco Angels', es: 'Fashion Eco Angels' },
    cat: { en: 'Fashion film', es: 'Fashion film' },
    place: { en: 'Paris', es: 'París' },
    desc: {
      en: 'Wings, flowers and the Eiffel Tower. A fashion film told as a quiet manifesto about what is worth preserving.',
      es: 'Alas, flores y la Torre Eiffel. Un fashion film contado como un manifiesto en voz baja sobre lo que merece preservarse.',
    },
  },
  {
    id: 'inmo', slug: 'lamego-real-estate', kind: 'studio', orient: 'h', dur: '1:19', year: '',
    title: 'Lamego',
    client: { en: '', es: '' },
    cat: { en: 'Real estate film', es: 'Film inmobiliario' },
    place: { en: 'Portugal', es: 'Portugal' },
    desc: {
      en: 'A property presented the way it would be lived in: the weight of a door, the turn of a staircase, light settling on a room.',
      es: 'Un inmueble presentado como se viviría: el peso de una puerta, el giro de una escalera, la luz posándose en una habitación.',
    },
  },
  {
    id: 'angeles', slug: 'miss-teen-spain', kind: 'studio', orient: 'h', dur: '1:35', year: '',
    title: 'Miss Teen Spain',
    client: { en: 'Miss Teen Spain', es: 'Miss Teen Spain' },
    cat: { en: 'Event film', es: 'Film de evento' },
    place: { en: '', es: '' },
    desc: {
      en: 'A Miss Teen Spain night, from the make-up chair to the final confetti. Nerves backstage, light on stage, celebration at the end.',
      es: 'Una noche de Miss Teen Spain, de la silla de maquillaje al confeti final. Nervios entre bastidores, luz sobre el escenario, celebración al terminar.',
    },
  },
];

/* ───────────── Copy ───────────── */
const t = {
  en: {
    lang: 'en', home: '/', other: '/es/', otherLabel: 'ES', otherName: 'Español',
    title: 'Edwin Adolfo — Creative Director & Fashion Filmmaker',
    description: 'Creative director and fashion filmmaker based in Madrid, working worldwide. Fashion films, brand films and creative direction, produced by Adolfo Studio.',
    ogLocale: 'en_GB', ogAlt: 'es_ES', jobTitle: 'Creative Director & Filmmaker', byWord: 'by', frameOf: (n, t) => `Frame ${n} from ${t}, directed by Edwin Adolfo`,
    skip: 'Skip to content', menu: 'Menu', close: 'Close',
    nav: { work: 'Work', perspective: 'Perspective', studio: 'Studio', about: 'Edwin', contact: 'Contact' },
    by: 'A film by', prod: 'Produced by',
    heroRole: 'Creative director · Filmmaker', heroLoc: 'Madrid — Worldwide',
    heroNow: 'Now playing', heroWatch: 'Watch the film',
    workLabel: 'Selected', workIntro: 'Signed work.',
    perspLabel: 'Perspective',
    perspHead: 'A signature is recognised by its decisions.',
    perspList: [
      ['Intention', 'Which story is worth telling, decided before a single frame is shot.'],
      ['Identity', 'Which details of a brand deserve the frame, and which are left out.'],
      ['Perspective', 'Where the camera stands, and why. A point of view, not a formula.'],
      ['Emotion', 'What remains once the film has ended.'],
      ['Precision', 'When an image is allowed to breathe, and when it is cut.'],
    ],
    perspClose: 'None of these decisions is visible on its own. Together, they are the signature.',
    capLabel: 'Disciplines',
    capA: 'Creative signature', capAName: 'Edwin Adolfo',
    capAList: ['Creative concept', 'Creative direction', 'Film direction', 'Fashion & editorial films', 'Brand films & campaigns'],
    capB: 'Production structure', capBName: 'Adolfo Studio',
    capBList: ['Creative production', 'Crews assembled per project', 'Editing, colour & sound', 'Photography', 'Motion & VFX', 'Live events & broadcast'],
    capNote: 'Configured for each project, with collaborators chosen for what the idea requires.',
    studioLabel: 'Adolfo Studio',
    studioHead: 'Sized to the idea.',
    studioBody: [
      'Adolfo Studio is where the signature becomes a production. For every project it brings together the people the idea calls for — crew, photography, editing, colour, motion — and no one it doesn’t, from an intimate editorial to a national final on stage.',
      'The team changes with each project. The direction doesn’t.',
    ],
    studioListLabel: 'Studio productions',
    aboutLabel: 'Edwin Adolfo',
    aboutHead: 'A way of looking.',
    aboutBody: [
      'Edwin Adolfo is a creative director and filmmaker for fashion and brands, based in Madrid and working internationally.',
      'His work across Spain, Portugal and France has given him a close reading of different creative cultures, markets and ways of working. Each project starts from its own identity and context; where it happens is never the limit of the idea.',
      'Cameras and software can be hired. What a brand commissions from him is judgement: how to look at the brand, and how to understand the business behind it.',
    ],
    aboutFacts: [['Based in', 'Madrid'], ['Working', 'Worldwide'], ['Experience', 'Spain · Portugal · France'], ['Production', 'Adolfo Studio']],
    contactLabel: 'Contact',
    contactHead: 'What does your brand need to say?',
    contactSub: 'For fashion designers, brands, creative directors and agencies — wherever the project takes place.',
    f: { name: 'Name', email: 'Email', company: 'Brand', type: 'Project type', typeAny: 'Select', types: ['Creative direction', 'Fashion / editorial film', 'Brand film / campaign', 'Creative production', 'Collaboration / other'], message: 'Project, dates, location, references', send: 'Send', sending: 'Sending…', error: 'Not sent. Please try again.', ok: 'Received. You’ll hear back soon.' },
    direct: 'Or write directly',
    back: 'All work', next: 'Next', credits: 'Credits', stills: 'Frames', still: 'frame',
    cFilm: 'A film by', cDir: 'Direction', cProd: 'Production', cClient: 'Brand', cContext: 'Context', cType: 'Genre', cPlace: 'Location', cYear: 'Year', cFormat: 'Format',
  },
  es: {
    lang: 'es', home: '/es/', other: '/', otherLabel: 'EN', otherName: 'English',
    title: 'Edwin Adolfo — Director creativo y cineasta de moda',
    description: 'Director creativo y cineasta de moda con base en Madrid y proyección internacional. Fashion films, films de marca y dirección creativa, producidos por Adolfo Studio.',
    ogLocale: 'es_ES', ogAlt: 'en_GB', jobTitle: 'Director creativo y cineasta', byWord: 'de', frameOf: (n, t) => `Fotograma ${n} de ${t}, dirigido por Edwin Adolfo`,
    skip: 'Saltar al contenido', menu: 'Menú', close: 'Cerrar',
    nav: { work: 'Obra', perspective: 'Mirada', studio: 'Estudio', about: 'Edwin', contact: 'Contacto' },
    by: 'Un film de', prod: 'Producido por',
    heroRole: 'Director creativo · Cineasta', heroLoc: 'Madrid — Internacional',
    heroNow: 'En pantalla', heroWatch: 'Ver el film',
    workLabel: 'Selección', workIntro: 'Obra firmada.',
    perspLabel: 'Mirada',
    perspHead: 'Una firma se reconoce en las decisiones.',
    perspList: [
      ['Intención', 'Qué historia merece contarse, antes de rodar un solo plano.'],
      ['Identidad', 'Qué detalles de una marca merecen el encuadre y cuáles se quedan fuera.'],
      ['Punto de vista', 'Dónde se coloca la cámara, y por qué. Una mirada propia, no una fórmula.'],
      ['Emoción', 'Lo que permanece cuando el film termina.'],
      ['Precisión', 'Cuándo se deja respirar una imagen y cuándo se corta.'],
    ],
    perspClose: 'Ninguna de estas decisiones se ve por separado. Juntas, son la firma.',
    capLabel: 'Disciplinas',
    capA: 'Firma creativa', capAName: 'Edwin Adolfo',
    capAList: ['Concepto creativo', 'Dirección creativa', 'Dirección de cine', 'Fashion films y piezas editoriales', 'Films de marca y campañas'],
    capB: 'Estructura de producción', capBName: 'Adolfo Studio',
    capBList: ['Producción creativa', 'Equipos a medida de cada proyecto', 'Montaje, color y sonido', 'Fotografía', 'Motion y VFX', 'Eventos en directo y broadcast'],
    capNote: 'Se configura para cada proyecto, con colaboradores elegidos según lo que la idea necesita.',
    studioLabel: 'Adolfo Studio',
    studioHead: 'A la medida de la idea.',
    studioBody: [
      'Adolfo Studio es donde la firma se convierte en producción. Para cada proyecto reúne a las personas que la idea pide —rodaje, fotografía, montaje, color, motion— y a nadie más, de un editorial íntimo a una final nacional sobre el escenario.',
      'El equipo cambia con cada proyecto. La dirección, no.',
    ],
    studioListLabel: 'Producciones del estudio',
    aboutLabel: 'Edwin Adolfo',
    aboutHead: 'Una manera de mirar.',
    aboutBody: [
      'Edwin Adolfo es director creativo y cineasta para la moda y las marcas, con base en Madrid y proyección internacional.',
      'Su trabajo en España, Portugal y Francia le ha dado una lectura cercana de distintas culturas creativas, mercados y formas de trabajar. Cada proyecto parte de su propia identidad y contexto; el lugar nunca es el límite de la idea.',
      'Las cámaras y el software se alquilan. Lo que una marca le encarga es criterio: cómo mirarla y cómo entender el negocio que hay detrás.',
    ],
    aboutFacts: [['Base', 'Madrid'], ['Ámbito', 'Internacional'], ['Experiencia', 'España · Portugal · Francia'], ['Producción', 'Adolfo Studio']],
    contactLabel: 'Contacto',
    contactHead: '¿Qué necesita decir tu marca?',
    contactSub: 'Para diseñadores, marcas de moda, directores creativos y agencias, esté donde esté el proyecto.',
    f: { name: 'Nombre', email: 'Email', company: 'Marca', type: 'Tipo de proyecto', typeAny: 'Selecciona', types: ['Dirección creativa', 'Fashion film / film editorial', 'Film de marca / campaña', 'Producción creativa', 'Colaboración / otro'], message: 'Proyecto, fechas, lugar, referencias', send: 'Enviar', sending: 'Enviando…', error: 'No se ha enviado. Inténtalo de nuevo.', ok: 'Recibido. Pronto tendrás respuesta.' },
    direct: 'O escribe directamente',
    back: 'Toda la obra', next: 'Siguiente', credits: 'Créditos', stills: 'Fotogramas', still: 'fotograma',
    cFilm: 'Un film de', cDir: 'Dirección', cProd: 'Producción', cClient: 'Marca', cContext: 'Contexto', cType: 'Género', cPlace: 'Localización', cYear: 'Año', cFormat: 'Formato',
  },
};

/* ───────────── Helpers ───────────── */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');
const A = (id) => `/assets/films/${id}`;
const titleOf = (p, L) => (L.lang === 'es' && p.titleEs) || p.title;
const urlOf = (p, L) => `${L.home}work/${p.slug}/`;
const metaLine = (p, L) => [p.client[L.lang] !== titleOf(p, L) ? p.client[L.lang] : '', p.cat[L.lang], p.place[L.lang], p.year].filter(Boolean).join(' · ');
const films = projects.filter((p) => p.kind === 'film');
const studio = projects.filter((p) => p.kind === 'studio');
const dims = (p) => (p.orient === 'h' ? 'width="1280" height="720"' : 'width="720" height="1280"');

const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23111'/%3E%3Ctext x='16' y='21' font-family='Arial,sans-serif' font-weight='700' font-size='13' text-anchor='middle' fill='%23E9E5DD'%3EEA%3C/text%3E%3C/svg%3E";

function head(L, { title, description, path, altPath, image, ld }) {
  const enPath = L.lang === 'en' ? path : altPath;
  const esPath = L.lang === 'es' ? path : altPath;
  return `<!doctype html>
<html lang="${L.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE}${path}">
<link rel="alternate" hreflang="en" href="${SITE}${enPath}">
<link rel="alternate" hreflang="es" href="${SITE}${esPath}">
<link rel="alternate" hreflang="x-default" href="${SITE}${enPath}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Edwin Adolfo × Adolfo Studio">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE}${path}">
<meta property="og:image" content="${SITE}${image}">
<meta property="og:locale" content="${L.ogLocale}">
<meta property="og:locale:alternate" content="${L.ogAlt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#111111">
<link rel="icon" href="${FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/site.css">
<script>document.documentElement.classList.add('js')</script>
${ld ? `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>` : ''}
</head>`;
}

function header(L, altPath, onHome) {
  const h = onHome ? '' : L.home;
  const links = [['work', '#work'], ['perspective', '#perspective'], ['studio', '#studio'], ['about', '#edwin'], ['contact', '#contact']]
    .map(([k, a]) => `<li><a href="${h}${a}">${L.nav[k]}</a></li>`).join('');
  return `<a class="skip" href="#main">${L.skip}</a>
<header class="top">
  <a class="brand" href="${L.home}" aria-label="Edwin Adolfo × Adolfo Studio">
    <span class="brand-sig">Edwin Adolfo</span>
    <span class="brand-std">× Adolfo Studio</span>
  </a>
  <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav" data-open="${L.menu}" data-close="${L.close}">${L.menu}</button>
  <nav id="nav" class="nav" aria-label="${L.menu}">
    <ul>${links}<li><a class="lang" href="${altPath}" hreflang="${L.lang === 'en' ? 'es' : 'en'}" lang="${L.lang === 'en' ? 'es' : 'en'}" aria-label="${L.otherName}">${L.otherLabel}</a></li></ul>
  </nav>
</header>`;
}

function footer(L) {
  return `<footer class="foot">
  <p class="foot-credits"><span>${L.by}</span> Edwin Adolfo <i>/</i> <span>${L.prod}</span> Adolfo Studio</p>
  <p class="foot-links"><a href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram</a><a href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:${EMAIL}">Email</a></p>
  <p class="foot-legal">© ${new Date().getFullYear()} Edwin Adolfo × Adolfo Studio · ${L.heroLoc}</p>
</footer>
<script src="/assets/js/site.js" defer></script>
</body>
</html>`;
}

function card(p, i, L, cls = '') {
  return `<a class="card card-${p.orient} ${cls}" href="${urlOf(p, L)}">
      <div class="card-media">
        <img src="${A(p.id)}/poster.jpg" ${dims(p)} alt="" loading="lazy" decoding="async">
        <video muted loop playsinline preload="none" data-loop data-src="${A(p.id)}/loop.mp4" aria-hidden="true" tabindex="-1"></video>
        <span class="card-dur">${p.dur}</span>
      </div>
      <div class="card-text">
        <span class="idx">${pad(i + 1)}</span>
        <h3>${esc(titleOf(p, L))}</h3>
        <p class="meta">${esc(metaLine(p, L))}</p>
      </div>
    </a>`;
}

/* ───────────── Structured data ───────────── */
const iso = (d) => { const [m, sec] = d.split(':').map(Number); return `PT${m ? m + 'M' : ''}${sec}S`; };
function homeLd(L) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person', '@id': `${SITE}/#edwin`, name: 'Edwin Adolfo', jobTitle: L.jobTitle,
        description: L.description, url: `${SITE}${L.home}`,
        homeLocation: { '@type': 'Place', name: 'Madrid' },
        knowsAbout: ['Creative direction', 'Film direction', 'Fashion film', 'Brand film', 'Visual storytelling'],
        affiliation: { '@id': `${SITE}/#studio` },
      },
      {
        '@type': 'Organization', '@id': `${SITE}/#studio`, name: 'Adolfo Studio', url: `${SITE}/`, email: EMAIL,
        address: { '@type': 'PostalAddress', addressLocality: 'Madrid', addressCountry: 'ES' },
        areaServed: 'Worldwide', sameAs: [INSTAGRAM],
      },
      { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Edwin Adolfo × Adolfo Studio', inLanguage: L.lang },
    ],
  };
}
function videoLd(p, L) {
  const ld = {
    '@context': 'https://schema.org', '@type': 'VideoObject',
    name: titleOf(p, L), description: p.desc[L.lang], genre: p.cat[L.lang],
    thumbnailUrl: [`${SITE}${A(p.id)}/poster.jpg`], contentUrl: `${SITE}${A(p.id)}/film.mp4`, duration: iso(p.dur),
    director: { '@type': 'Person', '@id': `${SITE}/#edwin`, name: 'Edwin Adolfo' },
    productionCompany: { '@type': 'Organization', '@id': `${SITE}/#studio`, name: 'Adolfo Studio' },
  };
  if (p.place[L.lang]) ld.contentLocation = { '@type': 'Place', name: p.place[L.lang] };
  if (/^\d{4}$/.test(p.year)) ld.dateCreated = p.year;
  return ld;
}

/* ───────────── Home ───────────── */
function home(L) {
  const feat = films[0];
  const altPath = L.other;
  return `${head(L, { title: L.title, description: L.description, path: L.home, altPath, image: `${A('ro')}/poster.jpg`, ld: homeLd(L) })}
<body class="home">
${header(L, altPath, true)}
<main id="main">

<section class="hero" aria-label="Edwin Adolfo">
  <video class="hero-video" muted loop playsinline preload="metadata" poster="${A('ro')}/poster.jpg" data-hero data-src="${A('ro')}/hero.mp4" data-src-hd="${A('ro')}/hero-hd.mp4" aria-hidden="true" tabindex="-1"></video>
  <div class="hero-shade"></div>
  <div class="hero-top">
    <p class="mono">${L.heroRole}</p>
    <p class="mono hero-meta"><span>${L.heroLoc}</span><span class="hero-tc" aria-hidden="true" data-tc>00:00:00:00</span></p>
  </div>
  <div class="hero-bottom">
    <div class="hero-row">
      <p class="hero-credit"><span class="mono">${L.by}</span></p>
      <a class="hero-now" href="${urlOf(feat, L)}">
        <span class="mono">${L.heroNow}</span>
        <span class="hero-now-title">${esc(feat.title)}</span>
        <span class="mono">${esc(feat.place[L.lang])}, ${feat.year} · ${L.heroWatch} ↗</span>
      </a>
    </div>
    <h1 class="wordmark"><span>Edwin</span> <span>Adolfo</span></h1>
    <p class="hero-std"><span class="mono">${L.prod}</span> <strong>Adolfo Studio</strong></p>
  </div>
</section>

<section id="work" class="work">
  <header class="sec-head">
    <p class="mono label">01 — ${L.workLabel}</p>
    <h2 class="sec-title">${L.workIntro}</h2>
  </header>
  <div class="work-grid">
    ${card(films[0], 0, L, 'c-full')}
    ${card(films[1], 1, L, 'c-wide')}
    ${card(films[2], 2, L, 'c-side')}
    ${card(films[3], 3, L, 'c-v1')}
    ${card(films[4], 4, L, 'c-v2')}
    ${card(films[5], 5, L, 'c-v3')}
  </div>
</section>

<section id="perspective" class="persp">
  <p class="mono label">02 — ${L.perspLabel}</p>
  <h2 class="serif persp-head">${L.perspHead}</h2>
  <ol class="persp-list">
    ${L.perspList.map(([k, s], i) => `<li><span class="mono">${pad(i + 1)}</span><span><b>${k}</b> ${s}</span></li>`).join('\n    ')}
  </ol>
  <p class="serif persp-close">${L.perspClose}</p>
</section>

<section class="caps" aria-label="${L.capLabel}">
  <p class="mono label">03 — ${L.capLabel}</p>
  <div class="caps-grid">
    <div class="caps-col">
      <p class="mono">${L.capA}</p>
      <h2 class="caps-name">${L.capAName}</h2>
      <ul>${L.capAList.map((s) => `<li>${s}</li>`).join('')}</ul>
    </div>
    <div class="caps-x" aria-hidden="true">×</div>
    <div class="caps-col">
      <p class="mono">${L.capB}</p>
      <h2 class="caps-name caps-name-std">${L.capBName}</h2>
      <ul>${L.capBList.map((s) => `<li>${s}</li>`).join('')}</ul>
      <p class="mono caps-note">${L.capNote}</p>
    </div>
  </div>
</section>

<section id="studio" class="studio">
  <div class="studio-intro">
    <p class="mono label">04 — ${L.studioLabel}</p>
    <h2 class="sec-title">${L.studioHead}</h2>
    ${L.studioBody.map((s) => `<p class="body">${s}</p>`).join('\n    ')}
  </div>
  <div class="studio-list">
    <p class="mono label">${L.studioListLabel}</p>
    <ul>
      ${studio.map((p, i) => `<li><a class="row" href="${urlOf(p, L)}">
        <img src="${A(p.id)}/poster.jpg" width="1280" height="720" alt="" loading="lazy" decoding="async">
        <span class="mono row-idx">${pad(films.length + i + 1)}</span>
        <span class="row-title">${esc(titleOf(p, L))}</span>
        <span class="mono row-meta">${esc([p.cat[L.lang], p.place[L.lang]].filter(Boolean).join(' · '))}</span>
        <span class="row-arrow" aria-hidden="true">↗</span>
      </a></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section id="edwin" class="about">
  <p class="mono label">05 — ${L.aboutLabel}</p>
  <div class="about-grid">
    <h2 class="serif about-head">${L.aboutHead}</h2>
    <div>
      ${L.aboutBody.map((s) => `<p class="body">${s}</p>`).join('\n      ')}
      <dl class="facts">
        ${L.aboutFacts.map(([k, v]) => `<div><dt class="mono">${k}</dt><dd>${v}</dd></div>`).join('')}
      </dl>
    </div>
  </div>
</section>

<section id="contact" class="contact">
  <p class="mono label">06 — ${L.contactLabel}</p>
  <h2 class="contact-head">${L.contactHead}</h2>
  <p class="body contact-sub">${L.contactSub}</p>
  <div class="contact-grid">
    <form class="form" id="contactForm" action="${FORM}" method="POST" data-sending="${L.f.sending}" data-error="${L.f.error}">
      <label><span class="mono">${L.f.name}</span><input type="text" name="name" autocomplete="name" required></label>
      <label><span class="mono">${L.f.email}</span><input type="email" name="email" autocomplete="email" required></label>
      <label><span class="mono">${L.f.company}</span><input type="text" name="company" autocomplete="organization"></label>
      <label class="full"><span class="mono">${L.f.type}</span><select name="project_type"><option value="">${L.f.typeAny}</option>${L.f.types.map((o) => `<option>${o}</option>`).join('')}</select></label>
      <label class="full"><span class="mono">${L.f.message}</span><textarea name="message" rows="4" required></textarea></label>
      <input type="hidden" name="_subject" value="New project enquiry — Edwin Adolfo × Adolfo Studio">
      <button type="submit" class="btn">${L.f.send} <span aria-hidden="true">→</span></button>
      <p class="form-ok" role="status" hidden>${L.f.ok}</p>
    </form>
    <div class="direct">
      <p class="mono">${L.direct}</p>
      <a href="mailto:${EMAIL}">${EMAIL}</a>
      <a href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp ↗</a>
      <a href="${INSTAGRAM}" target="_blank" rel="noopener">Instagram @adolfostudio ↗</a>
    </div>
  </div>
</section>

</main>
${footer(L)}`;
}

/* ───────────── Project page ───────────── */
function project(p, L) {
  const O = L.lang === 'en' ? t.es : t.en;
  const idx = projects.indexOf(p);
  const nxt = projects[(idx + 1) % projects.length];
  const title = titleOf(p, L);
  const rows = [
    p.kind === 'film' ? [L.cFilm, 'Edwin Adolfo'] : [L.cDir, 'Edwin Adolfo'],
    [L.cProd, 'Adolfo Studio'],
    p.client[L.lang] && p.client[L.lang] !== title ? [p.independent ? L.cContext : L.cClient, p.client[L.lang]] : null,
    [L.cType, p.cat[L.lang]],
    p.place[L.lang] ? [L.cPlace, p.place[L.lang]] : null,
    p.year ? [L.cYear, p.year] : null,
    [L.cFormat, `${p.orient === 'h' ? '16:9' : '9:16'} · ${p.dur}`],
  ].filter(Boolean);
  return `${head(L, { title: `${title} — ${p.cat[L.lang]} ${L.byWord} Edwin Adolfo`, description: p.desc[L.lang], path: urlOf(p, L), altPath: urlOf(p, O), image: `${A(p.id)}/poster.jpg`, ld: videoLd(p, L) })}
<body class="project project-${p.orient}">
${header(L, urlOf(p, O), false)}
<main id="main">
<article>
  <header class="p-head">
    <p class="mono p-back"><a href="${L.home}#work">← ${L.back}</a><span>${pad(idx + 1)}</span></p>
    <h1 class="p-title">${esc(title)}</h1>
    <p class="mono p-meta">${esc(metaLine(p, L))}</p>
  </header>

  <div class="p-stage">
    <div class="p-player">
      <video controls playsinline preload="none" poster="${A(p.id)}/poster.jpg" ${dims(p)} aria-label="${esc(title)}">
        <source src="${A(p.id)}/film.mp4" type="video/mp4">
      </video>
    </div>
    <div class="p-info">
      <p class="serif p-desc">${esc(p.desc[L.lang])}</p>
      <div class="p-credits">
        <h2 class="mono label">${L.credits}</h2>
        <dl class="credits">
          ${rows.map(([k, v]) => `<div><dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n        ')}
        </dl>
        ${p.note ? `<p class="mono p-note">${esc(p.note[L.lang])}</p>` : ''}
      </div>
    </div>
  </div>

  <section class="p-stills" aria-label="${L.stills}">
    ${[1, 2, 3, 4].map((n) => `<img src="${A(p.id)}/s${n}.jpg" ${dims(p)} alt="${esc(L.frameOf(n, title))}" loading="lazy" decoding="async">`).join('\n    ')}
  </section>

  <a class="p-next" href="${urlOf(nxt, L)}">
    <span class="mono">${L.next} — ${pad(((idx + 1) % projects.length) + 1)}</span>
    <span class="p-next-title">${esc(titleOf(nxt, L))}</span>
  </a>
</article>
</main>
${footer(L)}`;
}

/* ───────────── Write ───────────── */
function out(path, html) {
  const file = join(OUT, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
/* ───────────── 404 (bilingual, not indexed) ───────────── */
function notFound() {
  const L = t.en;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 — Edwin Adolfo</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="#111111">
<link rel="icon" href="${FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/site.css">
<script>document.documentElement.classList.add('js')</script>
</head>
<body class="project">
${header(L, '/es/', false)}
<main id="main">
  <header class="p-head">
    <p class="mono p-back"><a href="/">← Edwin Adolfo</a><span>404</span></p>
    <h1 class="p-title">404</h1>
    <p class="mono p-meta">This page does not exist. <a href="/">Home ↗</a></p>
    <p class="mono p-meta" lang="es">Esta página no existe. <a href="/es/">Inicio ↗</a></p>
  </header>
</main>
${footer(L)}`;
}
writeFileSync(join(OUT, '404.html'), notFound());

for (const L of [t.en, t.es]) {
  out(L.home, home(L));
  for (const p of projects) out(urlOf(p, L), project(p, L));
}
const pairs = [[t.en.home, t.es.home], ...projects.map((p) => [urlOf(p, t.en), urlOf(p, t.es)])];
const urls = pairs.flat();
const alt = ([en, es]) => `<xhtml:link rel="alternate" hreflang="en" href="${SITE}${en}"/><xhtml:link rel="alternate" hreflang="es" href="${SITE}${es}"/><xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${en}"/>`;
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${pairs.flatMap((pr) => pr.map((u) => `  <url><loc>${SITE}${u}</loc>${alt(pr)}</url>`)).join('\n')}\n</urlset>\n`);
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Built ${urls.length} pages.`);
