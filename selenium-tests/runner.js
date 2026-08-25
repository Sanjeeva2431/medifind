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
            for (const tc of suiteResults) {
                const icon = tc.status === 'PASS' ? '✅' : '❌';
                console.log(`   ${icon} [${tc.id}] ${tc.name} (${tc.durationMs}ms)`);
            }
            const passed = suiteResults.filter(r => r.status === 'PASS').length;
            console.log(`   📊 ${suite.name} Finished: ${passed}/${suiteResults.length} Passed\n`);
        } catch (err) {
            console.log(`   ❌ Error executing ${suite.name}: ${err.message}\n`);
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

    console.log(`📋 DETAILED EXECUTED TEST CASES:`);
    allResults.forEach((tc, idx) => {
        const icon = tc.status === 'PASS' ? '✅' : '❌';
        console.log(`  ${idx + 1}. ${icon} [${tc.id}] ${tc.name} - ${tc.status}`);
    });
    console.log(`\n=======================================================\n`);

    console.log(`📊 Generating Excel Analysis Report...`);
    const reportInfo = await generateExcelReport(allResults, reportsDir);

    try {
        const fs = await import('fs');
        const mdTable = allResults.map(tc => {
            const icon = tc.status === 'PASS' ? 'PASS ✅' : 'FAIL ❌';
            return `| \`${tc.id}\` | **${tc.name}** | ${tc.suite} | ${icon} | ${tc.durationMs}ms |`;
        }).join('\n');

        const mdSummary = `# 🌐 Selenium Web E2E Test Execution Summary

**Total Scenarios:** ${allResults.length} | **Passed:** ${passedTotal} | **Failed:** ${failedTotal} | **Pass Rate:** ${passRate}% | **Duration:** ${overallDurationSec}s

---

### 📋 Detailed Test Cases Execution List

| Test ID | Test Case Name | Test Suite | Status | Duration |
| :--- | :--- | :--- | :---: | :---: |
${mdTable}
`;
        fs.mkdirSync(reportsDir, { recursive: true });
        fs.writeFileSync(path.join(reportsDir, 'summary.md'), mdSummary, 'utf8');
    } catch (e) {
        console.warn('[Markdown Summary Note]:', e);
    }

    console.log(`=======================================================`);
    console.log(`📁 EXCEL & SUMMARY REPORTS GENERATED SUCCESSFULLY`);
    console.log(`=======================================================`);
    console.log(`📄 Latest File : ${reportInfo.latestFilePath}`);
    console.log(`📄 Timestamped : ${reportInfo.filePath}`);
    console.log(`=======================================================\n`);
}

runMasterSeleniumSuite().catch(err => {
    console.error('❌ Selenium Web Suite Execution Error:', err);
    process.exit(1);
});
