# agent-ui

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A monorepo of framework-specific component libraries for building **agent-based user interfaces** — conversational AI assistants, authentication, and template-driven data rendering.

---

## Packages

| Package | Description | Docs |
|---------|-------------|------|
| [agent-ui-react](./agent-ui-react) | React components for agent UIs — AIAssistant, AuthProvider, TemplateRenderer, TemplateDesigner | [README](./agent-ui-react/README.md) |

---

## Getting Started

```bash
# Install the React package
npm install agent-ui-react
```

Then follow the [Quick Start](./agent-ui-react/README.md#quick-start) guide in the package README.

---

## Repository Structure

```
agent-ui/
├── agent-ui-react/        # React component library (npm: agent-ui-react)
│   ├── src/               # Source code
│   ├── lib/               # Build output (not committed)
│   ├── docs/              # Component documentation
│   │   ├── AIAssistant.md
│   │   ├── AuthProvider.md
│   │   ├── TemplateDesigner.md
│   │   ├── TemplateRenderer.md
│   │   └── ReleaseNotes.md
│   └── package.json
├── LICENSE
└── README.md              # ← You are here
```

---

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## Authors and Contributors

Developed and maintained by [Tech Trips](https://github.com/techtrips).

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

