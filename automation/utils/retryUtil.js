import { Logger } from './logger.js';

export class RetryUtil {
    static async retry(fn, retries = 2, delayMs = 500) {
        let attempt = 0;
        while (attempt <= retries) {
            try {
                return await fn();
            } catch (error) {
                attempt++;
                if (attempt > retries) {
                    Logger.error(`Action failed after ${retries} retries: ${error.message}`);
                    throw error;
                }
                Logger.warn(`Retry attempt ${attempt}/${retries} after error: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }
}
