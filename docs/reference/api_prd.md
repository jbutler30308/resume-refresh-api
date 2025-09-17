# Product Requirements Document (PRD): Resume Refresh API

## Overview
Resume Refresh API is a serverless backend deployed on Vercel, designed to power client-facing features for resume rewriting and travel itinerary creation/validation. It solves the problem of automating resume enhancement for job seekers and generating/validating travel plans for coordinators. The API is modular and extensible, supporting future client features as needed. HTML fragments in the `html/` directory are manually integrated into Squarespace websites for front-end display.

## Core Features

### Resume Rewriting
- **What it does:** Accepts a resume and optional inputs, processes them via OpenAI, and returns an ATS-friendly, improved resume.
- **Why it's important:** Helps job seekers optimize resumes for automated tracking systems and improve their chances of landing interviews.
- **How it works:** Exposes a POST endpoint `/api/refresh-resume` that receives resume data, builds prompts, and interacts with OpenAI for rewriting.

### Travel Itinerary Creation & Validation
- **What it does:** Accepts travel details, generates and validates itineraries using OpenAI, and returns structured results.
- **Why it's important:** Enables travel coordinators to automate itinerary planning and validation, reducing manual effort and errors.
- **How it works:** Exposes `/api/travel` endpoint (POST/GET) for itinerary creation and validation, using prompt templates and schema validation.

### Extensibility
- The API is designed to support additional endpoints and features as client needs evolve, with modular code structure and clear separation of concerns.

## User Experience
- **Personas:**
  - Resume endpoints: Job seekers
  - Travel endpoints: Travel coordinators (not travelers)
- **User Flows:**
  - Job seeker submits resume via web app → API rewrites resume → Enhanced resume returned
  - Travel coordinator submits trip details → API generates/validates itinerary → Structured itinerary returned
- **UI/UX:**
  - Front-end integration is handled via Squarespace code blocks using HTML fragments from `html/`.

## Technical Architecture
- **System Components:**
  - API routes: `api/refresh-resume.js`, `api/travel.js`
  - Supporting modules: prompt builders, templates, logging
  - OpenAI integration for LLM processing
  - Vercel serverless deployment
- **Data Models:**
  - Resume: Text, optional metadata
  - Travel: Structured JSON, validated against schema
- **APIs & Integrations:**
  - OpenAI (current, per client preference)
  - Vercel for deployment
- **Infrastructure:**
  - No database; stateless API
  - HTML fragments for manual front-end integration

## Development Roadmap
- **MVP Requirements:**
  - Resume rewriting endpoint
  - Travel itinerary creation/validation endpoint
  - Modular codebase for future extensibility
- **Future Enhancements:**
  - Additional endpoints (e.g., cover letter, job matching)
  - Support for alternative LLMs if client requirements change
  - Automated front-end integration

## Logical Dependency Chain
- Foundation: Resume and travel endpoints, prompt/template modules
- Next: Schema validation, error handling, logging
- Usable front-end: HTML fragments for Squarespace
- Extensibility: Modular structure for new features

## Risks and Mitigations
- **Technical challenges:**
  - OpenAI API changes or outages → Mitigate by modularizing LLM integration
  - Manual HTML integration errors → Mitigate by documenting fragment usage
- **MVP definition:**
  - Scope creep → Mitigate by clear requirements and modular design
- **Resource constraints:**
  - Limited to Vercel and OpenAI per client preference

## Appendix
- **Research findings:**
  - Vercel best practices (see `.specstory` history)
  - OpenAI prompt engineering for resume/travel use cases
- **Technical specifications:**
  - See `api/` source code and `vercel.json` for deployment config
- **Known Issues:**
  - See `.specstory/history/` for implementation lessons and open problems

---
This PRD is based on current project files, client requirements, and planning instructions. Update as new features or requirements emerge.
