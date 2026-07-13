# Yeongshin Park

Multi-page portfolio website based on Yeongshin Park's German CV. The visual system follows the layout of `jasa-s.github.io`: compact typography, a timeline, translucent cards, responsive spacing, and automatic light/dark mode.

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
