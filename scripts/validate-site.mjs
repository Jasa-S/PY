import { access, readFile } from 'node:fs/promises';

const pages = {
  'index.html': {
    current: null,
    required: ['editorial-home', 'Künstlerisches Porträt', 'Barockoboe · Blockflöte', 'assets/oboe-reed-portrait.jpg']
  },
  'biografie.html': {
    current: 'Über mich',
    required: ['Künstlerisches Profil', 'Ausgewählte Stationen', 'Prof. Andreas Helm', 'Seoul International Recorder Competition']
  },
  'konzerte.html': {
    current: 'Konzerte',
    required: ['Weihnachtsoratorium', 'Sligo Baroque Music Festival', 'tl-dot']
  },
  'kontakt.html': {
    current: 'Kontakt',
    required: ['Musikalische Anfragen', 'mailto:yeongshinpark1@gmail.com', 'Wien, Österreich']
  }
};

const redirects = {
  'lebenslauf.html': 'biografie.html#stationen',
  'ausbildung.html': 'biografie.html#stationen',
  'meisterkurse.html': 'biografie.html#impulse',
  'auszeichnungen.html': 'biografie.html#auszeichnungen',
  'sprachen.html': 'biografie.html#ueber-mich'
};

const primaryNavigation = [
  ['index.html', 'Start'],
  ['biografie.html', 'Über mich'],
  ['konzerte.html', 'Konzerte'],
  ['kontakt.html', 'Kontakt']
];

const knownLocalFiles = new Set([
  ...Object.keys(pages),
  ...Object.keys(redirects),
  'assets/oboe-score-dark.jpg',
  'assets/oboe-reed-portrait.jpg',
  'assets/oboe-score-light.jpg',
  'assets/manrope-variable.ttf',
  'shared.css',
  'site-icon.svg',
  'theme.js'
]);

const retiredNavigationTargets = Object.keys(redirects);
const titles = new Set();

for (const [page, expectations] of Object.entries(pages)) {
  const html = await readFile(page, 'utf8');

  if (!html.includes('<html lang="de">')) throw new Error(`${page}: missing German language declaration`);
  if (!/<main(?:\s|>)/.test(html)) throw new Error(`${page}: missing main landmark`);
  if (!html.includes('aria-label="Hauptnavigation"')) throw new Error(`${page}: missing main navigation label`);

  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length;
  if (h1Count !== 1) throw new Error(`${page}: expected exactly one h1, found ${h1Count}`);

  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  if (!title) throw new Error(`${page}: missing title`);
  if (titles.has(title)) throw new Error(`${page}: duplicate title: ${title}`);
  titles.add(title);

  for (const [href, label] of primaryNavigation) {
    if (!html.includes(`href="${href}"`)) throw new Error(`${page}: missing site link: ${label}`);
  }

  for (const retiredTarget of retiredNavigationTargets) {
    if (html.includes(`href="${retiredTarget}"`)) throw new Error(`${page}: still links to retired CV page: ${retiredTarget}`);
  }

  if (expectations.current) {
    const currentPattern = new RegExp(`<a href="[^"]+" aria-current="page">${expectations.current}<\\/a>`);
    if (!currentPattern.test(html)) throw new Error(`${page}: wrong or missing active navigation state`);
  } else if (!html.includes('<a class="editorial-brand" href="index.html" aria-current="page">')) {
    throw new Error(`${page}: homepage brand must identify the current page`);
  }

  for (const text of expectations.required) {
    if (!html.includes(text)) throw new Error(`${page}: missing required content: ${text}`);
  }

  if (html.includes('fonts.googleapis.com') || html.includes('prefers-color-scheme: dark')) {
    throw new Error(`${page}: external or conflicting font/theme bootstrap remains`);
  }

  const references = [...html.matchAll(/(?:href|src)="(?!https?:|mailto:|#)([^"]+)"/g)]
    .map((match) => match[1].split(/[?#]/, 1)[0]);

  for (const reference of references) {
    if (!knownLocalFiles.has(reference)) throw new Error(`${page}: unexpected local reference: ${reference}`);
    await access(reference);
  }
}

for (const [page, destination] of Object.entries(redirects)) {
  const html = await readFile(page, 'utf8');
  if (!html.includes(`content="0; url=${destination}"`)) throw new Error(`${page}: missing redirect to ${destination}`);
  if (!html.includes(`href="${destination}"`)) throw new Error(`${page}: missing accessible fallback link`);
}

const home = await readFile('index.html', 'utf8');
const css = await readFile('shared.css', 'utf8');

await access('assets/manrope-variable.ttf');
await access('assets/manrope-OFL.txt');

if (!css.includes('@font-face') || !css.includes('manrope-variable.ttf')) {
  throw new Error('shared.css: self-hosted typography is not configured');
}

if (home.includes('Profil in Zahlen') || home.includes('project-grid') || home.includes('Lebenslauf')) {
  throw new Error('index.html: homepage still leads with CV-oriented framing');
}

if ((home.match(/class="portrait-panel/g) || []).length !== 3) {
  throw new Error('index.html: editorial triptych is incomplete');
}

const about = await readFile('biografie.html', 'utf8');
if (about.includes('href="lebenslauf.html"') || !about.includes('id="stationen"')) {
  throw new Error('biografie.html: CV content is not properly consolidated');
}

const concerts = await readFile('konzerte.html', 'utf8');
if (/tl-dot\s+(?:active|past)/.test(concerts)) {
  throw new Error('konzerte.html: concert dots must not imply a highlighted or ranked event');
}

console.log(`Validated ${Object.keys(pages).length} core pages, ${Object.keys(redirects).length} legacy redirects, consolidated About content, and local assets.`);
