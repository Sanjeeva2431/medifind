import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runAuthTests(driver) {
    return await runModuleSuite('Authentication', driver);
}
