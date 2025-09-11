### Plan: Add Jest and Unit Tests

1.  **Install and Configure Jest:**
    *   Install `jest` as a development dependency.
    *   Add a `test` script to your `package.json`.
    *   Create a `jest.config.js` file and configure it to work correctly with the ES Modules you are using in your project.

2.  **Find Sample Data:**
    *   Inspect the `logs/dev.log` file to find a real-world sample of the raw text that is processed by your service. This will be used as the input for our tests.

3.  **Refactor for Testability:**
    *   To properly unit-test the helper functions inside `service.js` (like `extractFencedJson` and `safeJsonParse`), export them. This is a standard practice that makes code easier to test in isolation.

4.  **Write Unit Tests:**
    *   Create a new test file at `api/travelService/service.test.js`.
    *   Inside this file, write tests for:
        *   `extractFencedJson`: To ensure it correctly extracts the JSON block from text.
        *   `safeJsonParse`: To verify it handles both valid and malformed JSON gracefully.
        *   `parseResponse`: For the main function, use the sample data from your logs. Use a **snapshot test**, which is perfect for this scenario. It will save the initial HTML output and fail if the output ever changes unexpectedly, preventing regressions.

5.  **Run Tests:**
    *   After writing the tests, run them to confirm that everything is working correctly.
