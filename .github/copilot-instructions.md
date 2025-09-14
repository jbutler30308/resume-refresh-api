
# Copilot Instructions for Resume Refresh API

## 1. Project Context

This repository contains the backend API for a client-facing project deployed on Vercel. It serves as the central endpoint for multiple features:

- **Resume rewriting (legacy):** Accepts a resume and optional inputs, processes them via OpenAI, and returns results to the web-app.
- **Travel itinerary creation and validation:** Accepts travel details, generates and validates itineraries using OpenAI, and returns structured results.

The API is designed for extensibility and modularity, supporting additional client features as needed.


## 2. Technology Stack

- **JavaScript:** All backend logic and API routes.
- **OpenAI (openai@4.97.0):** For language model text processing.
- **Vercel:** Serverless API hosting and deployment.


## 3. Copilot Guidance

- **Never assume or guess missing context.**
  - Request clarification when requirements, file names, or business logic are ambiguous.
- **Always specify affected files clearly** in all code suggestions and explanations.
- **Write modular, reusable code.**
  - Decompose logic into distinct functions with clear input/output.
  - Use ES6+ features where appropriate.
- **Optimize for performance and maintainability:**
  - Minimize technical debt and overhead.
  - Follow DRY and KISS principles.
  - Review for memory/runtime bottlenecks, especially in request parsing and OpenAI prompt handling.
  - Adhere to project naming/formatting conventions; prefer existing patterns for error handling, exports, and async logic.
- **Engage critically with all requests:**
  - Provide reasoned, technical feedback; suggest alternatives or challenge approaches if more optimal solutions exist.
- **Keep guidance concise and focused.**
  - Use Markdown formatting (headings, code blocks, bullet lists) for clarity.
- **Respect copyright and project policy.**
  - Do not suggest or generate code that violates licensing or internal rules.

### Security & Data Handling

- Sanitize and validate all incoming data.
- Never log or expose sensitive information (resume, travel, or other client data).
- Treat API routes as public endpoints; assume zero trust.


## 4. Mandatory Planning Process

**CRITICAL:** All development work must follow this planning process before any code implementation.

### Plan-File Requirement

1.  **Before Any Code Changes:** ALL feature requests, architectural changes, or significant modifications must begin with creating—or reusing—an appropriate plan-file in `docs/plans/`.
2.  **User Confirmation Protocol:** When a user requests changes, first inspect `docs/plans/` for a relevant file. If one exists, ask the user to update it, create a new one, or proceed without one. If none exists, ask the user to create one or proceed without one. Honor the user's choice.
3.  **Plan-File Naming Convention:** `NN.semantic-name.md` (e.g., `01.user-comments.md`).
4.  **Required Plan Contents:** Problem Statement, Requirements, Technical Approach, Implementation Steps, Testing Strategy, Risks & Mitigation, Dependencies.
5.  **Exceptions:** This process is not required for taskmaster-ai, documentation updates, or minor, single-line bug fixes.



## 5. Commit Message Guidelines

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification, using clear and contextual messages. Example prefixes:

| Type      | Description                                              |
|-----------|----------------------------------------------------------|
| feat      | For new features or modules                              |
| fix       | For bugfixes or logic corrections                        |
| docs      | Documentation or README/Copilot instruction updates      |
| refactor  | Major code restructuring without functional change       |
| perf      | Performance improvements                                 |

**Examples:**
- `feat(api): add endpoint for itinerary validation`
- `fix(handler): handle empty travel submissions error`
- `docs(api): clarify response format`
- `refactor(openai): extract prompt builder into utility`
- `perf(api): reduce cold start time for OpenAI requests`

> **Note:** Review and update this file after major architecture or workflow changes. Keep instructions up to date with current project conventions.