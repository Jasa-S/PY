# Yeongshin Park

Multi-page portfolio website based on Yeongshin Park's German CV. The visual system uses a restrained, image-led editorial homepage, airy typography, neutral concert lists, and dedicated pages for the artistic profile, concerts, and contact.

The homepage instrument still lifes are original AI-generated editorial assets created for this site; they do not depict Yeongshin Park. Typography uses a self-hosted Manrope variable font, distributed under the SIL Open Font License in `assets/manrope-OFL.txt`.

## Primary pages

- `index.html` - overview
- `biografie.html` - About page with biography and selected artistic milestones
- `konzerte.html` - concert history
- `kontakt.html` - booking and project contact

## Legacy routes

The former CV hub and detail URLs redirect to the relevant section of `biografie.html`, preserving existing links without exposing a résumé-style navigation structure.

## Local preview

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Checks

```sh
npm test
```

GitHub Pages can serve the repository directly from the `main` branch; there is no build step.
