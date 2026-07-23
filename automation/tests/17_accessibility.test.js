import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runAccessibilityTests(driver) {
    return await runModuleSuite('Accessibility', driver);
}
