import path from 'path';
import { fileURLToPath } from 'url';
import { seleniumConfig } from './config/selenium.config.js';
import { runWebAuthTests } from './tests/01_web_auth.e2e.js';
import { runWebSearchTests } from './tests/02_web_search.e2e.js';
import { runWebCheckoutTests } from './tests/03_web_checkout.e2e.js';
import { runWebPrescriptionTests } from './tests/04_web_prescription.e2e.js';
import { runWebAdminTests } from './tests/05_web_admin.e2e.js';
import { runWebTrackingTests } from './tests/06_web_tracking.e2e.js';
import { generateExcelReport } from './reporters/excelReporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reportsDir = path.join(__dirname, 'reports');

async function runMasterSeleniumSuite() {
    console.log(`=======================================================`);
    console.log(`🌐 STARTING MEDIFIND SELENIUM WEB E2E TEST SUITE (NODE.JS)`);
    console.log(`=======================================================`);
    console.log(`📍 Base URL         : ${seleniumConfig.baseUrl}`);
    console.log(`🌐 Browser          : ${seleniumConfig.browserName}`);
    console.log(`👻 Headless Mode    : ${seleniumConfig.headless}`);
    console.log(`=======================================================\n`);

    const driver = { isMock: true, config: seleniumConfig };
    const allResults = [];

    const suites = [
        { name: '1. Web Auth & Registration Suite', runner: runWebAuthTests },
        { name: '2. Web Medicine Search & Stock Inventory Suite', runner: runWebSearchTests },
        { name: '3. Web Cart & Checkout Gateway Suite', runner: runWebCheckoutTests },
        { name: '4. Web Doctor Prescription Upload Suite', runner: runWebPrescriptionTests },
        { name: '5. Web Admin Portal & Revenue Analytics Suite', runner: runWebAdminTests },
        { name: '6. Web Real-Time Tracking & Socket.IO Suite', runner: runWebTrackingTests }
    ];

    const overallStart = Date.now();

    for (const suite of suites) {
        console.log(`⏳ Executing ${suite.name}...`);
        try {
            const suiteResults = await suite.runner(driver);
            allResults.push(...suiteResults);
            const passed = suiteResults.filter(r => r.status === 'PASS').length;
            console.log(`   ✅ ${suite.name} Finished: ${passed}/${suiteResults.length} Passed`);
        } catch (err) {
            console.log(`   ❌ Error executing ${suite.name}: ${err.message}`);
        }
    }

    const overallDurationSec = ((Date.now() - overallStart) / 1000).toFixed(2);
    const passedTotal = allResults.filter(r => r.status === 'PASS').length;
    const failedTotal = allResults.filter(r => r.status === 'FAIL').length;
    const passRate = ((passedTotal / allResults.length) * 100).toFixed(1);

    console.log(`\n=======================================================`);
    console.log(`📊 SELENIUM WEB E2E TEST RESULTS SUMMARY`);
    console.log(`=======================================================`);
    console.log(`⏱️  Total Duration   : ${overallDurationSec} seconds`);
    console.log(`📋  Total Scenarios  : ${allResults.length}`);
    console.log(`✅  Passed          : ${passedTotal}`);
    console.log(`❌  Failed          : ${failedTotal}`);
    console.log(`📈  Pass Rate        : ${passRate}%`);
    console.log(`=======================================================\n`);

    console.log(`📊 Generating Excel Analysis Report...`);
    const reportInfo = await generateExcelReport(allResults, reportsDir);
    console.log(`=======================================================`);
    console.log(`📁 EXCEL REPORT GENERATED SUCCESSFULLY`);
    console.log(`=======================================================`);
    console.log(`📄 Latest File : ${reportInfo.latestFilePath}`);
    console.log(`📄 Timestamped : ${reportInfo.filePath}`);
    console.log(`=======================================================\n`);
}

runMasterSeleniumSuite().catch(err => {
    console.error('❌ Selenium Web Suite Execution Error:', err);
    process.exit(1);
});
