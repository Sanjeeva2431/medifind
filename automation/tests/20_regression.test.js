import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runRegressionTests(driver) {
    return await runModuleSuite('Regression Suite', driver);
}
