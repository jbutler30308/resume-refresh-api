
## API Handler Best Practice Recommendations

- Export a single handler function per API file (use `export default` or `module.exports`).
- Wrap all async logic in try/catch blocks; never leak sensitive info in errors.
- Validate and sanitize all incoming data (body, query, headers). Use libraries like `joi` or `zod` for input validation, or custom logic.
- Explicitly check and handle allowed HTTP methods; return 405 for unsupported methods.
- Respond to `OPTIONS` requests with correct CORS headers and status 200. (You allow OPTIONS for preflight requests, which is good for CORS. Make sure your handlers respond correctly.)
- Never log or return sensitive data (e.g., resume contents, API keys).
- Use environment variables for secrets, not hardcoded values.
- Set appropriate CORS headers for browser access.
- Minimize cold start time: only import what’s needed inside the handler; avoid large dependencies or unnecessary top-level code.
- Always return JSON responses with a consistent structure. Set `Content-Type: application/json` header explicitly.
- Consider adding rate limiting to prevent abuse (especially for OpenAI endpoints).
- Add a `README.md` section on local development vs. Vercel deployment.
- Consider using TypeScript for better maintainability and type safety.
- Add tests for your API endpoints (unit/integration).
- Ensure all API handlers return proper HTTP status codes and error messages.
- Use try/catch blocks around async logic, especially when calling external APIs (like OpenAI).

---

See also: Vercel API and security best practices for further improvements.