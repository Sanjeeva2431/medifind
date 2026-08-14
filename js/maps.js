import { MOCK_PHARMACIES } from './data.js';

export class GoogleMapsService {
    constructor() {
        const savedLoc = localStorage.getItem('medifind_user_location');
        this.currentLocation = savedLoc ? JSON.parse(savedLoc) : {
            lat: 13.0827,
            lng: 80.2707,
            label: 'Anna Nagar, Chennai',
            isLiveGps: false,
            accuracy: null
        };

        this.locationState = {
            status: 'idle', // 'idle' | 'detecting' | 'granted' | 'denied' | 'error'
            errorMessage: '',
            isLiveGps: this.currentLocation.isLiveGps
        };

        this.googlePharmacies = [];
        this.isSearchingGoogle = false;
        this.googleApiError = null;
        this.watchId = null;

        // Initialize Google Maps API key check
        this.initGoogleMapsApi();
    }

    async initGoogleMapsApi() {
        try {
            const res = await fetch('/api/config');
            if (res.ok) {
                const config = await res.json();
                if (config.success && config.googleMapsApiKey) {
                    this.loadGoogleMapsScript(config.googleMapsApiKey);
                }
            }
        } catch (e) {
            console.warn('[Google Maps API Config Check Failed]:', e);
        }
    }

    loadGoogleMapsScript(apiKey) {
        if (window.google && window.google.maps) return;
        if (document.getElementById('google-maps-js-sdk')) return;

        const script = document.createElement('script');
        script.id = 'google-maps-js-sdk';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.log('⚡ Google Maps JavaScript API Loaded Successfully');
            if (window.MediApp) window.MediApp.render();
        };
        document.head.appendChild(script);
    }

    getUserLocation() {
        return this.currentLocation;
    }

    getLocationState() {
        return this.locationState;
    }

    // 1. Request Browser Real GPS Location Permission with Automatic IP Geolocation Fallback
    async requestBrowserLocation() {
        this.locationState.status = 'detecting';
        this.locationState.errorMessage = '';
        if (window.MediApp) window.MediApp.render();

        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                this.fallbackToIpLocation('Geolocation is not supported by your browser. Using IP Location.').then(resolve);
                return;
            }

            let resolved = false;

            // Timeout safety fallback to IP location if GPS takes > 5 seconds
            const gpsTimeout = setTimeout(async () => {
                if (!resolved) {
                    resolved = true;
                    console.log('📍 Browser GPS timeout (5s). Falling back to IP Geolocation...');
                    const ipRes = await this.fallbackToIpLocation('GPS timeout. Located via IP address.');
                    resolve(ipRes);
                }
            }, 5000);

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    if (resolved) return;
                    resolved = true;
                    clearTimeout(gpsTimeout);

                    const lat = parseFloat(position.coords.latitude.toFixed(6));
                    const lng = parseFloat(position.coords.longitude.toFixed(6));
                    const accuracy = Math.round(position.coords.accuracy || 0);

                    let addressLabel = `Live GPS (${lat}, ${lng})`;

                    // Reverse geocoding lookup for human-readable city & area name via backend proxy
                    try {
                        const geoRes = await fetch(`/api/places/geocode?lat=${lat}&lng=${lng}`);
                        if (geoRes.ok) {
                            const geoData = await geoRes.json();
                            if (geoData && geoData.success && geoData.formatted_address) {
                                addressLabel = geoData.formatted_address;
                            }
                        }
                    } catch (e) {
                        console.warn('[Maps API] Geocoding lookup error:', e);
                    }

                    this.currentLocation = {
                        lat,
                        lng,
                        label: addressLabel,
                        isLiveGps: true,
                        accuracy
                    };

                    this.locationState = {
                        status: 'granted',
                        errorMessage: '',
                        isLiveGps: true
                    };

                    localStorage.setItem('medifind_user_location', JSON.stringify(this.currentLocation));

                    // Fetch real nearby Google Places pharmacies
                    await this.fetchNearbyPharmacies(lat, lng);

                    if (window.MediApp) window.MediApp.render();

                    resolve({
                        success: true,
                        location: this.currentLocation,
                        message: `📍 Located: ${addressLabel}! Real nearby pharmacies retrieved.`
                    });
                },
                async (error) => {
                    if (resolved) return;
                    resolved = true;
                    clearTimeout(gpsTimeout);

                    console.warn('[Browser GPS Permission Error]:', error.message);
                    const ipRes = await this.fallbackToIpLocation('Location access blocked or unavailable. City detected via IP.');
                    resolve(ipRes);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        });
    }

    // IP-Based Geolocation Fallback
    async fallbackToIpLocation(reasonMsg = 'Located via IP') {
        try {
            const ipRes = await fetch('/api/places/ip-location');
            if (ipRes.ok) {
                const ipData = await ipRes.json();
                if (ipData && ipData.success) {
                    this.currentLocation = {
                        lat: ipData.lat,
                        lng: ipData.lng,
                        label: ipData.formatted_address || `${ipData.city}, ${ipData.region}`,
                        isLiveGps: false,
                        isIpLocation: true,
                        accuracy: 1000
                    };
                    this.locationState = {
                        status: 'granted',
                        errorMessage: '',
                        isLiveGps: false,
                        isIpLocation: true
                    };
                    localStorage.setItem('medifind_user_location', JSON.stringify(this.currentLocation));

                    await this.fetchNearbyPharmacies(ipData.lat, ipData.lng);

                    if (window.MediApp) window.MediApp.render();

                    return {
                        success: true,
                        location: this.currentLocation,
                        message: `📍 City Detected via IP: ${this.currentLocation.label}`
                    };
                }
            }
        } catch (e) {
            console.warn('[IP Location Fallback Error]:', e);
        }

        // Default Fallback
        this.currentLocation = {
            lat: 13.0827,
            lng: 80.2707,
            label: 'Anna Nagar, Chennai',
            isLiveGps: false,
            accuracy: null
        };
        this.locationState = { status: 'granted', errorMessage: '', isLiveGps: false };
        localStorage.setItem('medifind_user_location', JSON.stringify(this.currentLocation));
        if (window.MediApp) window.MediApp.render();

        return { success: true, location: this.currentLocation, message: '📍 Default City Set: Anna Nagar, Chennai' };
    }

    // 2. Set Manual City / Address Location
    async setManualLocation(addressLabel, lat = 13.0827, lng = 80.2707) {
        let finalLat = lat;
        let finalLng = lng;
        let finalLabel = addressLabel;

        // Try forward geocoding if only address label is provided
        if (addressLabel && (!lat || lat === 13.0827)) {
            try {
                const geoRes = await fetch(`/api/places/geocode?address=${encodeURIComponent(addressLabel)}`);
                if (geoRes.ok) {
                    const geoData = await geoRes.json();
                    if (geoData && geoData.success && geoData.lat) {
                        finalLat = geoData.lat;
                        finalLng = geoData.lng;
                        finalLabel = geoData.formatted_address || addressLabel;
                    }
                }
            } catch (e) {
                console.warn('[Manual Geocode Error]:', e);
            }
        }

        this.currentLocation = {
            lat: finalLat,
            lng: finalLng,
            label: finalLabel,
            isLiveGps: false,
            accuracy: null
        };

        this.locationState = {
            status: 'granted',
            errorMessage: '',
            isLiveGps: false
        };

        localStorage.setItem('medifind_user_location', JSON.stringify(this.currentLocation));

        // Fetch Google Places for manually selected location
        await this.fetchNearbyPharmacies(finalLat, finalLng);

        if (window.MediApp) window.MediApp.render();
        return this.currentLocation;
    }

    // 3. Real Nearby Pharmacy Search via Google Places API Proxy
    async fetchNearbyPharmacies(lat, lng) {
        this.isSearchingGoogle = true;
        this.googleApiError = null;

        try {
            const res = await fetch(`/api/places/nearby?lat=${lat}&lng=${lng}&radius=5000`);
            const data = await res.json();

            if (res.ok && data.success && Array.isArray(data.pharmacies)) {
                this.googlePharmacies = data.pharmacies.map(p => {
                    const distKm = this.calculateDistance(lat, lng, p.lat, p.lng);
                    const formattedDist = this.formatDistance(distKm);
                    const times = this.calculateTravelTime(distKm);

                    return {
                        id: `gplace_${p.place_id}`,
                        place_id: p.place_id,
                        shop_name: p.name,
                        address: p.address,
                        lat: p.lat,
                        lng: p.lng,
                        rating: p.rating || 4.5,
                        reviews_count: p.user_ratings_total || 12,
                        status: p.open_now === false ? 'closed' : 'open',
                        open_now: p.open_now,
                        distance_km: distKm,
                        distance: formattedDist,
                        phone: p.phone || null,
                        delivery_time: times.deliveryTime,
                        delivery_available: true,
                        isGooglePlace: true,
                        logo: p.icon || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=80'
                    };
                });

                // Sort closest to farthest
                this.googlePharmacies.sort((a, b) => a.distance_km - b.distance_km);

                // Fetch details for top 3 pharmacies to get phone number if available
                this.enrichTopPlacesDetails();
            } else {
                this.googlePharmacies = [];
                this.googleApiError = data.message || null;
            }
        } catch (error) {
            console.error('[Google Nearby Fetch Error]:', error);
            this.googlePharmacies = [];
            this.googleApiError = null;
        } finally {
            this.isSearchingGoogle = false;
        }
    }

    async enrichTopPlacesDetails() {
        const top3 = this.googlePharmacies.slice(0, 3);
        for (const p of top3) {
            if (!p.phone && p.place_id) {
                try {
                    const res = await fetch(`/api/places/details?place_id=${p.place_id}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.success && data.details) {
                            p.phone = data.details.formatted_phone_number || data.details.international_phone_number || null;
                            if (data.details.opening_hours) {
                                p.opening_hours_text = data.details.opening_hours.weekday_text;
                            }
                        }
                    }
                } catch (e) {
                    // Ignore background enrichment error
                }
            }
        }
    }

    // Dynamic Pharmacy Catalog Localized strictly around User Coordinates
    getPharmacies() {
        const userLat = this.currentLocation.lat;
        const userLng = this.currentLocation.lng;

        const currentArea = (this.currentLocation.label || 'Your Area').split(',')[0].replace(/Live GPS \([^)]+\)/gi, 'Your Area').trim() || 'Your Area';
        const currentCity = (this.currentLocation.label || '').split(',')[1] || '';

        const localOffsets = [
            { dLat:  0.0035, dLng:  0.0042 }, // ~0.45 km
            { dLat: -0.0051, dLng:  0.0063 }, // ~0.85 km
            { dLat:  0.0078, dLng: -0.0071 }, // ~1.2 km
            { dLat: -0.0102, dLng: -0.0089 }, // ~1.6 km
            { dLat:  0.0135, dLng:  0.0124 }, // ~2.1 km
            { dLat: -0.0168, dLng:  0.0155 }, // ~2.7 km
            { dLat:  0.0210, dLng: -0.0182 }, // ~3.4 km
            { dLat: -0.0255, dLng: -0.0221 }  // ~4.1 km
        ];

        const baseNames = [
            'Apollo Pharmacy 24/7',
            'MedPlus Superstore',
            'Wellness Forever Chemist',
            'Sanjeevani Emergency Pharmacy',
            'NetMeds Local Depot',
            'Guardian Lifecare',
            'Health & Glow Pharmacy',
            'Trust Chemist & Druggist'
        ];

        const localizedMockPharmacies = MOCK_PHARMACIES.map((p, idx) => {
            const offset = localOffsets[idx % localOffsets.length];
            const pLat = userLat + offset.dLat;
            const pLng = userLng + offset.dLng;
            const baseName = baseNames[idx % baseNames.length];

            const shopName = `${baseName} (${currentArea})`;
            const address = `Plot ${12 + idx * 4}, Block ${String.fromCharCode(65 + (idx % 5))}, ${currentArea}${currentCity ? ', ' + currentCity : ''}`;

            const distKm = this.calculateDistance(userLat, userLng, pLat, pLng);
            const formattedDist = this.formatDistance(distKm);
            const times = this.calculateTravelTime(distKm);

            return {
                ...p,
                lat: pLat,
                lng: pLng,
                shop_name: shopName,
                address: address,
                distance_km: distKm,
                distance: formattedDist,
                delivery_time: times.deliveryTime
            };
        });

        if (this.googlePharmacies && this.googlePharmacies.length > 0) {
            const googleIds = new Set(this.googlePharmacies.map(g => g.place_id));
            const merged = [...this.googlePharmacies];
            localizedMockPharmacies.forEach(p => {
                if (!googleIds.has(p.place_id)) {
                    merged.push(p);
                }
            });
            merged.sort((a, b) => (a.distance_km || 99) - (b.distance_km || 99));
            return merged;
        }

        return localizedMockPharmacies.sort((a, b) => a.distance_km - b.distance_km);
    }

    // 4. Haversine Formula for Accurate Distance Calculation (in Km)
    calculateDistance(lat1, lon1, lat2, lon2) {
        if (!lat1 || !lon1 || !lat2 || !lon2) return 1.0;
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return parseFloat(distance.toFixed(2));
    }

    // Format distance: "850 m" if < 1.0 km, "1.2 km" if >= 1.0 km
    formatDistance(distKm) {
        if (distKm < 1.0) {
            const meters = Math.round(distKm * 1000);
            return `${meters} m`;
        }
        return `${distKm.toFixed(1)} km`;
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

    // 6. Generate Real Google Maps Directions URL
    getDirectionsUrl(pharmacy) {
        const origin = `${this.currentLocation.lat},${this.currentLocation.lng}`;
        const destinationName = encodeURIComponent(`${pharmacy.shop_name} ${pharmacy.address}`);
        let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destinationName}`;
        if (pharmacy.place_id) {
            url += `&destination_place_id=${pharmacy.place_id}`;
        }
        return url;
    }

    // 7. Enable Watch Position for Real-Time Movement Updates
    startWatchPosition() {
        if (this.watchId || !navigator.geolocation) return;

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const newLat = parseFloat(position.coords.latitude.toFixed(6));
                const newLng = parseFloat(position.coords.longitude.toFixed(6));

                // Calculate distance moved from last known location
                const distMoved = this.calculateDistance(this.currentLocation.lat, this.currentLocation.lng, newLat, newLng);

                // Only refresh if user moved > 100 meters (0.1 km)
                if (distMoved > 0.1) {
                    console.log(`📍 Significant location change detected (${(distMoved * 1000).toFixed(0)}m moved). Updating pharmacies...`);
                    this.currentLocation.lat = newLat;
                    this.currentLocation.lng = newLng;
                    this.currentLocation.accuracy = Math.round(position.coords.accuracy || 0);
                    localStorage.setItem('medifind_user_location', JSON.stringify(this.currentLocation));

                    this.fetchNearbyPharmacies(newLat, newLng).then(() => {
                        if (window.MediApp) window.MediApp.render();
                    });
                }
            },
            (err) => console.warn('[WatchPosition Error]:', err.message),
            { enableHighAccuracy: true, maximumAge: 10000 }
        );
    }

    stopWatchPosition() {
        if (this.watchId && navigator.geolocation) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    // 8. Render Google Map Canvas / SDK Map
    renderMapCanvas(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const pharmacies = options.pharmacies || this.getPharmacies();
        const userLoc = this.currentLocation;

        // If Google Maps JavaScript API is available, render real Interactive Google Map
        if (window.google && window.google.maps) {
            container.innerHTML = `<div id="${containerId}_gmap" style="width:100%; height:100%; min-height:220px; border-radius:var(--radius-md);"></div>`;
            const mapElement = document.getElementById(`${containerId}_gmap`);
            if (mapElement) {
                const map = new google.maps.Map(mapElement, {
                    center: { lat: userLoc.lat, lng: userLoc.lng },
                    zoom: 14,
                    disableDefaultUI: false,
                    zoomControl: true,
                    styles: [
                        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                        {
                            featureType: "administrative.locality",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }]
                        },
                        {
                            featureType: "poi",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#d59563" }]
                        },
                        {
                            featureType: "poi.park",
                            elementType: "geometry",
                            stylers: [{ color: "#263c3f" }]
                        },
                        {
                            featureType: "poi.park",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#6b9a76" }]
                        },
                        {
                            featureType: "road",
                            elementType: "geometry",
                            stylers: [{ color: "#38414e" }]
                        },
                        {
                            featureType: "road",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#212a37" }]
                        },
                        {
                            featureType: "road",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#9ca5b3" }]
                        },
                        {
                            featureType: "road.highway",
                            elementType: "geometry",
                            stylers: [{ color: "#746855" }]
                        },
                        {
                            featureType: "road.highway",
                            elementType: "geometry.stroke",
                            stylers: [{ color: "#1f2835" }]
                        },
                        {
                            featureType: "road.highway",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#f3d19c" }]
                        },
                        {
                            featureType: "water",
                            elementType: "geometry",
                            stylers: [{ color: "#17263c" }]
                        },
                        {
                            featureType: "water",
                            elementType: "labels.text.fill",
                            stylers: [{ color: "#515c6d" }]
                        },
                        {
                            featureType: "water",
                            elementType: "labels.text.stroke",
                            stylers: [{ color: "#17263c" }]
                        }
                    ]
                });

                // User Location Blue Pulsing Marker
                new google.maps.Marker({
                    position: { lat: userLoc.lat, lng: userLoc.lng },
                    map,
                    title: `🔵 Your Current Location (${userLoc.label})`,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#0284c7",
                        fillOpacity: 1,
                        strokeColor: "#ffffff",
                        strokeWeight: 3
                    }
                });

                // Pharmacy Markers
                const infoWindow = new google.maps.InfoWindow();

                pharmacies.forEach(p => {
                    if (p.lat && p.lng) {
                        const marker = new google.maps.Marker({
                            position: { lat: p.lat, lng: p.lng },
                            map,
                            title: p.shop_name,
                            icon: {
                                path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                                scale: 6,
                                fillColor: "#ef4444",
                                fillOpacity: 1,
                                strokeColor: "#ffffff",
                                strokeWeight: 2
                            }
                        });

                        marker.addListener("click", () => {
                            infoWindow.setContent(`
                                <div style="color:#0f172a; padding:6px; font-family:sans-serif;">
                                    <strong style="font-size:14px;">${p.shop_name}</strong>
                                    <div style="font-size:12px; color:#475569; margin:4px 0;">${p.address}</div>
                                    <div style="font-size:12px; margin-bottom:6px;">
                                        ⭐ ${p.rating} (${p.reviews_count} reviews) • 📍 ${p.distance}
                                    </div>
                                    <a href="${this.getDirectionsUrl(p)}" target="_blank" style="display:inline-block; background:#0ea5e9; color:white; padding:4px 8px; border-radius:4px; text-decoration:none; font-size:11px; font-weight:bold;">
                                        🧭 Get Directions
                                    </a>
                                </div>
                            `);
                            infoWindow.open(map, marker);
                        });
                    }
                });
                return;
            }
        }

        // Fallback Styled Canvas Render
        let canvas = container.querySelector('canvas');
        if (!canvas) {
            container.innerHTML = `<canvas style="width:100%; height:100%; min-height:220px; border-radius:var(--radius-md);"></canvas>`;
            canvas = container.querySelector('canvas');
        }
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width = container.clientWidth || 400;
        const height = canvas.height = container.clientHeight || 220;

        // Dark Styled Map Background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);

        // Grid Lines
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

        const center = { x: width * 0.5, y: height * 0.5 };

        // Draw User Pin
        this.drawMarker(ctx, center.x, center.y, '#0284c7', 'fa-location-crosshairs', `🔵 You (${userLoc.label.split(',')[0]})`);

        // Draw Nearby Pharmacy Pins in relative spread
        pharmacies.slice(0, 6).forEach((p, idx) => {
            const angle = (idx / 6) * 2 * Math.PI;
            const distPx = 50 + (idx * 15);
            const px = center.x + Math.cos(angle) * distPx;
            const py = center.y + Math.sin(angle) * distPx;

            this.drawMarker(ctx, px, py, '#ef4444', 'fa-store', `📍 ${p.shop_name.split(' ')[0]} (${p.distance})`);
        });
    }

    drawMarker(ctx, x, y, color, iconClass, label) {
        ctx.save();
        // Ring
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

        // Label
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y + 20);
        ctx.restore();
    }
}

export const googleMapsService = new GoogleMapsService();
