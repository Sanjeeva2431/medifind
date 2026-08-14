// MediFind Interactive Live Delivery GPS Tracking & Canvas Map Engine

export class DeliveryTracker {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.progress = 0.45; // 0 to 1 along route
        this.animating = false;
        
        // Define route coordinates relative to canvas
        this.pharmacyPoint = { x: 60, y: 160, label: 'Apollo Pharmacy' };
        this.customerPoint = { x: 340, y: 50, label: 'Customer Location' };
        
        // Control points for curved delivery road
        this.controlPoint1 = { x: 140, y: 190 };
        this.controlPoint2 = { x: 260, y: 40 };

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.startAnimation();
    }

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.draw();
    }

    // Bezier curve calculation for realistic road movement
    getPointOnRoute(t) {
        const p0 = this.pharmacyPoint;
        const p1 = this.controlPoint1;
        const p2 = this.controlPoint2;
        const p3 = this.customerPoint;

        const cx = 3 * (p1.x - p0.x);
        const bx = 3 * (p2.x - p1.x) - cx;
        const ax = p3.x - p0.x - cx - bx;

        const cy = 3 * (p1.y - p0.y);
        const by = 3 * (p2.y - p1.y) - cy;
        const ay = p3.y - p0.y - cy - by;

        const x = (ax * Math.pow(t, 3)) + (bx * Math.pow(t, 2)) + (cx * t) + p0.x;
        const y = (ay * Math.pow(t, 3)) + (by * Math.pow(t, 2)) + (cy * t) + p0.y;

        return { x: (x / 400) * this.canvas.width, y: (y / 220) * this.canvas.height };
    }

    startAnimation() {
        this.animating = true;
        const animate = () => {
            if (!this.animating) return;
            this.progress += 0.0015;
            if (this.progress > 0.92) this.progress = 0.2;
            this.draw();
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    stopAnimation() {
        this.animating = false;
    }

    draw() {
        if (!this.ctx || !this.canvas) return;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Dark Map Background
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, width, height);

        // Draw Map Grid / Streets background
        this.ctx.strokeStyle = '#1e293b';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 30) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
        for (let y = 0; y < height; y += 30) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }

        // Draw Route Line
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#0d9488';
        this.ctx.lineWidth = 6;
        this.ctx.lineCap = 'round';

        const steps = 50;
        for (let i = 0; i <= steps; i++) {
            const pt = this.getPointOnRoute(i / steps);
            if (i === 0) this.ctx.moveTo(pt.x, pt.y);
            else this.ctx.lineTo(pt.x, pt.y);
        }
        this.ctx.stroke();

        // Draw Traveled Route Glowing Segment
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 6;
        const currentSteps = Math.floor(steps * this.progress);
        for (let i = 0; i <= currentSteps; i++) {
            const pt = this.getPointOnRoute(i / steps);
            if (i === 0) this.ctx.moveTo(pt.x, pt.y);
            else this.ctx.lineTo(pt.x, pt.y);
        }
        this.ctx.stroke();

        // Draw Pharmacy Pin (Start)
        const pStart = this.getPointOnRoute(0);
        this.drawPin(pStart.x, pStart.y, '#3b82f6', 'fa-store', 'Pharmacy');

        // Draw Customer Pin (Destination)
        const pEnd = this.getPointOnRoute(1);
        this.drawPin(pEnd.x, pEnd.y, '#ef4444', 'fa-house-user', 'Delivery Location');

        // Draw Moving Delivery Partner Vehicle Marker
        const pCurr = this.getPointOnRoute(this.progress);
        this.drawVehicleMarker(pCurr.x, pCurr.y);
    }

    drawPin(x, y, color, icon, label) {
        this.ctx.save();
        // Pulsing outer circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, 14, 0, 2 * Math.PI);
        this.ctx.fillStyle = color + '40';
        this.ctx.fill();

        // Main pin dot
        this.ctx.beginPath();
        this.ctx.arc(x, y, 8, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.stroke();

        // Label
        this.ctx.fillStyle = '#f8fafc';
        this.ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(label, x, y + 22);
        this.ctx.restore();
    }

    drawVehicleMarker(x, y) {
        this.ctx.save();

        // Glow ring around driver
        this.ctx.beginPath();
        this.ctx.arc(x, y, 18, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
        this.ctx.fill();

        // Vehicle badge
        this.ctx.beginPath();
        this.ctx.arc(x, y, 12, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#10b981';
        this.ctx.fill();
        this.ctx.lineWidth = 2.5;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.stroke();

        // Inner core
        this.ctx.beginPath();
        this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();

        // Driver title label above vehicle
        this.ctx.fillStyle = '#10b981';
        this.ctx.font = '800 11px Plus Jakarta Sans, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Rohan (Delivery Partner)', x, y - 18);

        this.ctx.restore();
    }
}
