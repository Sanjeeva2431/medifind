import http from 'http';
import { URL } from 'url';

// Load Test Configuration
const TARGET_URL = process.env.TEST_URL || 'http://localhost:5000';
const CONCURRENT_USERS = parseInt(process.env.VIRTUAL_USERS || '100', 10);
const DURATION_SECONDS = parseInt(process.env.DURATION || '60', 10);

const ENDPOINTS = [
    '/api/health',
    '/api/medicines',
    '/api/pharmacies',
    '/api/admin/stats'
];

console.log(`=======================================================`);
console.log(`🚀 STARTING BASELINE / LOAD TEST`);
console.log(`=======================================================`);
console.log(`📍 Target Server  : ${TARGET_URL}`);
console.log(`👥 Concurrent VUs  : ${CONCURRENT_USERS} virtual users`);
console.log(`⏱️ Duration        : ${DURATION_SECONDS} seconds (${Math.round(DURATION_SECONDS / 60)} minute)`);
console.log(`🎯 Endpoints      : ${ENDPOINTS.join(', ')}`);
console.log(`=======================================================\n`);

const parsedUrl = new URL(TARGET_URL);
const agent = new http.Agent({
    keepAlive: true,
    maxSockets: CONCURRENT_USERS,
    maxFreeSockets: CONCURRENT_USERS
});

const responseTimes = [];
let totalRequests = 0;
let failedRequests = 0;
const statusCodes = {};
let isRunning = true;
let startTime = Date.now();

// Helper to make a single request
function makeRequest(endpoint) {
    return new Promise((resolve) => {
        const reqStart = process.hrtime.bigint();
        
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: endpoint,
            method: 'GET',
            agent: agent,
            headers: {
                'Connection': 'keep-alive',
                'User-Agent': 'MediFind-LoadTester/1.0'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                const reqEnd = process.hrtime.bigint();
                const durationMs = Number(reqEnd - reqStart) / 1e6; // nanoseconds to ms

                totalRequests++;
                responseTimes.push(durationMs);
                statusCodes[res.statusCode] = (statusCodes[res.statusCode] || 0) + 1;
                resolve();
            });
        });

        req.on('error', (err) => {
            failedRequests++;
            resolve();
        });

        req.setTimeout(5000, () => {
            req.destroy();
            failedRequests++;
            resolve();
        });

        req.end();
    });
}

// Virtual User Worker Loop
async function virtualUserWorker(userId) {
    let endpointIdx = userId % ENDPOINTS.length;
    while (isRunning) {
        const endpoint = ENDPOINTS[endpointIdx % ENDPOINTS.length];
        endpointIdx++;
        await makeRequest(endpoint);
    }
}

// Start workers
const workers = [];
for (let i = 0; i < CONCURRENT_USERS; i++) {
    workers.push(virtualUserWorker(i));
}

// Interval log for progress
const progressInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const rps = elapsed > 0 ? (totalRequests / elapsed).toFixed(1) : 0;
    process.stdout.write(`\r⏳ Running load test... [${elapsed}/${DURATION_SECONDS}s] | Total Req: ${totalRequests} | Current RPS: ${rps} req/sec`);
}, 1000);

// Stop after DURATION_SECONDS
setTimeout(() => {
    isRunning = false;
    clearInterval(progressInterval);
    process.stdout.write('\n\n');
    printResults();
}, DURATION_SECONDS * 1000);

function printResults() {
    const totalTimeSec = (Date.now() - startTime) / 1000;
    const avgRps = (totalRequests / totalTimeSec).toFixed(2);

    if (responseTimes.length === 0) {
        console.log(`❌ No successful requests recorded. Please ensure the target server is active at ${TARGET_URL}`);
        return;
    }

    responseTimes.sort((a, b) => a - b);

    const min = responseTimes[0].toFixed(2);
    const max = responseTimes[responseTimes.length - 1].toFixed(2);
    const sum = responseTimes.reduce((acc, val) => acc + val, 0);
    const avg = (sum / responseTimes.length).toFixed(2);

    const getPercentile = (p) => {
        const idx = Math.floor((p / 100) * responseTimes.length);
        return responseTimes[Math.min(idx, responseTimes.length - 1)].toFixed(2);
    };

    const p50 = getPercentile(50);
    const p90 = getPercentile(90);
    const p99 = getPercentile(99);

    console.log(`=======================================================`);
    console.log(`📊 LOAD TEST RESULTS SUMMARY`);
    console.log(`=======================================================`);
    console.log(`⏱️  Total Duration     : ${totalTimeSec.toFixed(2)} seconds`);
    console.log(`👥  Virtual Users      : ${CONCURRENT_USERS}`);
    console.log(`📨  Total Requests     : ${totalRequests}`);
    console.log(`❌  Failed Requests    : ${failedRequests}`);
    console.log(`⚡  Requests/sec (RPS) : ${avgRps} req/sec`);
    console.log(`-------------------------------------------------------`);
    console.log(`⏱️  RESPONSE TIMES (Latency)`);
    console.log(`-------------------------------------------------------`);
    console.log(`   • Minimum (Fastest) : ${min} ms`);
    console.log(`   • Average           : ${avg} ms`);
    console.log(`   • 50th Percentile   : ${p50} ms`);
    console.log(`   • 90th Percentile   : ${p90} ms`);
    console.log(`   • 99th Percentile   : ${p99} ms`);
    console.log(`   • Maximum (Slowest) : ${max} ms (${(max / 1000).toFixed(2)}s)`);
    console.log(`-------------------------------------------------------`);
    console.log(`🔢  HTTP STATUS CODES BREAKDOWN`);
    console.log(`-------------------------------------------------------`);
    for (const [code, count] of Object.entries(statusCodes)) {
        console.log(`   • Status ${code}        : ${count} requests`);
    }
    console.log(`=======================================================\n`);
}
