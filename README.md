# pi-code-core

Shared library for the independently installable pi extensions. This is a dependency, not a pi extension: it has no `pi.extensions` entry.

Build with `npm run build`. `npm pack` and `npm publish` build automatically. The package contains compiled JavaScript, TypeScript declarations, and the single shared prompt/profile asset collection.

The root export provides `acquire(pi, feature)` and `shared(pi)`. These coordinate one runtime through pi's session event bus, including when multiple physical copies of this library are installed. Internal helpers have explicit package exports grouped under `runtime`, `extensions`, and `backends`; their contracts are versioned with core. Extensions pin the same exact core version.

Prompt assets retain their provenance in `lib/prompts/NOTICE.md`. Existing compatibility/session identifiers are intentionally retained to preserve user data.
