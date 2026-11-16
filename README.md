# @pi-ko/core

Shared library for the independently installable pi extensions. This is a dependency, not a pi extension: it has no `pi.extensions` entry.

Build with `npm run build`. `npm pack` and `npm publish` build automatically. The package contains compiled JavaScript, TypeScript declarations, and the single shared prompt/profile asset collection.

The root export provides `acquire(pi, feature)` and `shared(pi)`. These coordinate one runtime through pi's session event bus, including when multiple physical copies of this library are installed. Internal helpers have explicit package exports grouped under `runtime`, `extensions`, and `backends`; their contracts are versioned with core. Extensions pin the same exact core version.

Prompt assets retain their provenance in `lib/prompts/NOTICE.md`. Existing compatibility/session identifiers are intentionally retained to preserve user data.

## Multi-repository workspace

The `workspace/` directory preserves the development workspace manifest, documentation, and cross-extension tests. With all package repositories checked out as siblings and this repository named `core`, restore the workspace files from the parent directory:

```sh
cp -R core/workspace/. .
npm install
npm test
npm run typecheck
```

These workspace files are not shipped in the npm library.

## Publishing to npm

The `.github/workflows/publish.yml` workflow publishes this package to the public
npm registry when a tag is pushed. It authenticates with the repository secret
`NPM_TOKEN`, an npm automation or granular token that may publish the
`@pi-ko` scope. Enable GitHub Actions in this repository.

Update `package.json` to the release version, commit it, then push a matching tag:

```sh
git tag v0.5.0
git push origin v0.5.0
```

Tags must equal the package version, optionally prefixed with `v`. The workflow
installs dependencies, builds if needed, typechecks, and runs available tests
before publishing. Stable versions use `latest`; prereleases use `next`.
Each version can only be published once.

Publish matching dependency versions in order: `@pi-ko/core`, then
the individual extensions, then `@pi-ko/bundle`. Packages are
published with public access, so dependents install from the public registry
without cross-repository access setup.

## Installing from npm

The committed `.npmrc` routes `@pi-ko` packages to the public npm registry and
leaves other packages on the default registry. The packages are public, so
installing them needs no authentication. Install using the full scoped package
name.
