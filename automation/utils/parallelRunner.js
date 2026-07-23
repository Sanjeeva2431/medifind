import { Logger } from './logger.js';

export class ParallelRunner {
    static async runSuites(suites, driver, concurrency = 2) {
        Logger.info(`Orchestrating test execution with concurrency limit = ${concurrency}`);
        const results = [];
        for (let i = 0; i < suites.length; i += concurrency) {
            const batch = suites.slice(i, i + concurrency);
            const batchResults = await Promise.all(
                batch.map(async (suite) => {
                    Logger.info(`🚀 Starting suite batch: ${suite.name}`);
                    try {
                        return await suite.runner(driver);
                    } catch (err) {
                        Logger.error(`Error in batch ${suite.name}: ${err.message}`);
                        return [];
                    }
                })
            );
            batchResults.forEach(res => results.push(...res));
        }
        return results;
    }
}
