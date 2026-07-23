import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runProfileTests(driver) {
    return await runModuleSuite('Profile Management', driver);
}
