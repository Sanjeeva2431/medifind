import { MOCK_PHARMACIES } from './data.js';

export class GoogleMapsService {
    constructor() {
        let savedLoc = null;
        try {
            const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('medifind_user_location') : null;
            if (raw && raw !== 'undefined' && raw !== 'null') {
                const parsed = JSON.parse(raw);
                if (parsed && !parsed.label?.includes('Anna Nagar')) {
                    savedLoc = parsed;
                }
            }
        } catch (e) {
            console.warn('[GoogleMapsService] Error reading location from storage:', e);
        }

        this.currentLocation = savedLoc || {
            lat: 28.5355,
            lng: 77.3910,
            label: 'User Current Location',
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
            const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:5000';
            const res = await fetch(`${baseUrl}/api/config`);
            if (res.ok) {
                const config = await res.json();
                if (config.success && config.googleMapsApiKey) {
                    this.loadGoogleMapsScript(config.googleMapsApiKey);
                }
            }
        } catch (e) {
            console.warn('[Google Maps API Config Check Failed]:', e.message || e);
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

        const processLocationFix = async (position, isHighAccuracy = true) => {
            const lat = parseFloat(position.coords.latitude.toFixed(6));
            const lng = parseFloat(position.coords.longitude.toFixed(6));
            const accuracy = Math.round(position.coords.accuracy || 0);

            let addressLabel = `Live GPS (${lat}, ${lng})`;

            // Reverse geocoding lookup for precise human-readable street address
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
                accuracy,
                isHighAccuracy
            };

            this.locationState = {
                status: 'granted',
                errorMessage: '',
                isLiveGps: true
            };

            localStorage.setItem('medifind_user_location', JSON.stringify(this.currentLocation));

            // Auto-sync detected GPS address to current logged-in user profile
            if (window.MediApp && window.MediApp.authService) {
                const currentUser = window.MediApp.authService.getUser();
                if (currentUser) {
                    currentUser.address = addressLabel;
                    window.MediApp.authService.setCurrentUser(currentUser, true);
                    if (window.MediApp.authService.api) {
                        window.MediApp.authService.api.updateProfile({ address: addressLabel }).catch(e => console.warn('[Auto-Location Profile Sync Note]:', e));
                    }
                }
            }

            // Fetch real nearby Google Places pharmacies for detected position
            await this.fetchNearbyPharmacies(lat, lng);

            if (window.MediApp) window.MediApp.render();

            return {
                success: true,
                location: this.currentLocation,
                message: `📍 Located: ${addressLabel}! Real nearby pharmacies retrieved.`
            };
        };

        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                this.fallbackToIpLocation('Geolocation is not supported by your browser. Using IP Location.').then(resolve);
                return;
            }

            let resolved = false;

            // Tier 1: Try High-Accuracy GPS (Satellite / Wi-Fi AP triangulation) with 12s timeout
            const gpsTimeout = setTimeout(() => {
                if (!resolved) {
                    console.log('📍 High-accuracy GPS timeout (12s). Attempting low-accuracy cell/Wi-Fi positioning...');
                    // Tier 2: Low-accuracy HTML5 Geolocation (Fast Cell/Wi-Fi positioning)
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            if (!resolved) {
                                resolved = true;
                                const res = await processLocationFix(position, false);
                                resolve(res);
                            }
                        },
                        async (lowAccErr) => {
                            if (!resolved) {
                                resolved = true;
                                console.warn('[Low-Accuracy Geolocation Error]:', lowAccErr.message);
                                const ipRes = await this.fallbackToIpLocation('GPS timeout. Located via IP address.');
                                resolve(ipRes);
                            }
                        },
                        { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
                    );
                }
            }, 12000);

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    if (resolved) return;
                    resolved = true;
                    clearTimeout(gpsTimeout);
                    const res = await processLocationFix(position, true);
                    resolve(res);
                },
                async (error) => {
                    if (resolved) return;
                    console.warn('[High-Accuracy GPS Error]:', error.message);

                    // If user explicitly denied permission, don't retry HTML5 GPS, fallback to IP immediately
                    if (error.code === error.PERMISSION_DENIED) {
                        resolved = true;
                        clearTimeout(gpsTimeout);
                        const ipRes = await this.fallbackToIpLocation('Location access blocked by browser. City detected via IP.');
                        resolve(ipRes);
                        return;
                    }

                    // Otherwise try Tier 2: Low-accuracy cell/Wi-Fi geolocation
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            if (!resolved) {
                                resolved = true;
                                clearTimeout(gpsTimeout);
                                const res = await processLocationFix(position, false);
                                resolve(res);
                            }
                        },
                        async (lowAccErr) => {
                            if (!resolved) {
                                resolved = true;
                                clearTimeout(gpsTimeout);
                                const ipRes = await this.fallbackToIpLocation('Location access unavailable. City detected via IP.');
                                resolve(ipRes);
                            }
                        },
                        { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
                    );
                },
                { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
            );
        });
    }

    // IP-Based Geolocation Fallback
    async fallbackToIpLocation(reasonMsg = 'Located via IP') {
        try {
            let ipData = null;
            try {
                const ipRes = await fetch('/api/places/ip-location');
                if (ipRes.ok) {
                    ipData = await ipRes.json();
                }
            } catch (e) {
                // Fallback to direct client-side IP lookup if backend proxy is unreachable on mobile device
                try {
                    const clientIpRes = await fetch('http://ip-api.com/json/');
                    if (clientIpRes.ok) {
                        const raw = await clientIpRes.json();
                        if (raw && raw.status === 'success') {
                            ipData = {
                                success: true,
                                lat: raw.lat,
                                lng: raw.lon,
                                formatted_address: `${raw.city}, ${raw.regionName}`
                            };
                        }
                    }
                } catch (err) {
                    console.warn('[Client IP Lookup Failed]:', err);
                }
            }

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

        return { success: true, location: this.currentLocation, message: '📍 Location Set: Anna Nagar, Chennai' };
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
                this.googleApiError = null;
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

        const list = [];

        // Include verified registered supply stores (with direct Google Maps links)
        MOCK_PHARMACIES.filter(p => p.google_maps_url || p.id === 'pharm_supply_1').forEach(p => {
            const distKm = this.calculateDistance(userLat, userLng, p.lat, p.lng);
            list.push({
                ...p,
                distance_km: distKm,
                distance: this.formatDistance(distKm),
                delivery_time: this.calculateTravelTime(distKm).deliveryTime
            });
        });

        if (this.googlePharmacies && Array.isArray(this.googlePharmacies) && this.googlePharmacies.length > 0) {
            this.googlePharmacies.forEach(p => {
                const distKm = p.distance_km || this.calculateDistance(userLat, userLng, p.lat, p.lng);
                list.push({
                    ...p,
                    distance_km: distKm,
                    distance: this.formatDistance(distKm),
                    shop_name: (p.shop_name || 'Medical Store').replace(/\s*\([^)]*\)/g, '').trim()
                });
            });
        }

        list.sort((a, b) => (a.distance_km || 99) - (b.distance_km || 99));
        return list;
    }

    // Check if user location is within the 15 km delivery radius of the Medicine Supply Store
    isLocationServiceable(userLoc = this.currentLocation, maxRadiusKm = 15.0) {
        if (!userLoc || typeof userLoc.lat !== 'number' || typeof userLoc.lng !== 'number' || isNaN(userLoc.lat) || isNaN(userLoc.lng)) {
            return { serviceable: true, distanceKm: 0, message: '' };
        }

        // Target Medicine Supply Store: Nazarathpet (13.043913, 80.074262)
        const STORE_LAT = 13.043913;
        const STORE_LNG = 80.074262;

        const distanceKm = this.calculateDistance(userLoc.lat, userLoc.lng, STORE_LAT, STORE_LNG);

        if (distanceKm > maxRadiusKm) {
            return {
                serviceable: false,
                distanceKm,
                maxRadiusKm,
                message: 'The location is currently not serviceable'
            };
        }

        return {
            serviceable: true,
            distanceKm,
            maxRadiusKm,
            message: 'Serviceable location'
        };
    }

    // Forward geocode address string to lat/lng coordinates
    async geocodeAddress(addressString) {
        if (!addressString || typeof addressString !== 'string' || addressString.trim().length === 0) {
            return null;
        }

        const lower = addressString.toLowerCase();
        if (lower.includes('noida') || lower.includes('sector 18')) {
            return { lat: 28.5355, lng: 77.3910, formatted_address: 'Sector 18, Noida' };
        }
        if (lower.includes('delhi')) {
            return { lat: 28.6139, lng: 77.2090, formatted_address: 'New Delhi' };
        }
        if (lower.includes('bengaluru') || lower.includes('bangalore')) {
            return { lat: 12.9716, lng: 77.5946, formatted_address: 'Bengaluru' };
        }
        if (lower.includes('mumbai')) {
            return { lat: 19.0760, lng: 72.8777, formatted_address: 'Mumbai' };
        }

        try {
            const encoded = encodeURIComponent(addressString.trim());
            const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:5000';
            const res = await fetch(`${baseUrl}/api/places/geocode?address=${encoded}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.success && typeof data.lat === 'number' && typeof data.lng === 'number') {
                    return {
                        lat: data.lat,
                        lng: data.lng,
                        formatted_address: data.formatted_address || addressString
                    };
                }
            }
        } catch (e) {
            console.warn('[Geocode Address Error]:', e.message || e);
        }

        // Client fallback lookup via Nominatim OSM if server API key is absent
        try {
            const nomRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressString)}`);
            if (nomRes.ok) {
                const items = await nomRes.json();
                if (items && items.length > 0) {
                    return {
                        lat: parseFloat(items[0].lat),
                        lng: parseFloat(items[0].lon),
                        formatted_address: items[0].display_name
                    };
                }
            }
        } catch (err) {
            console.warn('[Nominatim Geocode Error]:', err);
        }

        return null;
    }

    // Verify serviceability by address string or coordinate object
    async verifyDeliveryServiceability(addressOrCoords, maxRadiusKm = 15.0) {
        let coords = addressOrCoords;

        if (typeof addressOrCoords === 'string') {
            if (this.currentLocation && this.currentLocation.label && (addressOrCoords.trim() === this.currentLocation.label.trim() || addressOrCoords.toLowerCase().includes(this.currentLocation.label.toLowerCase()))) {
                coords = this.currentLocation;
            } else {
                const resolved = await this.geocodeAddress(addressOrCoords);
                if (resolved && typeof resolved.lat === 'number' && typeof resolved.lng === 'number' && !isNaN(resolved.lat) && !isNaN(resolved.lng)) {
                    coords = resolved;
                } else {
                    const lower = addressOrCoords.toLowerCase();
                    if (lower.includes('noida') || lower.includes('delhi') || lower.includes('mumbai') || lower.includes('bengaluru') || lower.includes('hyderabad') || lower.includes('kolkata') || lower.includes('pune') || lower.includes('jaipur')) {
                        return {
                            serviceable: false,
                            distanceKm: 1500,
                            maxRadiusKm,
                            message: 'The location is currently not serviceable'
                        };
                    }
                    coords = this.currentLocation;
                }
            }
        }

        return this.isLocationServiceable(coords, maxRadiusKm);
    }

    // 4. Haversine Formula for Accurate Distance Calculation (in Km)
    calculateDistance(lat1, lon1, lat2, lon2) {
        if (typeof lat1 !== 'number' || typeof lon1 !== 'number' || typeof lat2 !== 'number' || typeof lon2 !== 'number' || isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
            return 1.0;
        }
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

    // 6. Generate Real Google Maps Directions URL & Direct Search URL
    getDirectionsUrl(pharmacy) {
        if (pharmacy.google_maps_url) {
            return pharmacy.google_maps_url;
        }
        const origin = `${this.currentLocation.lat},${this.currentLocation.lng}`;
        const destinationName = encodeURIComponent(`${pharmacy.shop_name} ${pharmacy.address}`);
        let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destinationName}`;
        if (pharmacy.place_id) {
            url += `&destination_place_id=${pharmacy.place_id}`;
        }
        return url;
    }

    getGoogleMapsSearchUrl(lat, lng) {
        const userLat = lat || this.currentLocation.lat;
        const userLng = lng || this.currentLocation.lng;
        return `https://www.google.com/maps/search/medical+store+pharmacy/@${userLat},${userLng},15z`;
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
                                    <div style="font-size:12px; margin-bottom:6px;">
                                        ⭐ ${p.rating} (${p.reviews_count} reviews)
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

        // If Leaflet maps API is available, render real Interactive Leaflet OpenStreetMap
        if (typeof window.L !== 'undefined') {
            try {
                if (this.leafletMapInstances && this.leafletMapInstances[containerId]) {
                    try { this.leafletMapInstances[containerId].remove(); } catch(e) {}
                }
                if (!this.leafletMapInstances) this.leafletMapInstances = {};

                container.innerHTML = `<div id="${containerId}_lmap" style="width:100%; height:100%; min-height:220px; border-radius:var(--radius-md); overflow:hidden;"></div>`;
                const mapEl = document.getElementById(`${containerId}_lmap`);
                if (mapEl) {
                    const lmap = L.map(mapEl, {
                        center: [userLoc.lat, userLoc.lng],
                        zoom: 13,
                        zoomControl: true
                    });

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(lmap);

                    // User Location Blue Pulsing Marker
                    const userIcon = L.divIcon({
                        className: 'user-gps-leaflet-pin',
                        html: `<div style="width:28px; height:28px; background:#0ea5e9; border:3px solid #ffffff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; box-shadow:0 0 12px rgba(14,165,233,0.8);">
                            <i class="fa-solid fa-crosshairs" style="font-size:12px;"></i>
                        </div>`,
                        iconSize: [28, 28],
                        iconAnchor: [14, 14]
                    });
                    L.marker([userLoc.lat, userLoc.lng], { icon: userIcon })
                        .addTo(lmap)
                        .bindPopup(`<b>📍 Your Location</b><br><small>${userLoc.label}</small>`);

                    // Nearby Store Red Markers
                    pharmacies.forEach(p => {
                        if (p.lat && p.lng) {
                            const storeIcon = L.divIcon({
                                className: 'store-leaflet-pin',
                                html: `<div style="width:28px; height:28px; background:${p.status === 'open' ? '#059669' : '#dc2626'}; border:2px solid #ffffff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; box-shadow:0 2px 8px rgba(0,0,0,0.4);">
                                    <i class="fa-solid fa-store" style="font-size:12px;"></i>
                                </div>`,
                                iconSize: [28, 28],
                                iconAnchor: [14, 14]
                            });

                            const popupHtml = `
                                <div style="font-family:sans-serif; color:#0f172a; padding:4px; min-width:170px;">
                                    <div style="font-weight:800; font-size:13px; margin-bottom:2px;">${p.shop_name}</div>
                                    <div style="font-size:11px; color:#64748b; margin-bottom:4px;">${p.address}</div>
                                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; font-weight:700; margin-bottom:6px;">
                                        <span>⭐ ${p.rating || 4.7}</span>
                                        <span style="color:${p.status === 'open' ? '#059669' : '#dc2626'};">${p.status === 'open' ? '🟢 Open' : '🔴 Closed'}</span>
                                        <span style="color:#0ea5e9;">⚡ ${p.distance || '0.8 km'}</span>
                                    </div>
                                    ${p.phone ? `<div style="font-size:11px; color:#475569; margin-bottom:6px;"><i class="fa-solid fa-phone"></i> ${p.phone}</div>` : ''}
                                    <a href="${this.getDirectionsUrl(p)}" target="_blank" style="display:block; text-align:center; background:#0ea5e9; color:white; padding:4px 8px; border-radius:4px; text-decoration:none; font-size:11px; font-weight:bold;">
                                        🧭 Get Directions
                                    </a>
                                </div>
                            `;

                            L.marker([p.lat, p.lng], { icon: storeIcon })
                                .addTo(lmap)
                                .bindPopup(popupHtml);
                        }
                    });

                    this.leafletMapInstances[containerId] = lmap;
                    setTimeout(() => lmap.invalidateSize(), 250);
                    return;
                }
            } catch(lErr) {
                console.warn('[Leaflet Map Render Error]:', lErr);
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
        pharmacies.slice(0, 8).forEach((p, idx) => {
            const angle = (idx / 8) * 2 * Math.PI;
            const distPx = 45 + (idx * 12);
            const px = center.x + Math.cos(angle) * distPx;
            const py = center.y + Math.sin(angle) * distPx;

            this.drawMarker(ctx, px, py, p.status === 'open' ? '#059669' : '#ef4444', 'fa-store', `📍 ${p.shop_name.split(' ')[0]}`);
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
