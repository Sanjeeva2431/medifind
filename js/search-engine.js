// MediFind Intelligent Search Engine (Fuzzy Matching, Typos, Multi-Field Search & Generic Recommender)

export class IntelligentSearchEngine {
    constructor(medicines = [], pharmacies = []) {
        this.medicines = medicines;
        this.pharmacies = pharmacies;
    }

    setDatasets(medicines, pharmacies) {
        this.medicines = medicines;
        this.pharmacies = pharmacies;
    }

    // 1. Levenshtein Distance Algorithm for Fuzzy Spelling Correction
    levenshteinDistance(str1, str2) {
        const s1 = str1.toLowerCase().trim();
        const s2 = str2.toLowerCase().trim();
        const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));

        for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
        for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

        for (let j = 1; j <= s2.length; j += 1) {
            for (let i = 1; i <= s1.length; i += 1) {
                const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1,       // deletion
                    track[j - 1][i] + 1,       // insertion
                    track[j - 1][i - 1] + indicator // substitution
                );
            }
        }
        return track[s2.length][s1.length];
    }

    // 2. Similarity Score (0 to 1)
    calculateSimilarity(term, target) {
        const t1 = term.toLowerCase().trim();
        const t2 = target.toLowerCase().trim();
        if (t2.includes(t1)) return 1.0;

        const distance = this.levenshteinDistance(t1, t2);
        const maxLen = Math.max(t1.length, t2.length);
        if (maxLen === 0) return 1.0;
        return 1.0 - (distance / maxLen);
    }

    // 3. Intelligent Multi-Field Search
    search(query = '', category = 'all') {
        const cleanQuery = query.toLowerCase().trim();
        if (!cleanQuery && (category === 'all' || !category)) {
            return { results: this.enrichMedicines(this.medicines), spellingCorrection: null, alternatives: [] };
        }

        const enrichedList = this.enrichMedicines(this.medicines);
        let matches = [];
        let bestSpellingMatch = null;
        let highestSimilarity = 0;

        enrichedList.forEach(med => {
            const matchCategory = !category || category === 'all' || med.category === category;
            if (!matchCategory) return;

            if (!cleanQuery) {
                matches.push({ med, score: 1.0 });
                return;
            }

            // Calculate similarity across Brand Name, Generic Name, Category, and Manufacturer
            const brandScore = this.calculateSimilarity(cleanQuery, med.name);
            const genericScore = this.calculateSimilarity(cleanQuery, med.generic_name);
            const mfgScore = med.manufacturer ? this.calculateSimilarity(cleanQuery, med.manufacturer) : 0;

            const maxScore = Math.max(brandScore, genericScore, mfgScore);

            if (maxScore > highestSimilarity) {
                highestSimilarity = maxScore;
                if (maxScore > 0.6 && maxScore < 1.0) {
                    bestSpellingMatch = med.name;
                }
            }

            // Include match if exact sub-match or similarity threshold >= 0.45
            if (maxScore >= 0.45 || med.name.toLowerCase().includes(cleanQuery) || med.generic_name.toLowerCase().includes(cleanQuery)) {
                matches.push({ med, score: maxScore });
            }
        });

        // Sort results by similarity score descending, then by stock availability
        matches.sort((a, b) => b.score - a.score || b.med.stock - a.med.stock);
        const results = matches.map(m => m.med);

        // 4. Generate Alternative Recommendations if result list is empty or primary items are out of stock
        let alternatives = [];
        if (results.length === 0 || results.every(m => m.stock === 0)) {
            alternatives = this.getGenericAlternatives(cleanQuery);
        }

        return {
            results,
            spellingCorrection: highestSimilarity >= 0.6 && highestSimilarity < 0.95 ? bestSpellingMatch : null,
            alternatives
        };
    }

    // 5. Enrich medicines with pharmacy open/closed, distance, rating, delivery availability & manufacturer info
    enrichMedicines(medicines) {
        return medicines.map(m => {
            const pharmacy = this.pharmacies.find(p => p.id === m.pharmacy_id) || this.pharmacies[0];
            return {
                ...m,
                manufacturer: m.manufacturer || m.mfg || 'Certified Pharma Corp',
                pharmacy_name: pharmacy ? pharmacy.shop_name : 'Apollo Pharmacy 24/7',
                pharmacy_distance: pharmacy ? pharmacy.distance : '0.8 km',
                pharmacy_status: pharmacy ? pharmacy.status : 'open',
                pharmacy_rating: pharmacy ? pharmacy.rating : 4.8,
                pharmacy_delivery_available: pharmacy ? pharmacy.delivery_available : true,
                delivery_time: pharmacy ? pharmacy.delivery_time : '15-20 mins'
            };
        });
    }

    // 6. Alternative Recommender for Out of Stock or Unavailable Brands
    getGenericAlternatives(query) {
        const enriched = this.enrichMedicines(this.medicines);
        const q = query.toLowerCase();

        // Find medicines with matching chemical prefix or category
        const matches = enriched.filter(m => 
            m.stock > 0 && 
            (m.generic_name.toLowerCase().includes(q.split(' ')[0]) || q.includes(m.category))
        ).slice(0, 3);

        return matches.map(alt => ({
            ...alt,
            savings_percent: 25 // Average 25% price savings for generic substitute
        }));
    }
}
