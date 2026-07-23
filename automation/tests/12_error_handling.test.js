import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runErrorHandlingTests(driver) {
    return await runModuleSuite('Error Handling', driver);
}
