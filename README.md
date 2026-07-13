# Yeongshin Park

Multi-page portfolio website based on Yeongshin Park's German CV. The visual system uses a restrained, image-led editorial homepage, airy typography, neutral timelines, and dedicated pages for the artistic biography, concerts, CV, and contact.

The homepage instrument still lifes are original AI-generated editorial assets created for this site; they do not depict Yeongshin Park.

## Primary pages

- `index.html` - overview
- `biografie.html` - artistic biography
- `konzerte.html` - concert history
- `lebenslauf.html` - CV hub
- `kontakt.html` - booking and project contact

## CV detail pages

- `ausbildung.html` - academic training
- `meisterkurse.html` - masterclasses
- `auszeichnungen.html` - competitions and scholarships
- `sprachen.html` - languages

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
