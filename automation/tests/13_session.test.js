import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runSessionTests(driver) {
    return await runModuleSuite('Session Management', driver);
}
