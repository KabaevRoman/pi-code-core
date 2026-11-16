# @kabaevroman/pi-code-core

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

## Publishing to GitHub Packages

The `.github/workflows/publish.yml` workflow publishes this package when a tag is
pushed. It uses the automatic `GITHUB_TOKEN` with `packages: write`; no custom
publishing secret is needed. Enable GitHub Actions in this repository.

Update `package.json` to the release version, commit it, then push a matching tag:

```sh
git tag v0.5.0
git push origin v0.5.0
```

Tags must equal the package version, optionally prefixed with `v`. The workflow
installs dependencies, builds if needed, typechecks, and runs available tests
before publishing. Stable versions use `latest`; prereleases use `next`.
Each version can only be published once.

Publish matching dependency versions in order: `@kabaevroman/pi-code-core`, then
the individual extensions, then `@kabaevroman/pi-code-bundle`. After publishing
core, open its GitHub package settings → Manage Actions access and grant **Read**
to every extension repository that depends on it. Before publishing the bundle,
grant its repository **Read** access to each extension package and core as well.
This allows the repositories' `GITHUB_TOKEN` to install dependencies.

New GitHub packages default to private visibility. Change visibility in the
GitHub package settings if public distribution is intended.

## Installing from GitHub Packages

The committed `.npmrc` routes `@kabaevroman` packages to GitHub Packages and leaves
other packages on the default npm registry. Consumers need the same scope mapping
in their project or user `.npmrc`. Authenticate locally with a GitHub personal
access token **(classic)** with `read:packages` and access to the packages:

```sh
npm login --scope=@kabaevroman --auth-type=legacy --registry=https://npm.pkg.github.com
```

Use your GitHub username and the token as the password. Authentication is required
even for public GitHub npm packages. Keep credentials in your user configuration;
never commit tokens. Install using the full scoped package name.
