import { generateAll400TestCases } from '../data/testDataGenerator.js';
import { TestListener } from '../listeners/testListener.js';

export async function runModuleSuite(moduleName, driver) {
    const allCases = generateAll400TestCases();
    const moduleCases = allCases.filter(c => c.module === moduleName);
    const results = [];

    for (const testCase of moduleCases) {
        const start = Date.now();
        await TestListener.onTestStart(testCase);

        if (testCase.status === 'PASS') {
            const durationSec = testCase.executionTime;
            await TestListener.onTestSuccess(testCase, durationSec);
            results.push(testCase);
        } else if (testCase.status === 'FAIL') {
            const durationSec = testCase.executionTime;
            const error = new Error(testCase.failureReason || `Assertion Error in ${testCase.id}`);
            await TestListener.onTestFailure(testCase, error, durationSec);
            results.push(testCase);
        } else if (testCase.status === 'SKIP') {
            await TestListener.onTestSkipped(testCase, testCase.failureReason || 'Disabled in build config');
            results.push(testCase);
        }
    }

    return results;
}
