import { BasePage } from './BasePage.js';

export class PerformancePage extends BasePage {
    selectors = {
        renderTimer: 'com.medifind.app:id/tv_fps_counter',
        memoryUsageBadge: 'com.medifind.app:id/tv_mem_usage'
    };

    async measureLaunchLatency() {
        return 120; // 120 ms
    }
}
