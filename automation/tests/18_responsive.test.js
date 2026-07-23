import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runResponsiveTests(driver) {
    return await runModuleSuite('Responsive UI', driver);
}
