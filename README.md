# Carriage House Group Squarespace Support

> **Backend API & HTML Fragments for Seamless Squarespace Integrations**

![Vercel](https://vercel.com/button)

---

A private, internal backend powering advanced travel itinerary generation, resume rewriting, and other features for Carriage House Group’s Squarespace sites. Built for technical users and project managers, this API delivers AI-driven content and embeddable HTML fragments to streamline business workflows.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Usage Documentation](#usage-documentation)
- [Features & Capabilities](#features--capabilities)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Additional Sections](#additional-sections)

---

## Getting Started

### Prerequisites

- **Node.js** v22+
- **Vercel CLI** ([Install](https://vercel.com/docs/cli))
- **OpenAI API Key**
- **pnpm** (recommended, or npm)

### Installation

```zsh
# Clone the repo (private/internal)
git clone <internal-repo-url>
cd carriage-house-group-squarespace-support

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your OPENAI_API_KEY, VERCEL_OIDC_TOKEN, etc.
```

### Configuration

- **.env.local** must include:
  - `OPENAI_API_KEY` (required)
  - `VERCEL_OIDC_TOKEN` (for Vercel integration)
- Connect to your Vercel project with:
  ```bash
  vercel link
  ```

### Quick Start

```bash
# Local development (Vercel dev server)
vercel dev
```

---

## Usage Documentation

### API Endpoints

- **POST `/api/refresh-resume`**: Enhance resumes using OpenAI.
- **POST `/api/travel`**: Generate and validate travel itineraries.

See [docs/reference/api_prd.md](docs/reference/api_prd.md) and [docs/reference/travel_web_prd.md](docs/reference/travel_web_prd.md) for detailed API specs and requirements.

### Example: Generate a Travel Itinerary

```js
fetch('/api/travel', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    destination: 'Budapest',
    dates: '2025-10-01 to 2025-10-07',
    groupSize: 4,
    details: 'Team offsite, prefer walkable activities.'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Configuration Options

- **Environment Variables:**
  - `OPENAI_API_KEY` (required)
  - `VERCEL_OIDC_TOKEN` (required for Vercel deploys)
  - See `.env.example` for all options
- **Testing:**
  - Uses **vitest** and **newman** for API and integration tests

---

## Features & Capabilities

- **AI-Powered Resume Rewriting**: Accepts resumes, returns ATS-optimized versions
- **Travel Itinerary Generation**: Structured, validated, and scannable plans
- **Verification & Data Source Transparency**: Collapsible sections, source links
- **Embeddable HTML Fragments**: For seamless Squarespace integration
- **Modular, Extensible API**: Add new endpoints/features as needed
- **Internal-Only**: Not for public or client use

---

## Development Setup

### Local Development

```bash
pnpm install
vercel dev
```

### Testing

```bash
pnpm test         # Runs vitest
pnpm run newman   # Runs Postman/newman API tests
```

### Workflow
- Feature-driven development (see `docs/plans/`)
- Use Vercel for serverless deployment
- All code in `api/` (see [Project Structure](#project-structure))

### Debugging Tips
- Check `logs/` for dev and error logs
- Use `vercel logs` for cloud logs
- API errors are sanitized; check server logs for details

---

## Contributing Guidelines

> **Internal Only:** This repository is not open to external contributors.

- For issues, feature requests, or questions, contact [jb@carriagehousegroup.com](mailto:jb@carriagehousegroup.com)
- Follow existing code style (see `api/`)
- All changes should be reviewed internally before merging

---

## Project Structure

```
api/                # All backend API routes and logic
  ├── refresh-resume.js
  ├── travel.js
  ├── lib/          # Shared utilities (e.g., logger)
  ├── models/       # Data schemas
  ├── prompts/      # OpenAI prompt templates
  ├── templates/    # HTML/JS templates for output
  └── travelService/# Travel itinerary logic & tests

html/               # Embeddable HTML fragments

docs/               # Internal documentation, PRDs, user stories, diagrams
  ├── 0_backlog/    # Backlog features & ideas
  ├── 1_planning/   # In-progress planning docs
  ├── 2_inprogress/ # Currently active work
  ├── 3_completed/  # Completed features
  ├── diagrams/     # Data flow diagrams (see below)
  ├── plans/        # Feature plans & task breakdowns
  ├── reference/    # API specs, sample responses
  └── user_stories/ # User stories for features

logs/               # Dev and error logs

test/               # Postman and integration tests

# (Other folders like `.specstory/`, `.taskmaster/` are for internal planning and task management)
```

### Architecture
- **Serverless**: All endpoints are Vercel serverless functions
- **Stateless**: No persistent backend storage
- **OpenAI Integration**: All AI logic handled via OpenAI API
- **HTML Fragments**: Designed for easy embedding in Squarespace

#### Diagrams
See `docs/diagrams/` for:
- Data flow diagrams (e.g., `intinerary-data-flow.png`, `resume-data-flow.png`)
- Architecture and process documentation

---

## Troubleshooting

### Common Issues
- **API returns 401/403**: Check your `OPENAI_API_KEY` and Vercel token
- **Vercel deploy fails**: Ensure you are linked to the correct Vercel project and environment variables are set
- **Markdown not rendering**: Ensure the `marked` package is installed and up to date
- **Test failures**: Run `pnpm install` to ensure all dependencies are present

### FAQ
- **Is this project open source?**  
  No, this is a proprietary, internal project.
- **Can I use this for other Squarespace sites?**  
  Only with internal approval.
- **Where is the changelog?**  
  Changelog/version history is tracked internally.

### Getting Help
- Contact [jb@carriagehousegroup.com](mailto:jb@carriagehousegroup.com) for support

---

## Additional Sections

### License

> **Proprietary – All rights reserved.**

### Acknowledgments
- [OpenAI](https://openai.com/) for LLM APIs
- [Vercel](https://vercel.com/) for serverless hosting
- [marked](https://github.com/markedjs/marked) for Markdown-to-HTML conversion
- [vitest](https://vitest.dev/) and [newman](https://www.npmjs.com/package/newman) for testing

### Related Resources
- [Squarespace Developer Docs](https://developers.squarespace.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

---

*This README is for internal use only. Do not distribute externally.*
