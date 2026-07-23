import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runPerformanceTests(driver) {
    return await runModuleSuite('Performance Smoke Tests', driver);
}
