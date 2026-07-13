import { readFile, access } from 'node:fs/promises';

const html = await readFile('index.html', 'utf8');

const requiredText = [
  '<html lang="de">',
  'Yeongshin Park',
  'Konzerte',
  'Ausbildung',
  'Meisterkurse',
  'Wettbewerbe &amp; Stipendien',
  'Sprachen',
  'mailto:yeongshinpark1@gmail.com'
];

for (const text of requiredText) {
  if (!html.includes(text)) throw new Error(`Missing required content: ${text}`);
}

const localAssets = [...html.matchAll(/(?:href|src)="(?!https?:|mailto:|#)([^"]+)"/g)]
  .map((match) => match[1]);

await Promise.all(localAssets.map((asset) => access(asset)));

console.log(`Validated index.html and ${localAssets.length} local asset references.`);
