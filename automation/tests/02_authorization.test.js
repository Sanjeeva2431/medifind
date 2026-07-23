import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runAuthorizationTests(driver) {
    return await runModuleSuite('Authorization', driver);
}
