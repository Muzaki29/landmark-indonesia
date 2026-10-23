# Indonesia 3D Landmarks

An interactive digital heritage exhibition built with React, TypeScript, React Three Fiber, and procedural geometry.

The current collection contains three province entries:

- DKI Jakarta / Monumen Nasional — interactive 3D study with source-backed content.
- Daerah Istimewa Yogyakarta / Tugu Pal Putih — interactive procedural 3D study with source-backed content.
- Sumatera Barat / Jam Gadang — interactive procedural 3D study with source-backed content.

Landmark content and source status live in `src/data/heritage.ts`. A source marked `verified` may support displayed facts; `further-reading` remains separate and is not treated as evidence.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Each landmark is lazy-loaded in its own scene. Confirmed public dimensions are separated from interpretive model proportions in the landmark configuration files; every diorama remains a visual study rather than an architectural survey.
