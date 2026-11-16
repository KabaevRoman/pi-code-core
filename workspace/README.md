# Pi extensions

Each extension remains a separate Git repository and independently installable pi package. `core/` is the shared `@pi-ko/core` dependency. The root workspace is local development scaffolding, not a published package.

All packages use version `0.5.0`. Package names are now `@pi-ko/context`, `@pi-ko/file-tools`, `@pi-ko/hooks`, `@pi-ko/integrations`, `@pi-ko/mem`, `@pi-ko/permissions`, `@pi-ko/planning`, `@pi-ko/prompts-skills`, `@pi-ko/session-ui`, `@pi-ko/subagents`, and `@pi-ko/tasks`.

## Local development

With the repositories checked out beside each other in this directory:

```sh
npm install
npm run build
npm test
npm run typecheck
```

The workspace resolves `@pi-ko/core` locally. Rebuild core after editing its source. Core ships compiled JavaScript and declarations, because Node's TypeScript stripping does not support TypeScript dependencies inside `node_modules`. Extension entry points remain TypeScript for pi's extension loader.

## Independent installation and release

Every extension that uses the runtime declares a regular dependency on `@pi-ko/core@0.5.0`.  No extension depends on another extension.

All suite packages are scoped under `@pi-ko` and published to the public npm registry. The workspace `.npmrc` routes this scope to `https://registry.npmjs.org`. The packages are public, so registry installs need no authentication. See each repository README for release order.

Publish core first, then the extensions, then `@pi-ko/bundle`. `npm pack` / `npm publish` in core runs its build automatically. Each extension can then be packaged or published from its own repository without the workspace or sibling repositories. Users installing one extension receive core through its dependency.

For an unpublished local distribution, build and pack core, pack the desired extension, and install both tarballs in the target project. Example from this workspace:

```sh
mkdir -p /tmp/pi-packages
npm pack --workspace @pi-ko/core --pack-destination /tmp/pi-packages
npm pack --workspace @pi-ko/hooks --pack-destination /tmp/pi-packages
```

A Git installation of an extension also needs the declared core version to be available from the configured npm registry, or provided locally. A sibling directory is not used as a published dependency.

## Ownership

- `core/`: runtime, configuration, session state, approvals, permissions engine, memory and hook helpers, process execution, checkpoints, common schemas, prompt pack and compatibility profile.
- Each extension: feature registration, feature-specific tools and behavior, resources, and tests.
- `prompts-skills/`: system-prompt composition and its own skills/templates.

The session event bus coordinates runtime sharing across physical copies of core. Registering the same feature again is ignored. Prompt files are stored once in core; prompt injection remains owned by `@pi-ko/prompts-skills`.

The old `pi-claude-*` package names are replaced, and session keys, channel identifiers, and the data store now use `code-compat` / `pi-code-compat` naming. Settings locations (`.claude/settings.json`, `CLAUDE.md` memory files, `CLAUDE_PROJECT_DIR`) are unchanged so existing on-disk configuration keeps working. Upstream prompt provenance is retained in `lib/prompts` (NOTICE.md, manifest.json, source-tree.json, and the `original/` fragments) because those assets are reproduced from an external prompt-inventory project; renaming the npm packages does not change their origin or rewrite their contents.

## Full bundle

`bundle/` contains `@pi-ko/bundle`, which installs and activates all 11 extensions. It depends on the individual packages and carries no copied source or prompt pack. Individual and bundled installations can coexist without duplicate registration. After publication, install with `pi install npm:@pi-ko/bundle`.
