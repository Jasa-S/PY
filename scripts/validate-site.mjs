import { access, readFile } from 'node:fs/promises';

const pages = {
  'index.html': ['Yeongshin Park', 'Lebenslauf entdecken', 'konzerte.html'],
  'konzerte.html': ['Konzerte', 'Weihnachtsoratorium', 'tl-dot'],
  'ausbildung.html': ['Ausbildung', 'Musik und Kunst Privatuniversität', 'Korea National University of Arts'],
  'meisterkurse.html': ['Meisterkurse', 'Vielklang Akademie', 'Urbino Musica Antica 2022'],
  'auszeichnungen.html': ['Auszeichnungen', 'Seoul International Recorder Competition', 'Saturday Recorder Quartetts'],
  'sprachen.html': ['Sprachen &amp; Kontakt', 'Koreanisch', 'mailto:yeongshinpark1@gmail.com']
};

const knownLocalFiles = new Set([
  ...Object.keys(pages),
  'shared.css',
  'site-icon.svg',
  'theme.js'
]);

const titles = new Set();

for (const [page, requiredText] of Object.entries(pages)) {
  const html = await readFile(page, 'utf8');

  if (!html.includes('<html lang="de">')) throw new Error(`${page}: missing German language declaration`);
  if (!html.includes('<main>')) throw new Error(`${page}: missing main landmark`);
  if (!html.includes('aria-label="Hauptnavigation"')) throw new Error(`${page}: missing main navigation label`);

  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length;
  if (h1Count !== 1) throw new Error(`${page}: expected exactly one h1, found ${h1Count}`);

  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  if (!title) throw new Error(`${page}: missing title`);
  if (titles.has(title)) throw new Error(`${page}: duplicate title: ${title}`);
  titles.add(title);

  for (const text of requiredText) {
    if (!html.includes(text)) throw new Error(`${page}: missing required content: ${text}`);
  }

  const references = [...html.matchAll(/(?:href|src)="(?!https?:|mailto:|#)([^"]+)"/g)]
    .map((match) => match[1].split(/[?#]/, 1)[0]);

  for (const reference of references) {
    if (!knownLocalFiles.has(reference)) throw new Error(`${page}: unexpected local reference: ${reference}`);
    await access(reference);
  }
}

const concerts = await readFile('konzerte.html', 'utf8');
if (/tl-dot\s+(?:active|past)/.test(concerts)) {
  throw new Error('konzerte.html: concert dots must not imply a highlighted or ranked event');
}

console.log(`Validated ${Object.keys(pages).length} pages, unique titles, navigation, content, and local assets.`);
