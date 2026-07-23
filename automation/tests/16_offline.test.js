import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runOfflineTests(driver) {
    return await runModuleSuite('Offline Handling', driver);
}
