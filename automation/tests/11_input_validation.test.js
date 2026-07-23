import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runValidationTests(driver) {
    return await runModuleSuite('Input Validation', driver);
}
