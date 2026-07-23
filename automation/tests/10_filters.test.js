import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runFiltersTests(driver) {
    return await runModuleSuite('Filters', driver);
}
