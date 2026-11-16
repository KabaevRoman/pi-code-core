# Pi extensions

Each extension remains a separate Git repository and independently installable pi package. `core/` is the shared `pi-code-core` dependency. The root workspace is local development scaffolding, not a published package.

All packages use version `0.5.0`. Package names are now `pi-code-context`, `pi-code-file-tools`, `pi-code-hooks`, `pi-code-integrations`, `pi-code-project-memory`, `pi-code-permissions`, `pi-code-planning`, `pi-code-prompts-skills`, `pi-code-session-ui`, `pi-code-subagents`, and `pi-code-tasks`.

## Local development

With the repositories checked out beside each other in this directory:

```sh
npm install
npm run build
npm test
npm run typecheck
```

The workspace resolves `pi-code-core` locally. Rebuild core after editing its source. Core ships compiled JavaScript and declarations, because Node's TypeScript stripping does not support TypeScript dependencies inside `node_modules`. Extension entry points remain TypeScript for pi's extension loader.

## Independent installation and release

Every extension that uses the runtime declares a regular dependency on `pi-code-core@0.5.0`. `pi-code-integrations` is currently a standalone status command and needs no core dependency. No extension depends on another extension.

Registry names were checked before this release. The memory extension uses `pi-code-project-memory` because `pi-code-memory` is already owned by another publisher.

Publish core first, then the extensions. `npm pack` / `npm publish` in core runs its build automatically. Each extension can then be packaged or published from its own repository without the workspace or sibling repositories. Users installing one extension receive core through its dependency.

For an unpublished local distribution, build and pack core, pack the desired extension, and install both tarballs in the target project. Example from this workspace:

```sh
mkdir -p /tmp/pi-packages
npm pack --workspace pi-code-core --pack-destination /tmp/pi-packages
npm pack --workspace pi-code-hooks --pack-destination /tmp/pi-packages
```

A Git installation of an extension also needs the declared core version to be available from the configured npm registry, or provided locally. A sibling directory is not used as a published dependency.

## Ownership

- `core/`: runtime, configuration, session state, approvals, permissions engine, memory and hook helpers, process execution, checkpoints, common schemas, prompt pack and compatibility profile.
- Each extension: feature registration, feature-specific tools and behavior, resources, and tests.
- `prompts-skills/`: system-prompt composition and its own skills/templates.

The session event bus coordinates runtime sharing across physical copies of core. Registering the same feature again is ignored. Prompt files are stored once in core; prompt injection remains owned by `pi-code-prompts-skills`.

The old `pi-claude-*` package names are replaced, but existing `claude-compat:*` session keys, settings locations, and compatibility profile identifiers are retained to preserve stored state and behavior. Claude remains in the upstream prompt provenance because those assets came from a Claude Code compatibility profile; renaming the npm packages does not change their origin or rewrite their contents.
