### Plan: Switch to Vitest

1.  **Clean Up:** First, remove the `jest` and `babel` packages from the `devDependencies`.
2.  **Install Vitest:** Install `vitest` as the new testing framework.
3.  **Update `package.json`:** Update the `test` script to run `vitest`.
4.  **Update Test File:** The test syntax is compatible, but Vitest requires its functions to be imported. Add `import { describe, it, expect } from 'vitest';` to the top of the test file.
5.  **Run Tests:** Run the tests using the new `vitest` command to confirm that everything works as expected.
