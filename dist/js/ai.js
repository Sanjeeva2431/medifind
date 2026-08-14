// MediFind AI Features (Prescription OCR Reader, Alternative Recommendation, Voice/Text AI Assistant)

import { MOCK_MEDICINES, MOCK_PHARMACIES } from './data.js';

export class AiEngine {
    constructor(appState) {
        this.appState = appState;
    }

    // 1. AI Prescription Reader (OCR Simulator for Camera, Gallery, and PDF)
    async scanPrescription(fileSource, sourceType = 'gallery') {
        return new Promise((resolve) => {
            setTimeout(() => {
                const sampleExtracted = [
                    { name: 'Dolo 650mg Tablet', generic: 'Paracetamol 650mg', qty: 2, confidence: 98, isLowConfidence: false, medId: 'med_1', matched: true },
                    { name: 'Becosules Z Capsule', generic: 'B-Complex + Zinc', qty: 1, confidence: 94, isLowConfidence: false, medId: 'med_16', matched: true },
                    { name: 'Amoxyclav 625mg', generic: 'Amoxicillin + Clavulanic Acid', qty: 1, confidence: 64, isLowConfidence: true, medId: 'med_2', matched: true },
                    { name: 'Pantocid 40 Tablet', generic: 'Pantoprazole 40mg', qty: 1, confidence: 92, isLowConfidence: false, medId: 'med_23', matched: true }
                ];
                resolve({
                    success: true,
                    sourceType,
                    doctor: 'Dr. A. K. Sharma (MD Internal Medicine)',
                    patient: 'Alex Johnson',
                    date: new Date().toISOString().split('T')[0],
                    items: sampleExtracted,
                    rawText: 'Rx:\n1. Tab Dolo 650mg 1-0-1 (2 strips)\n2. Cap Becosules Z 0-1-0 (1 strip)\n3. Tab Amoxyclav 625mg 1-0-1 (1 strip)\n4. Tab Pantocid 40mg 1-0-0 before breakfast'
                });
            }, 1200);
        });
    }

    // 2. AI Generic & Alternative Medicine Recommender
    getGenericAlternatives(medId) {
        const target = MOCK_MEDICINES.find(m => m.id === medId);
        if (!target) return [];

        // Find medicines with similar generic name or category
        const alternatives = MOCK_MEDICINES.filter(m => 
            m.id !== target.id && 
            (m.generic_name.toLowerCase().includes(target.generic_name.split(' ')[0].toLowerCase()) ||
             m.category === target.category)
        ).slice(0, 3);

        return alternatives.map(alt => ({
            ...alt,
            savings_percent: Math.round(((target.price - alt.price) / target.price) * 100)
        }));
    }

    // 3. AI Conversational Search Assistant
    queryAssistant(userQuery) {
        const query = userQuery.toLowerCase().trim();

        // Scenario 1: Specific medicine search (e.g. Dolo 650, Paracetamol, Augmentin)
        if (query.includes('dolo') || query.includes('paracetamol') || query.includes('fever')) {
            const matches = MOCK_MEDICINES.filter(m => m.name.toLowerCase().includes('dolo') || m.generic_name.toLowerCase().includes('paracetamol')).slice(0, 3);
            return {
                reply: `I found ${matches.length} availability options for Dolo 650 / Paracetamol in nearby pharmacies. Apollo Pharmacy has instant 15-min delivery!`,
                type: 'medicines',
                data: matches
            };
        }

        // Scenario 2: Find Open Pharmacies
        if (query.includes('open') || query.includes('pharmacy') || query.includes('near')) {
            const openPharmacies = MOCK_PHARMACIES.filter(p => p.status === 'open');
            return {
                reply: `There are ${openPharmacies.length} verified pharmacies open right now near Sector 18. Apollo Pharmacy 24/7 is closest (0.8 km).`,
                type: 'pharmacies',
                data: openPharmacies
            };
        }

        // Scenario 3: Price filter query (e.g., under 100)
        if (query.includes('under') || query.includes('cheap') || query.includes('price')) {
            const budgetMeds = MOCK_MEDICINES.filter(m => m.price <= 100).slice(0, 4);
            return {
                reply: `Here are popular high-demand medicines priced under ₹100 available for immediate order:`,
                type: 'medicines',
                data: budgetMeds
            };
        }

        // Scenario 4: Emergency / Insulin / Cardiac
        if (query.includes('emergency') || query.includes('insulin') || query.includes('heart')) {
            const emergencyMeds = MOCK_MEDICINES.filter(m => m.category === 'emergency' || m.category === 'diabetes' || m.category === 'cardiac').slice(0, 3);
            return {
                reply: `🚨 Emergency Care Alert: Sanjeevani Emergency Pharmacy and Apollo 24/7 have critical emergency medicines and insulin in stock with express priority delivery.`,
                type: 'medicines',
                data: emergencyMeds
            };
        }

        // Fallback Intelligent response
        return {
            reply: `I analyzed your search for "${userQuery}". You can search by generic chemical name, brand, or upload your doctor's prescription for instant auto-cart checkout!`,
            type: 'text'
        };
    }
}
