# Release Notes

All notable changes to `agent-ui-react` are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| [0.1.6](#016--2026-04-19) | 2026-04-19 | - |
| [0.1.7](#017--2026-04-19) | 2026-04-19 | - |
| [0.1.5](#015--2026-04-19) | 2026-04-19 | AIAssistant new version created |
| [0.1.4](#014--2026-03-31) | 2026-03-31 | Repository URL update |
| [0.1.3](#013--2026-03-31) | 2026-03-31 | Postversion automation, absolute links for npm |
| [0.1.2](#012--2026-03-31) | 2026-03-31 | README link fixes for npm, postversion script |
| [0.1.1](#011--2026-03-31) | 2026-03-31 | Packaging & documentation fixes |
| [0.1.0](#010--2026-03-31) | 2026-03-31 | Initial release — AuthProvider, AIAssistant, TemplateRenderer, TemplateDesigner |

---

## [0.1.6] — 2026-04-19

### Added

- _Update this section before publishing_

### Changed

- _Update this section before publishing_

### Fixed

- _Update this section before publishing_

---

## [0.1.7] — 2026-04-19

### Added

- _Update this section before publishing_

### Changed

- _Update this section before publishing_

### Fixed

- _Update this section before publishing_

---

## [0.1.5] — 2026-04-19

### Added

- **AIAssistant** component — rebuilt with new architecture featuring chat functionality, sidebar conversation navigation, and context-based state management.
- **Voice input** component with Web Speech API speech recognition hooks.
- **Template Renderer** extension for managing and rendering structured templates.
- **Dynamic UI generation** — `generateDynamicUi` pipeline that renders assistant messages as styled HTML via Azure OpenAI, with `IsolatedHtmlRenderer` for safe shadow-DOM display.
- **Lazy message loading** (`LazyMessage`) using `IntersectionObserver` with 200px lookahead; last 6 messages render eagerly, older ones load on scroll.
- **Resizable side panel** with drag-to-resize via `useResizePanel` hook.
- **Starter prompt chips** for guided onboarding in the chat input area.
- **Tool call handling** — accumulates tool calls from streamed messages and attaches them to assistant messages.
- GitHub Actions workflow for automated npm publishing.
- `CODEOWNERS` file requiring repo owner approval.

### Changed

- **Mobile responsive layout** — assistant renders as an absolute overlay on the content area (≤768px) while keeping the nav bar visible; fullscreen toggle hidden on mobile.
- **Dynamic panel width** — `useResizePanel` defaults based on viewport width (520px on ≥1600, scaling down to 360px on <900).
- **Auto-scroll** enhanced to observe grandchild elements and subtree mutations for more reliable scroll-to-bottom.
- **Message resolution** uses module-level dedup cache (`resolveCache`) with `{promise, done, html}` to prevent duplicate API calls in StrictMode.
- **Conversation history** loading uses in-flight promise dedup to avoid duplicate `/api/conversations` requests.
- Code style consistency and readability refactoring across multiple files.

### Fixed

- Fixed `AgentSubscriber` import (moved from `@ag-ui/core` to `@ag-ui/client`).
- Removed unused imports and variables (`tokens`, `handleKeyDown`, `extractParameters`, `normalizeList`, `Skeleton`).
- Fixed Griffel `borderColor` type errors in `StarterPrompts.styles.ts` and `TemplateRenderer.styles.ts` by using `shorthands.borderColor()`.

---


## [0.1.4] — 2026-03-31

### Changed

- Updated `repository.url` in `package.json` to point to `techtrips/agent-ui`.

---

## [0.1.3] — 2026-03-31

### Changed

- Converted all relative links in README to absolute GitHub URLs so they work correctly on npmjs.com.
- Updated version badge to reflect current version.

---

## [0.1.2] — 2026-03-31

### Added

- `postversion` script (`scripts/postversion.js`) to automatically update the README version badge and add a new ChangeLog entry on `npm version`.

### Changed

- Updated `agent-ui/README.md` with badges, packages table, repository structure, documentation links, and contributing guidelines.
- Removed version column from Packages table to avoid staleness.

---

## [0.1.1] — 2026-03-31

### Fixed

- Fixed `.npmignore` to exclude `rspack.config.ts` from the published package.
- Added `lib/` to `.gitignore` to prevent build output from being committed.

### Changed

- Comprehensive README with badges, installation, quick start, component table, dependencies, browser support, contributing guidelines, and license.
- Component documentation split into individual files under `docs/` (AuthProvider, AIAssistant, TemplateRenderer, TemplateDesigner).
- Release notes restructured with version history summary table and anchor links.

---

## [0.1.0] — 2026-03-31

### Added

- **Initial release** of `agent-ui-react`.
- **AuthProvider** — React Context-based authentication wrapper.
  - JWT token decoding for user info extraction.
  - Role-based permission mapping via `mapRolesToPermissions` utility.
  - `useUserInfo()` context hook for accessing user details and permissions.
  - `AuthProviderService` for fetching user roles from the API.
  - `checkPermission()` utility for granular permission checks.
- **AIAssistant** — Conversational AI chat component.
  - Multi-agent support with configurable agent routing.
  - [AG-UI protocol](https://github.com/ag-ui-protocol/ag-ui) integration for real-time streaming.
  - Conversation history management (create, list, delete).
  - Starter prompts support for guided onboarding.
  - Template-based structured responses.
  - Configurable display modes: `Copilot` (side panel) and `Fullscreen`.
  - Feature toggles via `AIAssistantFeature` enum (History, StarterPrompts, Templates, AgentThinking, MarkdownResponse).
  - Permission model via `AIAssistantPermission` enum.
  - `useAiAssistantContext()` hook for accessing assistant state.
  - `AIAssistantService` with full CRUD for conversations, starter prompts, templates, and agent execution.
- **TemplateRenderer** — JSON-driven card rendering engine.
  - Renders `ITemplate` definitions into structured UI cards.
  - 8 built-in control types: `field`, `badge`, `button`, `table`, `image`, `progressBar`, `inputField`, `separator`.
  - Data binding via `IBindable<T>` with `{{path.to.value}}` expression syntax.
  - Section-level and card-level layout support.
  - Action handling for button controls.
- **TemplateDesigner** — Visual template editor.
  - Drag-and-drop card and control placement.
  - Property panel for editing control attributes.
  - Live preview mode for real-time template rendering.
  - JSON editor mode for direct template manipulation.
  - Data source schema binding for autocomplete in binding expressions.
  - `extractBindingPaths()` and `validateTemplateJson()` utilities.
- Project setup with Rspack, TypeScript, Biome (lint/format), and React 19.