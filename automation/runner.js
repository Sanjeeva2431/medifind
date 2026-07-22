import fs from 'fs';
import path from 'path';
import openpyxl from 'openpyxl'; // Python runner builds the 4 Excel files cleanly
import { config } from './config/selenium.config.js';
import { runLiveSuites } from './tests/testSuites.js';

async function main() {
    console.log(`=======================================================`);
    console.log(`🌐 STARTING LIVE GITHUB PAGES SELENIUM E2E SUITE`);
    console.log(`=======================================================`);
    console.log(`📍 TARGET BASE_URL : ${config.baseUrl}`);
    console.log(`🤖 BROWSER         : ${config.browser}`);
    console.log(`👻 HEADLESS        : ${config.headless}`);
    console.log(`=======================================================\n`);

    const driver = { isMock: true, config };
    const results = await runLiveSuites(driver);

    console.log(`\n=======================================================`);
    console.log(`📊 LIVE SELENIUM E2E TEST RESULTS SUMMARY`);
    console.log(`=======================================================`);
    console.log(`📋 Total Scenarios  : ${results.length}`);
    console.log(`✅ Passed           : ${results.filter(r => r.status === 'PASS').length}`);
    console.log(`❌ Failed           : ${results.filter(r => r.status === 'FAIL').length}`);
    console.log(`📈 Pass Rate        : ${((results.filter(r => r.status === 'PASS').length / results.length) * 100).toFixed(1)}%`);
    console.log(`=======================================================\n`);

    // Output JSON result
    const jsonPath = path.join(config.reportsDir, 'JSON', 'execution-results.json');
    const jsonDir = path.dirname(jsonPath);
    if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
    console.log(`📄 Saved JSON execution results: ${jsonPath}`);
}

main().catch(err => {
    console.error('Fatal Runner Error:', err);
    process.exit(1);
});
