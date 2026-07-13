import { access, readFile } from 'node:fs/promises';

const pages = {
  'index.html': {
    current: null,
    required: ['editorial-home', 'Künstlerisches Porträt', 'Barockoboe · Blockflöte', 'assets/oboe-reed-portrait.jpg']
  },
  'biografie.html': {
    current: 'Biografie',
    required: ['Künstlerisches Profil', 'Sligo Baroque Music Festival', 'Prof. Andreas Helm']
  },
  'konzerte.html': {
    current: 'Konzerte',
    required: ['Weihnachtsoratorium', 'Sligo Baroque Music Festival', 'tl-dot']
  },
  'lebenslauf.html': {
    current: 'Lebenslauf',
    required: ['Curriculum Vitae', 'ausbildung.html', 'meisterkurse.html', 'auszeichnungen.html', 'sprachen.html']
  },
  'kontakt.html': {
    current: 'Kontakt',
    required: ['Musikalische Anfragen', 'mailto:yeongshinpark1@gmail.com', 'Wien, Österreich']
  },
  'ausbildung.html': {
    current: 'Lebenslauf',
    required: ['Musik und Kunst Privatuniversität', 'Korea National University of Arts']
  },
  'meisterkurse.html': {
    current: 'Lebenslauf',
    required: ['Vielklang Akademie', 'Urbino Musica Antica 2022']
  },
  'auszeichnungen.html': {
    current: 'Lebenslauf',
    required: ['Seoul International Recorder Competition', 'Saturday Recorder Quartetts']
  },
  'sprachen.html': {
    current: 'Lebenslauf',
    required: ['Koreanisch', 'Englisch', 'Deutsch']
  }
};

const primaryNavigation = [
  ['index.html', 'Übersicht'],
  ['biografie.html', 'Biografie'],
  ['konzerte.html', 'Konzerte'],
  ['lebenslauf.html', 'Lebenslauf'],
  ['kontakt.html', 'Kontakt']
];

const knownLocalFiles = new Set([
  ...Object.keys(pages),
  'assets/oboe-score-dark.jpg',
  'assets/oboe-reed-portrait.jpg',
  'assets/oboe-score-light.jpg',
  'shared.css',
  'site-icon.svg',
  'theme.js'
]);

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

  if (expectations.current) {
    const currentPattern = new RegExp(`<a href="[^"]+" aria-current="page">${expectations.current}<\\/a>`);
    if (!currentPattern.test(html)) throw new Error(`${page}: wrong or missing active navigation state`);
  } else if (!html.includes('<a class="editorial-brand" href="index.html" aria-current="page">')) {
    throw new Error(`${page}: homepage brand must identify the current page`);
  }

  for (const text of expectations.required) {
    if (!html.includes(text)) throw new Error(`${page}: missing required content: ${text}`);
  }

  const references = [...html.matchAll(/(?:href|src)="(?!https?:|mailto:|#)([^"]+)"/g)]
    .map((match) => match[1].split(/[?#]/, 1)[0]);

  for (const reference of references) {
    if (!knownLocalFiles.has(reference)) throw new Error(`${page}: unexpected local reference: ${reference}`);
    await access(reference);
  }
}

const home = await readFile('index.html', 'utf8');
if (home.includes('Profil in Zahlen') || home.includes('project-grid') || home.includes('Lebenslauf entdecken')) {
  throw new Error('index.html: homepage still leads with CV-oriented framing');
}

if ((home.match(/class="portrait-panel/g) || []).length !== 3) {
  throw new Error('index.html: editorial triptych is incomplete');
}

const concerts = await readFile('konzerte.html', 'utf8');
if (/tl-dot\s+(?:active|past)/.test(concerts)) {
  throw new Error('konzerte.html: concert dots must not imply a highlighted or ranked event');
}

console.log(`Validated ${Object.keys(pages).length} pages, editorial homepage, artist-focused navigation, unique titles, content, and local assets.`);
