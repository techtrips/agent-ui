# Release Notes

All notable changes to `agent-ui-react` are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| [0.1.2](#012--2026-03-31) | 2026-03-31 | Packaging & documentation fixes |
| [0.1.1](#011--2026-03-31) | 2026-03-31 | Packaging & documentation fixes |
| [0.1.0](#010--2026-03-31) | 2026-03-31 | Initial release — AuthProvider, AIAssistant, TemplateRenderer, TemplateDesigner |

---

## [0.1.2] — 2026-03-31

### Added

- _Update this section before publishing_

### Changed

- _Update this section before publishing_

### Fixed

- _Update this section before publishing_

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