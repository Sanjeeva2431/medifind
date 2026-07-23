import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runRegistrationTests(driver) {
    return await runModuleSuite('Registration', driver);
}
