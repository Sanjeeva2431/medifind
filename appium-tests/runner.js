import path from 'path';
import { fileURLToPath } from 'url';
import { appiumConfig } from './config/appium.config.js';
import { runAuthTests } from './tests/01_auth.e2e.js';
import { runSearchTests } from './tests/02_search.e2e.js';
import { runOrderTests } from './tests/03_order.e2e.js';
import { runPrescriptionTests } from './tests/04_prescription.e2e.js';
import { runTrackingTests } from './tests/05_tracking.e2e.js';
import { generateExcelReport } from './reporters/excelReporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reportsDir = path.join(__dirname, 'reports');

async function runMasterAppiumSuite() {
    console.log(`=======================================================`);
    console.log(`📱 STARTING MEDIFIND APPIUM MOBILE E2E TEST SUITE`);
    console.log(`=======================================================`);
    console.log(`📍 Host / Port      : ${appiumConfig.host}:${appiumConfig.port}`);
    console.log(`🤖 Platform         : ${appiumConfig.capabilities.platformName}`);
    console.log(`⚡ Automation Engine : ${appiumConfig.capabilities['appium:automationName']}`);
    console.log(`📲 Target App       : ${appiumConfig.capabilities['appium:appPackage']}`);
    console.log(`=======================================================\n`);

    const driver = { isMock: true, config: appiumConfig };
    const allResults = [];

    const suites = [
        { name: '1. Auth & Registration Suite', runner: runAuthTests },
        { name: '2. Medicine Search & Inventory Suite', runner: runSearchTests },
        { name: '3. Cart & Order Checkout Suite', runner: runOrderTests },
        { name: '4. Prescription Upload Suite', runner: runPrescriptionTests },
        { name: '5. Real-Time Tracking & GPS Suite', runner: runTrackingTests }
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
    console.log(`📊 APPIUM E2E TEST RESULTS SUMMARY`);
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

        const mdSummary = `# 📱 Appium Mobile E2E Test Execution Summary

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
    console.log(`📄 Appium Folder Report : ${reportInfo.latestFilePath}`);
    console.log(`📄 Timestamped Copy     : ${reportInfo.filePath}`);
    console.log(`📄 Global Excel Folder  : ${reportInfo.globalExcelPath}`);
    console.log(`=======================================================\n`);
}

runMasterAppiumSuite().catch(err => {
    console.error('❌ Appium Suite Execution Error:', err);
    process.exit(1);
});
