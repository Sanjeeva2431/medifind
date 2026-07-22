import fs from 'fs';
import path from 'path';

export class Logger {
    constructor(logFilePath) {
        this.logFilePath = logFilePath;
        if (logFilePath) {
            const dir = path.dirname(logFilePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }
    }

    log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const formatted = `[${timestamp}] [${level}] ${message}`;
        console.log(formatted);
        if (this.logFilePath) {
            fs.appendFileSync(this.logFilePath, formatted + '\n');
        }
    }

    info(msg) { this.log(msg, 'INFO'); }
    warn(msg) { this.log(msg, 'WARN'); }
    error(msg) { this.log(msg, 'ERROR'); }
}
