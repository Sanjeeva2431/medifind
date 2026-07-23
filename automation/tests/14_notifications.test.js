import { runModuleSuite } from './suiteRunnerHelper.js';
export async function runNotificationTests(driver) {
    return await runModuleSuite('Notifications', driver);
}
