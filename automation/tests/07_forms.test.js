import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runFormsTests(driver) {
    return await runModuleSuite('Forms', driver);
}
