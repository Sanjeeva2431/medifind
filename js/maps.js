import { MOCK_PHARMACIES } from './data.js';

export class GoogleMapsService {
    constructor() {
        const savedLoc = localStorage.getItem('medifind_user_location');
        this.currentLocation = savedLoc ? JSON.parse(savedLoc) : { lat: 28.5355, lng: 77.3910, label: 'Sector 18, Noida', isLiveGps: false };
        this.customerDefaultLoc = this.currentLocation;
        this.updateSyncPharmacyDistances(this.currentLocation.lat, this.currentLocation.lng);
        this.updatePharmacyDistances(this.currentLocation.lat, this.currentLocation.lng);
    }

    getUserLocation() {
        return this.currentLocation;
    }

    // 1. Request Browser Location Permission via HTML5 Geolocation API
    async requestBrowserLocation() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve({ success: false, message: 'Geolocation is not supported by your browser.' });
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = parseFloat(position.coords.latitude.toFixed(4));
                    const lng = parseFloat(position.coords.longitude.toFixed(4));

                    let addressLabel = `Live GPS (${lat}, ${lng})`;

                    // Reverse geocoding lookup for human-readable city & area name
                    try {
                        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                        if (geoRes.ok) {
                            const geoData = await geoRes.json();
                            if (geoData && geoData.address) {
                                const area = geoData.address.suburb || geoData.address.neighbourhood || geoData.address.residential || geoData.address.city_district || geoData.address.town || geoData.address.city || 'Your Area';
                                const city = geoData.address.city || geoData.address.state_district || geoData.address.state || '';
                                addressLabel = `${area}${city ? ', ' + city : ''}`;
                            }
                        }
                    } catch (e) {
                        console.warn('[Maps API] Geocoding fallback:', e);
                    }

                    this.currentLocation = {
                        lat,
                        lng,
                        label: addressLabel,
                        isLiveGps: true
                    };
                    this.customerDefaultLoc = this.currentLocation;
                    localStorage.setItem('medifind_user_location', JSON.stringify(this.currentLocation));
                    this.updateSyncPharmacyDistances(lat, lng);
                    this.updatePharmacyDistances(lat, lng);
                    resolve({ success: true, location: this.currentLocation, message: `📍 Located: ${addressLabel}! Nearby pharmacies updated.` });
                },
                (error) => {
                    let errMsg = 'Location permission denied.';
                    if (error.code === error.POSITION_UNAVAILABLE) errMsg = 'Location information unavailable.';
                    if (error.code === error.TIMEOUT) errMsg = 'Location request timed out.';
                    resolve({ success: false, message: errMsg });
                },
                { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
            );
        });
    }

    // 2. Set Manual City / Address Location
    setManualLocation(addressLabel, lat = 28.5355, lng = 77.3910) {
        this.currentLocation = {
            lat,
            lng,
            label: addressLabel,
            isLiveGps: false
        };
        this.customerDefaultLoc = this.currentLocation;
        localStorage.setItem('medifind_user_location', JSON.stringify(this.currentLocation));
        this.updateSyncPharmacyDistances(lat, lng);
        this.updatePharmacyDistances(lat, lng);
        return this.currentLocation;
    }

    // 3A. Instant Synchronous Pharmacy Localization around User Coordinates
    updateSyncPharmacyDistances(userLat, userLng, pharmacies = []) {
        const targetList = pharmacies.length > 0 ? pharmacies : MOCK_PHARMACIES;
        const currentLocLabel = this.currentLocation ? (this.currentLocation.label || 'Your Area') : 'Your Area';

        let areaName = currentLocLabel.split(',')[0].replace(/Live GPS \([^)]+\)/gi, 'Your Area').trim() || 'Your Area';
        if (areaName === 'Sector 18' || areaName === 'Local Area') areaName = 'Nearby Area';

        const localOffsets = [
            { dLat:  0.0035, dLng:  0.0042, dist: 0.4 }, // ~0.4 km
            { dLat: -0.0051, dLng:  0.0063, dist: 0.8 }, // ~0.8 km
            { dLat:  0.0078, dLng: -0.0071, dist: 1.2 }, // ~1.2 km
            { dLat: -0.0102, dLng: -0.0089, dist: 1.6 }, // ~1.6 km
            { dLat:  0.0135, dLng:  0.0124, dist: 2.1 }, // ~2.1 km
            { dLat: -0.0168, dLng:  0.0155, dist: 2.7 }, // ~2.7 km
            { dLat:  0.0210, dLng: -0.0182, dist: 3.4 }, // ~3.4 km
            { dLat: -0.0255, dLng: -0.0221, dist: 4.1 }, // ~4.1 km
            { dLat:  0.0310, dLng:  0.0285, dist: 4.9 }, // ~4.9 km
            { dLat: -0.0380, dLng:  0.0340, dist: 5.8 }  // ~5.8 km
        ];

        const defaultNames = [
            'Apollo Pharmacy 24/7',
            'MedPlus Superstore',
            'Wellness Forever Chemist',
            'Sanjeevani Emergency Pharmacy',
            'NetMeds Local Depot',
            'Guardian Lifecare',
            'Health & Glow Pharmacy',
            'Trust Chemist & Druggist',
            'Pulse 24/7 Express Pharma',
            'Noble Plus Chemist'
        ];

        targetList.forEach((p, idx) => {
            const offset = localOffsets[idx % localOffsets.length];
            p.lat = userLat + offset.dLat;
            p.lng = userLng + offset.dLng;

            const baseName = defaultNames[idx % defaultNames.length];
            p.shop_name = `${baseName} (${areaName})`;
            p.address = `Plot ${12 + idx * 4}, Block ${String.fromCharCode(65 + (idx % 5))}, ${areaName}`;
            p.distance = `${offset.dist} km`;

            const times = this.calculateTravelTime(offset.dist);
            p.delivery_time = times.deliveryTime;
        });

        targetList.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }

    // 3B. Asynchronous Real-Time OpenStreetMap Pharmacy Fetch
    async updatePharmacyDistances(userLat, userLng, pharmacies = []) {
        this.updateSyncPharmacyDistances(userLat, userLng, pharmacies);

        try {
            const targetList = pharmacies.length > 0 ? pharmacies : MOCK_PHARMACIES;
            const currentLocLabel = this.currentLocation ? (this.currentLocation.label || 'Your Area') : 'Your Area';
            let areaName = currentLocLabel.split(',')[0].replace(/Live GPS \([^)]+\)/gi, 'Your Area').trim() || 'Your Area';

            const overpassQuery = `[out:json];node(around:5000,${userLat},${userLng})["amenity"="pharmacy"];out 10;`;
            const overpassRes = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
            if (overpassRes.ok) {
                const data = await overpassRes.json();
                if (data && data.elements && data.elements.length > 0) {
                    const realOsm = data.elements.filter(el => el.tags && el.tags.name);
                    if (realOsm.length > 0) {
                        targetList.forEach((p, idx) => {
                            if (realOsm[idx] && realOsm[idx].tags) {
                                const tags = realOsm[idx].tags;
                                p.shop_name = tags.name || p.shop_name;
                                p.address = tags['addr:street'] ? `${tags['addr:street']}, ${areaName}` : p.address;
                            }
                        });
                        if (window.MediApp) window.MediApp.render();
                    }
                }
            }
        } catch (e) {
            console.warn('[Maps API] OSM fetch skipped:', e);
        }
    }

    // 4. Haversine Formula for Accurate Distance Calculation (in Km)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return parseFloat(distance.toFixed(1));
    }

    // 5. Estimated Travel & Delivery Time Calculator
    calculateTravelTime(distanceKm) {
        const travelMinutes = Math.round((distanceKm / 20) * 60);
        const totalDeliveryMins = travelMinutes + 5;
        return {
            driveTime: `${Math.max(2, travelMinutes)} mins drive`,
            deliveryTime: `${Math.max(10, totalDeliveryMins)}-${totalDeliveryMins + 5} mins delivery`
        };
    }

    // 3. AUTOMATICALLY CHOOSE NEAREST PHARMACY WITH STOCK
    findNearestPharmacyWithStock(medId, customerLat = 28.5355, customerLng = 77.3910, medicines = [], pharmacies = []) {
        const inStockMeds = medicines.filter(m => (m.id === medId || m.name.toLowerCase().includes(medId.toLowerCase())) && m.stock > 0);
        if (inStockMeds.length === 0) return null;

        const candidatePharmIds = inStockMeds.map(m => m.pharmacy_id);
        let nearestPharm = null;
        let minDistance = Infinity;

        pharmacies.forEach(p => {
            if (candidatePharmIds.includes(p.id) && p.status === 'open') {
                const dist = parseFloat(p.distance) || 1.0;
                if (dist < minDistance) {
                    minDistance = dist;
                    const times = this.calculateTravelTime(dist);
                    nearestPharm = {
                        ...p,
                        calculated_distance: `${dist} km`,
                        calculated_drive_time: times.driveTime,
                        calculated_delivery_time: times.deliveryTime
                    };
                }
            }
        });

        return nearestPharm || pharmacies[0];
    }

    // 4. Render Google Maps Interactive Canvas with Directions Polyline & Markers
    renderMapCanvas(canvasId, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.parentElement?.clientWidth || 400;
        const height = canvas.height = canvas.parentElement?.clientHeight || 200;

        const {
            pharmacies = [],
            customerLoc = this.customerDefaultLoc,
            driverLoc = null,
            showDirections = true
        } = options;

        // Dark Styled Map Background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);

        // Map Grid / Street Lines
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Customer Location Pin (Right)
        const endPt = { x: width * 0.75, y: height * 0.45 };
        // Nearby Pharmacy Cluster Pins (Immediately adjacent to customer pin)
        const startPt = { x: width * 0.25, y: height * 0.55 };

        // Draw Directions Route Polyline
        if (showDirections) {
            ctx.beginPath();
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.moveTo(startPt.x, startPt.y);
            ctx.lineTo(endPt.x, endPt.y);
            ctx.stroke();

            ctx.fillStyle = '#38bdf8';
            ctx.font = '700 10px Plus Jakarta Sans, sans-serif';
            ctx.fillText('⚡ 0.4 km Delivery Route (Live GPS)', (startPt.x + endPt.x) / 2, (startPt.y + endPt.y) / 2 - 10);
        }

        // Draw Customer Location Marker
        this.drawMarker(ctx, endPt.x, endPt.y, '#ef4444', 'fa-house-user', customerLoc.label || 'Your GPS Location');

        // Draw Nearby Pharmacy Markers in tight local cluster
        pharmacies.forEach((p, idx) => {
            const px = startPt.x + (idx * 28);
            const py = startPt.y + (idx % 2 === 0 ? 15 : -15);
            this.drawMarker(ctx, px, py, '#0ea5e9', 'fa-store', `${p.shop_name} (${p.distance})`);
        });

        // Draw Live Driver Marker if active
        if (driverLoc) {
            const dx = startPt.x + (endPt.x - startPt.x) * (driverLoc.progress || 0.5);
            const dy = startPt.y + (endPt.y - startPt.y) * (driverLoc.progress || 0.5);
            this.drawMarker(ctx, dx, dy, '#22c55e', 'fa-motorcycle', 'Rohan (Driver)');
        }
    }

    drawMarker(ctx, x, y, color, iconClass, label) {
        ctx.save();
        // Pulse ring
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, 2 * Math.PI);
        ctx.fillStyle = color + '33';
        ctx.fill();

        // Pin body
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        // Text label
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y + 20);
        ctx.restore();
    }
}

export const googleMapsService = new GoogleMapsService();
