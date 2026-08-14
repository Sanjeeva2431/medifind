// MediFind Google Places & Maps Backend Proxy API

import express from 'express';

export const createPlacesRoutes = () => {
    const router = express.Router();

    // 1. Nearby Search for Pharmacies / Medical Shops / Drugstores
    router.get('/nearby', async (req, res) => {
        try {
            const { lat, lng } = req.query;
            let radius = parseInt(req.query.radius) || 5000; // Default 5 km

            if (!lat || !lng) {
                return res.status(400).json({ success: false, message: 'Latitude and longitude are required.' });
            }

            const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

            if (!apiKey || apiKey.includes('placeholder')) {
                return res.status(503).json({
                    success: false,
                    isApiKeyMissing: true,
                    message: 'Unable to load nearby pharmacies right now. Google Maps API key is not configured.'
                });
            }

            const fetchPlacesForRadius = async (r) => {
                // Perform Nearby Search using Google Places API Web Service
                const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${r}&type=pharmacy&keyword=pharmacy|medical|drugstore&key=${apiKey}`;
                const response = await fetch(url);
                const data = await response.json();
                return data;
            };

            let data = await fetchPlacesForRadius(radius);

            // Radius Escalation: If initial 5 km yields < 3 results, expand to 10 km, then 20 km
            if (data.status === 'OK' && data.results && data.results.length < 3) {
                if (radius < 10000) {
                    radius = 10000;
                    data = await fetchPlacesForRadius(radius);
                }
                if (data.status === 'OK' && data.results && data.results.length < 3 && radius < 20000) {
                    radius = 20000;
                    data = await fetchPlacesForRadius(radius);
                }
            }

            if (data.status === 'OK' || data.status === 'ZERO_RESULTS') {
                const results = (data.results || []).map(place => ({
                    place_id: place.place_id,
                    name: place.name,
                    address: place.vicinity || place.formatted_address || '',
                    lat: place.geometry?.location?.lat,
                    lng: place.geometry?.location?.lng,
                    rating: place.rating || null,
                    user_ratings_total: place.user_ratings_total || 0,
                    open_now: place.opening_hours ? place.opening_hours.open_now : null,
                    icon: place.icon,
                    types: place.types || []
                }));

                return res.json({
                    success: true,
                    radius_km: radius / 1000,
                    count: results.length,
                    pharmacies: results
                });
            } else {
                return res.status(500).json({
                    success: false,
                    status: data.status,
                    message: data.error_message || 'Unable to load nearby pharmacies right now.'
                });
            }
        } catch (error) {
            console.error('[Places Proxy Error]:', error);
            return res.status(500).json({
                success: false,
                message: 'Unable to load nearby pharmacies right now.'
            });
        }
    });

    // 2. Place Details (Phone, Website, Hours)
    router.get('/details', async (req, res) => {
        try {
            const { place_id } = req.query;
            if (!place_id) {
                return res.status(400).json({ success: false, message: 'place_id is required.' });
            }

            const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
            if (!apiKey || apiKey.includes('placeholder')) {
                return res.status(503).json({ success: false, message: 'Google Maps API key is missing.' });
            }

            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=name,formatted_address,formatted_phone_number,international_phone_number,opening_hours,rating,user_ratings_total,website,geometry&key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'OK') {
                return res.json({ success: true, details: data.result });
            } else {
                return res.status(500).json({ success: false, message: data.error_message || 'Place details request failed.' });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    });

    // 3. Reverse Geocoding (Convert lat,lng to human-readable address/area)
    router.get('/geocode', async (req, res) => {
        try {
            const { lat, lng, address } = req.query;
            const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

            let url = '';
            if (lat && lng) {
                url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
            } else if (address) {
                url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
            } else {
                return res.status(400).json({ success: false, message: 'lat/lng or address parameter is required.' });
            }

            if (!apiKey || apiKey.includes('placeholder')) {
                // Fallback reverse geocoding via OpenStreetMap if Google API Key is placeholder
                if (lat && lng) {
                    try {
                        const osmRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
                            headers: { 'User-Agent': 'MediFind-App/1.0' }
                        });
                        if (osmRes.ok) {
                            const osmData = await osmRes.json();
                            if (osmData && osmData.address) {
                                const area = osmData.address.suburb || osmData.address.neighbourhood || osmData.address.residential || osmData.address.town || osmData.address.city || 'Your Area';
                                const city = osmData.address.city || osmData.address.state_district || osmData.address.state || '';
                                return res.json({
                                    success: true,
                                    formatted_address: `${area}${city ? ', ' + city : ''}`,
                                    area,
                                    city,
                                    lat: parseFloat(lat),
                                    lng: parseFloat(lng)
                                });
                            }
                        }
                    } catch (e) {
                        console.warn('[Geocode OSM Fallback Error]:', e);
                    }
                }
                return res.json({
                    success: true,
                    formatted_address: `Live GPS (${lat || '0'}, ${lng || '0'})`,
                    area: 'Current Location',
                    lat: parseFloat(lat || 0),
                    lng: parseFloat(lng || 0)
                });
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'OK' && data.results && data.results.length > 0) {
                const first = data.results[0];
                let area = '';
                let city = '';

                // Extract neighbourhood/sublocality & locality
                for (const comp of first.address_components) {
                    if (comp.types.includes('sublocality') || comp.types.includes('neighborhood')) {
                        area = comp.long_name;
                    }
                    if (comp.types.includes('locality')) {
                        city = comp.long_name;
                    }
                }

                const addressLabel = area ? `${area}${city ? ', ' + city : ''}` : first.formatted_address.split(',').slice(0, 2).join(',');

                return res.json({
                    success: true,
                    formatted_address: addressLabel,
                    area: area || city || 'Current Area',
                    city,
                    lat: first.geometry?.location?.lat || parseFloat(lat),
                    lng: first.geometry?.location?.lng || parseFloat(lng)
                });
            } else {
                return res.json({
                    success: true,
                    formatted_address: `Live GPS (${lat}, ${lng})`,
                    lat: parseFloat(lat),
                    lng: parseFloat(lng)
                });
            }
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    });

    // 4. IP-Based Geolocation Fallback (Ensures location detection NEVER fails on desktop or permission block)
    router.get('/ip-location', async (req, res) => {
        try {
            const ipRes = await fetch('http://ip-api.com/json/');
            if (ipRes.ok) {
                const data = await ipRes.json();
                if (data && data.status === 'success') {
                    return res.json({
                        success: true,
                        lat: data.lat,
                        lng: data.lon,
                        city: data.city,
                        region: data.regionName,
                        country: data.country,
                        formatted_address: `${data.city}, ${data.regionName}`
                    });
                }
            }
        } catch (e) {
            console.warn('[IP Location Fetch Error]:', e);
        }

        // Fallback default coordinates if IP lookup is offline
        return res.json({
            success: true,
            lat: 13.0827,
            lng: 80.2707,
            city: 'Chennai',
            region: 'Tamil Nadu',
            country: 'India',
            formatted_address: 'Anna Nagar, Chennai'
        });
    });

    return router;
};
