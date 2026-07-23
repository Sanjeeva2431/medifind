import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import { DriverManager } from '../drivers/driverManager.js';
import { Logger } from '../utils/logger.js';
import { appiumConfig } from '../config/appium.config.js';

import { runAuthTests } from '../tests/01_auth.test.js';
import { runAuthorizationTests } from '../tests/02_authorization.test.js';
import { runRegistrationTests } from '../tests/03_registration.test.js';
import { runProfileTests } from '../tests/04_profile.test.js';
import { runNavigationTests } from '../tests/05_navigation.test.js';
import { runDashboardTests } from '../tests/06_dashboard.test.js';
import { runFormsTests } from '../tests/07_forms.test.js';
import { runCrudTests } from '../tests/08_crud.test.js';
import { runSearchTests } from '../tests/09_search.test.js';
import { runFiltersTests } from '../tests/10_filters.test.js';
import { runValidationTests } from '../tests/11_input_validation.test.js';
import { runErrorHandlingTests } from '../tests/12_error_handling.test.js';
import { runSessionTests } from '../tests/13_session.test.js';
import { runNotificationTests } from '../tests/14_notifications.test.js';
import { runFileUploadTests } from '../tests/15_file_upload.test.js';
import { runOfflineTests } from '../tests/16_offline.test.js';
import { runAccessibilityTests } from '../tests/17_accessibility.test.js';
import { runResponsiveTests } from '../tests/18_responsive.test.js';
import { runPerformanceTests } from '../tests/19_performance.test.js';
import { runRegressionTests } from '../tests/20_regression.test.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

async function runMasterAndroidAppiumSuite() {
    Logger.info(`=======================================================`);
    Logger.info(`📱 MEDIFIND ENTERPRISE ANDROID APPIUM E2E TEST SUITE`);
    Logger.info(`=======================================================`);
    Logger.info(`📍 Appium Endpoint  : http://${appiumConfig.host}:${appiumConfig.port}`);
    Logger.info(`🤖 Target Device    : ${appiumConfig.capabilities['appium:deviceName']} (Android ${appiumConfig.capabilities['appium:platformVersion']})`);
    Logger.info(`⚡ Automation Engine: ${appiumConfig.capabilities['appium:automationName']}`);
    Logger.info(`📲 App Package      : ${appiumConfig.capabilities['appium:appPackage']}`);
    Logger.info(`=======================================================\n`);

    const driver = await DriverManager.getDriver();
    const allResults = [];

    const testSuites = [
        { name: '01. Authentication Suite (40 TCs)', runner: runAuthTests },
        { name: '02. Authorization Suite (30 TCs)', runner: runAuthorizationTests },
        { name: '03. Registration Suite (20 TCs)', runner: runRegistrationTests },
        { name: '04. Profile Management Suite (20 TCs)', runner: runProfileTests },
        { name: '05. Navigation Suite (30 TCs)', runner: runNavigationTests },
        { name: '06. Dashboard Suite (20 TCs)', runner: runDashboardTests },
        { name: '07. Forms Suite (40 TCs)', runner: runFormsTests },
        { name: '08. CRUD Operations Suite (40 TCs)', runner: runCrudTests },
        { name: '09. Search Suite (20 TCs)', runner: runSearchTests },
        { name: '10. Filters Suite (20 TCs)', runner: runFiltersTests },
        { name: '11. Input Validation Suite (40 TCs)', runner: runValidationTests },
        { name: '12. Error Handling Suite (20 TCs)', runner: runErrorHandlingTests },
        { name: '13. Session Management Suite (20 TCs)', runner: runSessionTests },
        { name: '14. Notifications Suite (20 TCs)', runner: runNotificationTests },
        { name: '15. File Upload Suite (20 TCs)', runner: runFileUploadTests },
        { name: '16. Offline Handling Suite (10 TCs)', runner: runOfflineTests },
        { name: '17. Accessibility Suite (20 TCs)', runner: runAccessibilityTests },
        { name: '18. Responsive UI Suite (10 TCs)', runner: runResponsiveTests },
        { name: '19. Performance Smoke Tests (20 TCs)', runner: runPerformanceTests },
        { name: '20. Regression Suite (50 TCs)', runner: runRegressionTests }
    ];

    const startTime = Date.now();

    for (const suite of testSuites) {
        Logger.info(`⏳ Executing ${suite.name}...`);
        try {
            const suiteResults = await suite.runner(driver);
            allResults.push(...suiteResults);
            const passed = suiteResults.filter(r => r.status === 'PASS').length;
            Logger.info(`   ✅ Finished ${suite.name}: ${passed}/${suiteResults.length} Passed`);
        } catch (err) {
            Logger.error(`   ❌ Failed executing ${suite.name}: ${err.message}`);
        }
    }

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
    const passedTotal = allResults.filter(r => r.status === 'PASS').length;
    const failedTotal = allResults.filter(r => r.status === 'FAIL').length;
    const skippedTotal = allResults.filter(r => r.status === 'SKIP').length;
    const passRate = ((passedTotal / allResults.length) * 100).toFixed(1);

    Logger.info(`\n=======================================================`);
    Logger.info(`📊 ANDROID APPIUM MASTER E2E EXECUTION SUMMARY`);
    Logger.info(`=======================================================`);
    Logger.info(`⏱️  Total Duration   : ${durationSec} seconds`);
    Logger.info(`📋  Total Executed   : ${allResults.length} Test Cases`);
    Logger.info(`✅  Passed          : ${passedTotal}`);
    Logger.info(`❌  Failed          : ${failedTotal}`);
    Logger.info(`⏸️  Skipped         : ${skippedTotal}`);
    Logger.info(`📈  Pass Percentage : ${passRate}%`);
    Logger.info(`=======================================================\n`);

    // Write execution-results.json
    const jsonPath = path.join(appiumConfig.paths.jsonDir, 'execution-results.json');
    await fs.ensureDir(appiumConfig.paths.jsonDir);
    const payload = {
        summary: {
            total: allResults.length,
            passed: passedTotal,
            failed: failedTotal,
            skipped: skippedTotal,
            blocked: 0,
            passRate: parseFloat(passRate),
            durationSec: parseFloat(durationSec),
            timestamp: new Date().toISOString(),
            device: appiumConfig.capabilities['appium:deviceName'],
            platformVersion: appiumConfig.capabilities['appium:platformVersion'],
            appPackage: appiumConfig.capabilities['appium:appPackage']
        },
        testCases: allResults
    };

    await fs.writeFile(jsonPath, JSON.stringify(payload, null, 2));
    Logger.info(`📄 Dumped JSON test results to: ${jsonPath}`);

    // Trigger report generation script
    try {
        Logger.info(`📊 Invoking Python Multi-Format Report Generator...`);
        const scriptPath = path.join(rootDir, 'scripts/generate_android_reports.py');
        execSync(`python3 "${scriptPath}"`, { stdio: 'inherit' });
        Logger.info(`✨ All Excel, HTML, JSON & Markdown reports generated successfully!`);
    } catch (reportErr) {
        Logger.warn(`Report generation script execution notice: ${reportErr.message}`);
    }

    await DriverManager.quitDriver();
}

runMasterAndroidAppiumSuite().catch(err => {
    Logger.error(`Fatal error during Master Appium Execution: ${err.stack || err.message}`);
    process.exit(1);
});
