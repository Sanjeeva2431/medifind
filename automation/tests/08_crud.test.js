import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runCrudTests(driver) {
    return await runModuleSuite('CRUD Operations', driver);
}
