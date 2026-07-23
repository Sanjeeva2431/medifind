import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runNavigationTests(driver) {
    return await runModuleSuite('Navigation', driver);
}
