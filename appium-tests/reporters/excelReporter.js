import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Excel Reporter: Generates structured, styled .xlsx analysis spreadsheets for Appium E2E executions.
 */
export async function generateExcelReport(results, outputDir) {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'MediFind Appium Automation Engine';
    workbook.lastModifiedBy = 'MediFind E2E Runner';
    workbook.created = new Date();

    const passedCount = results.filter(r => r.status === 'PASS').length;
    const failedCount = results.filter(r => r.status === 'FAIL').length;
    const totalCount = results.length;
    const passRate = totalCount > 0 ? ((passedCount / totalCount) * 100).toFixed(1) : '0.0';
    const totalDurationMs = results.reduce((sum, r) => sum + r.durationMs, 0);

    // ==========================================
    // SHEET 1: DASHBOARD SUMMARY
    // ==========================================
    const summarySheet = workbook.addWorksheet('Execution Dashboard', {
        views: [{ showGridLines: true }]
    });

    summarySheet.columns = [
        { header: 'Metric Key', key: 'key', width: 32 },
        { header: 'Metric Value', key: 'value', width: 40 }
    ];

    // Header Title Row
    summarySheet.mergeCells('A1:B1');
    const titleCell = summarySheet.getCell('A1');
    titleCell.value = '📱 MediFind Android Mobile E2E Test Execution Summary';
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A8A' } }; // Dark Navy
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    summarySheet.getRow(1).height = 40;

    // Subtitle / Date Row
    summarySheet.mergeCells('A2:B2');
    const subtitleCell = summarySheet.getCell('A2');
    subtitleCell.value = `Generated On: ${new Date().toLocaleString()} | Environment: Android Emulator / UiAutomator2`;
    subtitleCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: '475569' } };
    subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    summarySheet.getRow(2).height = 20;

    summarySheet.addRow([]); // Blank line

    const metricsData = [
        ['Total Test Cases Executed', totalCount],
        ['Passed Test Cases', passedCount],
        ['Failed Test Cases', failedCount],
        ['Overall Pass Rate (%)', `${passRate}%`],
        ['Total Execution Duration', `${(totalDurationMs / 1000).toFixed(2)} seconds`],
        ['Overall Test Suite Status', failedCount === 0 ? 'PASSED ✅' : 'FAILED ❌']
    ];

    metricsData.forEach(([k, v]) => {
        const row = summarySheet.addRow([k, v]);
        row.height = 24;

        const kCell = row.getCell(1);
        const vCell = row.getCell(2);

        kCell.font = { name: 'Arial', size: 11, bold: true, color: { argb: '1F2937' } };
        vCell.font = { name: 'Arial', size: 11, bold: true, color: { argb: '1F2937' } };

        kCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F1F5F9' } };

        // Highlight overall status
        if (k === 'Overall Test Suite Status') {
            vCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: failedCount === 0 ? 'DCFCE7' : 'FEE2E2' }
            };
            vCell.font = {
                name: 'Arial',
                size: 12,
                bold: true,
                color: { argb: failedCount === 0 ? '166534' : '991B1B' }
            };
        } else if (k === 'Passed Test Cases') {
            vCell.font = { name: 'Arial', size: 11, bold: true, color: { argb: '15803D' } };
        } else if (k === 'Failed Test Cases' && failedCount > 0) {
            vCell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'DC2626' } };
        }

        row.eachCell(cell => {
            cell.border = {
                top: { style: 'thin', color: { argb: 'CBD5E1' } },
                left: { style: 'thin', color: { argb: 'CBD5E1' } },
                bottom: { style: 'thin', color: { argb: 'CBD5E1' } },
                right: { style: 'thin', color: { argb: 'CBD5E1' } }
            };
        });
    });

    // ==========================================
    // SHEET 2: DETAILED TEST RESULTS
    // ==========================================
    const detailSheet = workbook.addWorksheet('Detailed Test Results', {
        views: [{ showGridLines: true }]
    });

    detailSheet.columns = [
        { header: 'Test Case ID', key: 'id', width: 16 },
        { header: 'Module / Suite', key: 'suite', width: 32 },
        { header: 'Test Scenario Name', key: 'name', width: 45 },
        { header: 'Description', key: 'description', width: 50 },
        { header: 'Status', key: 'status', width: 14 },
        { header: 'Duration (ms)', key: 'duration', width: 16 },
        { header: 'Error Traceback', key: 'error', width: 40 }
    ];

    // Format Header Row
    const headerRow = detailSheet.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell(cell => {
        cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0F172A' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Add Data Rows
    results.forEach(res => {
        const row = detailSheet.addRow([
            res.id,
            res.suite,
            res.name,
            res.description,
            res.status,
            res.durationMs,
            res.error || 'N/A'
        ]);

        row.height = 22;

        const statusCell = row.getCell(5);
        statusCell.alignment = { horizontal: 'center' };

        if (res.status === 'PASS') {
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCFCE7' } };
            statusCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: '166534' } };
        } else {
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } };
            statusCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: '991B1B' } };
        }

        row.eachCell(cell => {
            cell.border = {
                top: { style: 'thin', color: { argb: 'E2E8F0' } },
                left: { style: 'thin', color: { argb: 'E2E8F0' } },
                bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
                right: { style: 'thin', color: { argb: 'E2E8F0' } }
            };
        });
    });

    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const fileName = `MediFind_Mobile_E2E_Report_${timestampStr}.xlsx`;
    const filePath = path.join(outputDir, fileName);
    const latestFilePath = path.join(outputDir, 'MediFind_Mobile_E2E_Report.xlsx');

    const globalExcelDir = path.join(__dirname, '..', '..', 'Test Results', 'Excel');
    if (!fs.existsSync(globalExcelDir)) {
        fs.mkdirSync(globalExcelDir, { recursive: true });
    }
    const globalExcelPath = path.join(globalExcelDir, 'MediFind_Mobile_E2E_Report.xlsx');

    await workbook.xlsx.writeFile(filePath);
    await workbook.xlsx.writeFile(latestFilePath);
    await workbook.xlsx.writeFile(globalExcelPath);

    return { filePath, latestFilePath, globalExcelPath, fileName };
}
