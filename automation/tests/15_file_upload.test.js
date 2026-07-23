import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runFileUploadTests(driver) {
    return await runModuleSuite('File Upload', driver);
}
