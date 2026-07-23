import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runSearchTests(driver) {
    return await runModuleSuite('Search', driver);
}
