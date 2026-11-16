# Pi extensions

Each extension remains a separate Git repository and independently installable pi package. `core/` is the shared `@kabaevroman/pi-code-core` dependency. The root workspace is local development scaffolding, not a published package.

All packages use version `0.5.0`. Package names are now `@kabaevroman/pi-code-context`, `@kabaevroman/pi-code-file-tools`, `@kabaevroman/pi-code-hooks`, `@kabaevroman/pi-code-integrations`, `@kabaevroman/pi-code-mem`, `@kabaevroman/pi-code-permissions`, `@kabaevroman/pi-code-planning`, `@kabaevroman/pi-code-prompts-skills`, `@kabaevroman/pi-code-session-ui`, `@kabaevroman/pi-code-subagents`, and `@kabaevroman/pi-code-tasks`.

## Local development

With the repositories checked out beside each other in this directory:

```sh
npm install
npm run build
npm test
npm run typecheck
```

The workspace resolves `@kabaevroman/pi-code-core` locally. Rebuild core after editing its source. Core ships compiled JavaScript and declarations, because Node's TypeScript stripping does not support TypeScript dependencies inside `node_modules`. Extension entry points remain TypeScript for pi's extension loader.

## Independent installation and release

Every extension that uses the runtime declares a regular dependency on `@kabaevroman/pi-code-core@0.5.0`.  No extension depends on another extension.

All suite packages are scoped under `@kabaevroman` and published to GitHub Packages. The workspace `.npmrc` routes this scope to `https://npm.pkg.github.com`. For registry installs, authenticate with `npm login --scope=@kabaevroman --auth-type=legacy --registry=https://npm.pkg.github.com` using a GitHub personal access token (classic) with `read:packages`. Public GitHub npm packages also require authentication. See each repository README for release order and cross-repository Actions access setup.

Publish core first, then the extensions, then `@kabaevroman/pi-code-bundle`. `npm pack` / `npm publish` in core runs its build automatically. Each extension can then be packaged or published from its own repository without the workspace or sibling repositories. Users installing one extension receive core through its dependency.

For an unpublished local distribution, build and pack core, pack the desired extension, and install both tarballs in the target project. Example from this workspace:

```sh
mkdir -p /tmp/pi-packages
npm pack --workspace @kabaevroman/pi-code-core --pack-destination /tmp/pi-packages
npm pack --workspace @kabaevroman/pi-code-hooks --pack-destination /tmp/pi-packages
```

A Git installation of an extension also needs the declared core version to be available from the configured npm registry, or provided locally. A sibling directory is not used as a published dependency.

## Ownership

- `core/`: runtime, configuration, session state, approvals, permissions engine, memory and hook helpers, process execution, checkpoints, common schemas, prompt pack and compatibility profile.
- Each extension: feature registration, feature-specific tools and behavior, resources, and tests.
- `prompts-skills/`: system-prompt composition and its own skills/templates.

The session event bus coordinates runtime sharing across physical copies of core. Registering the same feature again is ignored. Prompt files are stored once in core; prompt injection remains owned by `@kabaevroman/pi-code-prompts-skills`.

The old `pi-claude-*` package names are replaced, but existing `claude-compat:*` session keys, settings locations, and compatibility profile identifiers are retained to preserve stored state and behavior. Claude remains in the upstream prompt provenance because those assets came from a Claude Code compatibility profile; renaming the npm packages does not change their origin or rewrite their contents.

## Full bundle

`bundle/` contains `@kabaevroman/pi-code-bundle`, which installs and activates all 11 extensions. It depends on the individual packages and carries no copied source or prompt pack. Individual and bundled installations can coexist without duplicate registration. After publication, install with `pi install npm:@kabaevroman/pi-code-bundle`.
