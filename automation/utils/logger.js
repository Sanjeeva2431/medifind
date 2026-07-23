import fs from 'fs-extra';
import path from 'path';
import { appiumConfig } from '../config/appium.config.js';

export class Logger {
    static logFile = null;

    static init() {
        const logsDir = appiumConfig.paths.logsDir;
        fs.ensureDirSync(logsDir);
        this.logFile = path.join(logsDir, `appium_execution_${Date.now()}.log`);
        const header = `=======================================================\nMEDIFIND APPIUM AUTOMATION LOG - ${new Date().toISOString()}\n=======================================================\n\n`;
        fs.writeFileSync(this.logFile, header);
    }

    static write(level, message) {
        const time = new Date().toISOString();
        const formatted = `[${time}] [${level}] ${message}`;
        console.log(formatted);
        if (this.logFile) {
            try {
                fs.appendFileSync(this.logFile, formatted + '\n');
            } catch (err) {
                // Ignore fallback error
            }
        }
    }

    static info(msg) {
        this.write('INFO', msg);
    }

    static warn(msg) {
        this.write('WARN', msg);
    }

    static error(msg) {
        this.write('ERROR', msg);
    }

    static debug(msg) {
        this.write('DEBUG', msg);
    }
}

Logger.init();
