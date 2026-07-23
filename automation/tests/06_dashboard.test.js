import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runDashboardTests(driver) {
    return await runModuleSuite('Dashboard', driver);
}
