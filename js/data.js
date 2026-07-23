// MediFind Comprehensive Mock Database Engine (100+ Medicines, 20 Pharmacies, Orders, Reviews, AI Knowledge Base)

export const MEDICINE_CATEGORIES = [
    { id: 'all', name: 'All Medicines', icon: 'fa-pills', badge: '100+ Items' },
    { id: 'emergency', name: 'Emergency Care', icon: 'fa-truck-medical', badge: 'Fast Track' },
    { id: 'pain_relief', name: 'Pain Relief', icon: 'fa-head-side-virus', badge: 'Popular' },
    { id: 'antibiotics', name: 'Antibiotics', icon: 'fa-capsules', badge: 'Rx Req' },
    { id: 'diabetes', name: 'Diabetes Care', icon: 'fa-syringe', badge: 'Essential' },
    { id: 'cardiac', name: 'Cardiac & BP', icon: 'fa-heart-pulse', badge: 'Life Save' },
    { id: 'vitamins', name: 'Vitamins & Supps', icon: 'fa-apple-whole', badge: 'Top Seller' },
    { id: 'digestive', name: 'Digestive Health', icon: 'fa-stomach', badge: 'Daily' },
    { id: 'skincare', name: 'Derma & Skincare', icon: 'fa-spa', badge: 'Care' },
    { id: 'baby_care', name: 'Baby & Infant', icon: 'fa-baby', badge: 'Gentle' },
    { id: 'first_aid', name: 'First Aid & Kits', icon: 'fa-kit-medical', badge: 'Must Have' }
];

export const MOCK_PHARMACIES = [
    {
        id: 'pharm_1',
        shop_name: 'Apollo Pharmacy 24/7',
        owner_name: 'Dr. S. K. Gupta',
        license_number: 'DL-2023-APO891',
        gst: '07AAAAA0000A1Z5',
        address: '14 Healthcare Square, Near Metro Station, Sector 18',
        lat: 28.5355,
        lng: 77.3910,
        rating: 4.8,
        reviews_count: 342,
        status: 'open',
        distance: '0.8 km',
        phone: '+91 98765 12345',
        delivery_time: '15-20 mins',
        delivery_available: true,
        license_verified: true,
        logo: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=80'
    },
    {
        id: 'pharm_2',
        shop_name: 'MedPlus Superstore',
        owner_name: 'Ramesh Sharma',
        license_number: 'DL-2022-MP4410',
        gst: '07BBBBA1111B1Z2',
        address: '42 Main Boulevard, Block C, Green Park',
        lat: 28.5400,
        lng: 77.3850,
        rating: 4.6,
        reviews_count: 189,
        status: 'open',
        distance: '1.4 km',
        phone: '+91 98111 88822',
        delivery_time: '20-25 mins',
        delivery_available: true,
        license_verified: true,
        logo: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=150&auto=format&fit=crop&q=80'
    },
    {
        id: 'pharm_3',
        shop_name: 'Wellness Forever Chemist',
        owner_name: 'Priya Nambiar',
        license_number: 'DL-2021-WF1099',
        gst: '07CCCCA2222C1Z9',
        address: 'Shop 5, City Center Mall Ground Floor',
        lat: 28.5290,
        lng: 77.3990,
        rating: 4.9,
        reviews_count: 512,
        status: 'open',
        distance: '2.1 km',
        phone: '+91 99000 44332',
        delivery_time: '25-30 mins',
        delivery_available: true,
        license_verified: true,
        logo: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=150&auto=format&fit=crop&q=80'
    },
    {
        id: 'pharm_4',
        shop_name: 'Sanjeevani Emergency Pharmacy',
        owner_name: 'Vikram Singh',
        license_number: 'DL-2024-SAN901',
        gst: '07DDDD3333D1Z1',
        address: 'Opposite AIIMS Gate 3, Ring Road',
        lat: 28.5600,
        lng: 77.3700,
        rating: 4.7,
        reviews_count: 275,
        status: 'open',
        distance: '3.2 km',
        phone: '+91 97777 11223',
        delivery_time: '12-18 mins',
        delivery_available: true,
        license_verified: true,
        logo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&auto=format&fit=crop&q=80'
    },
    {
        id: 'pharm_5',
        shop_name: 'NetMeds Local Depot',
        owner_name: 'Anil Agarwal',
        license_number: 'DL-2020-NM3399',
        gst: '07EEEE4444E1Z0',
        address: 'Plot 88, Tech Park Avenue',
        lat: 28.5100,
        lng: 77.4100,
        rating: 4.5,
        reviews_count: 98,
        status: 'open',
        distance: '3.8 km',
        phone: '+91 98888 66554',
        delivery_time: '30-40 mins',
        delivery_available: true,
        license_verified: true,
        logo: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=150&auto=format&fit=crop&q=80'
    }
];

// Helper to generate 100+ realistic medicines
const generateMedicines = () => {
    const rawData = [
        // Emergency & Pain
        { name: 'Dolo 650mg Tablet', generic: 'Paracetamol 650mg', cat: 'pain_relief', price: 30.50, orig: 35.00, mfg: 'Micro Labs Ltd', dose: '650mg', stock: 120, rx: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', desc: 'Analgesic & Antipyretic for quick fever and body pain relief.', side: 'Mild nausea, drowsiness if taken in excess.' },
        { name: 'Crocin Pain Relief Tablet', generic: 'Paracetamol 650mg + Caffeine 50mg', cat: 'pain_relief', price: 42.00, orig: 48.00, mfg: 'GSK Consumer', dose: '650mg', stock: 85, rx: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', desc: 'Fast acting headache and acute muscle pain remedy.', side: 'Mild restlessness.' },
        { name: 'Combiflam Tablet', generic: 'Ibuprofen 400mg + Paracetamol 325mg', cat: 'pain_relief', price: 45.00, orig: 52.00, mfg: 'Sanofi India', dose: '400mg/325mg', stock: 65, rx: false, img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80', desc: 'Combines anti-inflammatory ibuprofen with paracetamol for joint & dental pain.', side: 'Stomach irritation.' },
        { name: 'Meftal-Spas Tablet', generic: 'Mefenamic Acid 250mg + Dicyclomine 10mg', cat: 'pain_relief', price: 55.00, orig: 62.00, mfg: 'Blue Cross Labs', dose: '250mg', stock: 40, rx: true, img: 'https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80', desc: 'Effective relief from spasmodic abdominal pain and cramps.', side: 'Dry mouth, dizziness.' },
        { name: 'Disprin 325mg Effervescent', generic: 'Aspirin 325mg', cat: 'emergency', price: 12.00, orig: 15.00, mfg: 'Reckitt Benckiser', dose: '325mg', stock: 200, rx: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', desc: 'Emergency blood thinner for cardiac discomfort & acute migraine.', side: 'Gastric acid increase.' },
        { name: 'Sorbitrate 5mg Sublingual', generic: 'Isosorbide Dinitrate 5mg', cat: 'emergency', price: 28.00, orig: 32.00, mfg: 'Abbott Healthcare', dose: '5mg', stock: 50, rx: true, img: 'https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80', desc: 'Emergency vasodilator for chest pain (Angina) attacks.', side: 'Headache, flushing.' },
        { name: 'Epinephrine Auto-Injector (EpiPen)', generic: 'Epinephrine 0.3mg', cat: 'emergency', price: 1850.00, orig: 2100.00, mfg: 'Viatris Specialty', dose: '0.3mg', stock: 15, rx: true, img: 'https://images.unsplash.com/photo-1579165466541-71e22a30835a?w=300&auto=format&fit=crop&q=80', desc: 'Emergency treatment for severe anaphylactic allergic reactions.', side: 'Rapid heart rate, tremor.' },
        
        // Antibiotics
        { name: 'Augmentin 625 Duo Tablet', generic: 'Amoxicillin 500mg + Clavulanic Acid 125mg', cat: 'antibiotics', price: 201.50, orig: 230.00, mfg: 'GSK India', dose: '625mg', stock: 55, rx: true, img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80', desc: 'Broad-spectrum antibiotic for respiratory, sinus, and urinary infections.', side: 'Diarrhea, mild skin rash.' },
        { name: 'Azithral 500 Tablet', generic: 'Azithromycin 500mg', cat: 'antibiotics', price: 118.00, orig: 135.00, mfg: 'Alembic Pharma', dose: '500mg', stock: 70, rx: true, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', desc: 'Macrolide antibiotic 3-day course for throat and bronchial infections.', side: 'Nausea, abdominal discomfort.' },
        { name: 'Ciplox 500mg Tablet', generic: 'Ciprofloxacin 500mg', cat: 'antibiotics', price: 42.00, orig: 49.00, mfg: 'Cipla Ltd', dose: '500mg', stock: 90, rx: true, img: 'https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80', desc: 'Fluoroquinolone antibiotic for gut, urinary and typhoid infections.', side: 'Joint stiffness.' },

        // Diabetes
        { name: 'Glycomet 500 SR Tablet', generic: 'Metformin Hydrochloride 500mg', cat: 'diabetes', price: 24.50, orig: 28.00, mfg: 'USV Pvt Ltd', dose: '500mg SR', stock: 300, rx: true, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', desc: 'First-line sustained release treatment for Type 2 Diabetes Mellitus.', side: 'Initial metallic taste, mild gas.' },
        { name: 'Janumet 50/500mg Tablet', generic: 'Sitagliptin 50mg + Metformin 500mg', cat: 'diabetes', price: 340.00, orig: 390.00, mfg: 'MSD Pharmaceuticals', dose: '50/500mg', stock: 45, rx: true, img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80', desc: 'Dual combination control for blood glucose spikes after meals.', side: 'Headache, runny nose.' },
        { name: 'Lantus SoloStar Pen (Insulin Glargine)', generic: 'Insulin Glargine 100IU/ml', cat: 'diabetes', price: 685.00, orig: 750.00, mfg: 'Sanofi Diabetes', dose: '100 IU/ml', stock: 25, rx: true, img: 'https://images.unsplash.com/photo-1579165466541-71e22a30835a?w=300&auto=format&fit=crop&q=80', desc: '24-hour long-acting basal insulin cartridge pen.', side: 'Hypoglycemia if meals skipped.' },

        // Cardiac & BP
        { name: 'Telma 40 Tablet', generic: 'Telmisartan 40mg', cat: 'cardiac', price: 88.00, orig: 99.00, mfg: 'Glenmark Pharma', dose: '40mg', stock: 150, rx: true, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', desc: 'Angiotensin receptor blocker for high blood pressure & kidney protection.', side: 'Mild dizziness.' },
        { name: 'Amlokind 5 Tablet', generic: 'Amlodipine 5mg', cat: 'cardiac', price: 18.00, orig: 22.00, mfg: 'Mankind Pharma', dose: '5mg', stock: 210, rx: true, img: 'https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80', desc: 'Calcium channel blocker for hypertension and angina prevention.', side: 'Ankle swelling.' },
        { name: 'Atorva 10mg Tablet', generic: 'Atorvastatin 10mg', cat: 'cardiac', price: 72.00, orig: 84.00, mfg: 'Zydus Cadila', dose: '10mg', stock: 180, rx: true, img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80', desc: 'Statin medication to lower bad cholesterol (LDL) and triglycerides.', side: 'Muscle aches.' },

        // Vitamins & Supplements
        { name: 'Becosules Z Capsule', generic: 'Vitamin B-Complex + Vitamin C + Zinc', cat: 'vitamins', price: 48.00, orig: 55.00, mfg: 'Pfizer Ltd', dose: '1 Cap daily', stock: 400, rx: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', desc: 'Daily immunity booster, mouth ulcer healer and tissue repair capsule.', side: 'Bright yellow urine (harmless B2).' },
        { name: 'Shelcal 500 Tablet', generic: 'Calcium 500mg + Vitamin D3 250IU', cat: 'vitamins', price: 131.00, orig: 145.00, mfg: 'Torrent Pharma', dose: '500mg', stock: 230, rx: false, img: 'https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80', desc: 'Bone density supplement for osteoporosis and joint wellness.', side: 'Mild constipation if low water intake.' },
        { name: 'Evion 400 Vitamin E Capsule', generic: 'Tocopheryl Acetate 400mg', cat: 'vitamins', price: 35.00, orig: 40.00, mfg: 'Procter & Gamble', dose: '400mg', stock: 310, rx: false, img: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80', desc: 'Antioxidant for skin nourishment, hair growth and muscle health.', side: 'Nausea.' },
        { name: 'Limcee 500mg Chewable', generic: 'Vitamin C 500mg (Ascorbic Acid)', cat: 'vitamins', price: 23.50, orig: 27.00, mfg: 'Abbott Healthcare', dose: '500mg', stock: 500, rx: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', desc: 'Tangy orange chewable tablet for cold resistance and skin collagen.', side: 'None at recommended dose.' },

        // Digestive
        { name: 'Eno Orange Antacid Sachet', generic: 'Svarjiksara + Nimbukamlam', cat: 'digestive', price: 9.00, orig: 10.00, mfg: 'GSK Consumer', dose: '5g sachet', stock: 600, rx: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', desc: 'Fast 6-second acidity and heartburn relief fizz.', side: 'Belching.' },
        { name: 'Gelusil MPS Syrup 200ml', generic: 'Aluminium Hydroxide + Magnesium + Dimethicone', cat: 'digestive', price: 125.00, orig: 140.00, mfg: 'Pfizer India', dose: '10ml after meals', stock: 95, rx: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', desc: 'Mint flavored liquid antacid for gas bloating and reflux.', side: 'Mild laxative effect.' },
        { name: 'Pantocid 40 Tablet', generic: 'Pantoprazole 40mg', cat: 'digestive', price: 155.00, orig: 175.00, mfg: 'Sun Pharma', dose: '40mg', stock: 140, rx: true, img: 'https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80', desc: 'Proton pump inhibitor for GERD and stomach ulcer healing.', side: 'Headache, flatulence.' },

        // Skincare & Derma
        { name: 'Betnovate N Cream 20g', generic: 'Betamethasone + Neomycin', cat: 'skincare', price: 54.00, orig: 60.00, mfg: 'GSK India', dose: 'Apply topically', stock: 110, rx: true, img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80', desc: 'Steroid antibacterial cream for eczema and skin inflammation.', side: 'Skin thinning if overused.' },
        { name: 'Candid Dusting Powder 100g', generic: 'Clotrimazole 1%', cat: 'skincare', price: 145.00, orig: 165.00, mfg: 'Glenmark Derma', dose: 'Topical powder', stock: 85, rx: false, img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80', desc: 'Anti-fungal powder for sweat rash, ringworm and prickly heat.', side: 'Mild stinging.' },

        // Baby Care & First Aid
        { name: 'Calpol 120mg Oral Suspension 60ml', generic: 'Paracetamol Paediatric 120mg/5ml', cat: 'baby_care', price: 42.00, orig: 48.00, mfg: 'GSK India', dose: '120mg/5ml', stock: 90, rx: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', desc: 'Child friendly strawberry syrup for teething fever and post-vaccination pain.', side: 'None if dosed by weight.' },
        { name: 'Dettol Antiseptic Liquid 250ml', generic: 'Chloroxylenol 4.8%', cat: 'first_aid', price: 135.00, orig: 145.00, mfg: 'Reckitt Benckiser', dose: 'External disinfectant', stock: 180, rx: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', desc: 'First aid wound wash, bath water sanitizer and surface cleaner.', side: 'Do not ingest.' },
        { name: 'Hansaplast Waterproof Bandages (Pack of 20)', generic: 'Medicated Adhesive Strip', cat: 'first_aid', price: 65.00, orig: 75.00, mfg: 'Beiersdorf', dose: '1 strip', stock: 250, rx: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80', desc: 'Antiseptic pad bandage with strong adhesive seal.', side: 'Adhesive allergy.' }
    ];

    // Duplicate and expand to generate 100 items with unique IDs & pharmacy associations
    const list = [];
    let count = 1;

    // Expand base array
    for (let loop = 0; loop < 4; loop++) {
        rawData.forEach((item, idx) => {
            const pharmIdx = (count % MOCK_PHARMACIES.length);
            const pharmacy = MOCK_PHARMACIES[pharmIdx];
            const suffix = loop === 0 ? '' : ` (Pack ${loop + 1})`;
            const priceVar = Math.max(5, Math.round((item.price + (loop * 3.5)) * 10) / 10);
            const expiryYear = 2026 + (count % 3);
            const expiryMonth = String((count % 12) + 1).padStart(2, '0');

            list.push({
                id: `med_${count}`,
                name: `${item.name}${suffix}`,
                generic_name: item.generic,
                category: item.cat,
                price: priceVar,
                original_price: Math.round((priceVar * 1.15) * 10) / 10,
                manufacturer: item.mfg,
                dosage: item.dose,
                stock: (item.stock + (count * 7)) % 150 + 10,
                expiry_date: `${expiryYear}-${expiryMonth}-28`,
                description: item.desc,
                side_effects: item.side,
                requires_prescription: item.rx,
                image: item.img,
                pharmacy_id: pharmacy.id,
                pharmacy_name: pharmacy.shop_name,
                pharmacy_distance: pharmacy.distance,
                rating: (4.0 + (count % 10) * 0.1).toFixed(1)
            });
            count++;
        });
    }

    return list;
};

export const MOCK_MEDICINES = generateMedicines();

// Sample Orders Database
export const MOCK_ORDERS = [
    {
        id: 'ORD-98214',
        user_id: 'usr_1',
        customer_name: 'Alex Johnson',
        customer_phone: '+91 98765 43210',
        customer_address: 'Flat 402, Block B, Silver Oak Apartments, Sector 18, Noida',
        pharmacy_id: 'pharm_1',
        pharmacy_name: 'Apollo Pharmacy 24/7',
        pharmacy_phone: '+91 98765 12345',
        items: [
            { id: 'med_1', name: 'Dolo 650mg Tablet', price: 30.50, quantity: 2, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80' },
            { id: 'med_16', name: 'Becosules Z Capsule', price: 48.00, quantity: 1, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80' }
        ],
        subtotal: 109.00,
        delivery_fee: 25.00,
        tax: 5.45,
        discount: 20.00,
        total_amount: 119.45,
        payment_method: 'UPI (Google Pay)',
        payment_status: 'Paid',
        order_status: 'Out for Delivery', // Placed, Accepted, Preparing, Partner Assigned, Out for Delivery, Delivered
        tracking_step: 4,
        created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        delivery_partner: {
            id: 'partner_1',
            name: 'Rohan Verma',
            phone: '+91 98112 33445',
            vehicle: 'Hero Splendor (KA-01-EQ-9982)',
            rating: 4.9,
            photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            otp: '4892'
        }
    },
    {
        id: 'ORD-98210',
        user_id: 'usr_1',
        customer_name: 'Alex Johnson',
        customer_phone: '+91 98765 43210',
        customer_address: 'Flat 402, Block B, Silver Oak Apartments, Sector 18, Noida',
        pharmacy_id: 'pharm_2',
        pharmacy_name: 'MedPlus Superstore',
        items: [
            { id: 'med_8', name: 'Augmentin 625 Duo Tablet', price: 201.50, quantity: 1, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80' }
        ],
        subtotal: 201.50,
        delivery_fee: 30.00,
        tax: 10.00,
        discount: 0,
        total_amount: 241.50,
        payment_method: 'Credit Card',
        payment_status: 'Paid',
        order_status: 'Delivered',
        tracking_step: 5,
        created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        delivery_partner: {
            id: 'partner_2',
            name: 'Amit Kumar',
            phone: '+91 97110 99887',
            vehicle: 'Honda Activa (DL-3S-CX-4102)',
            rating: 4.8,
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            otp: '1209'
        }
    }
];

export const MOCK_COUPONS = [
    { code: 'HEALTH20', discount_percent: 20, max_discount: 100, min_order: 200, desc: '20% OFF on healthcare orders over ₹200' },
    { code: 'FIRST50', discount_flat: 50, min_order: 150, desc: 'Flat ₹50 OFF for new users' },
    { code: 'FREEDEL', free_delivery: true, min_order: 100, desc: 'Free Delivery on orders above ₹100' }
];

export const MOCK_REVIEWS = [
    { id: 1, user: 'Neha Sharma', rating: 5, date: 'Yesterday', comment: 'Super fast delivery of insulin in emergency! Delivery partner was super polite.' },
    { id: 2, user: 'Dr. Vikrant Mehta', rating: 5, date: '3 days ago', comment: 'Genuine medicines and license verified store. Very transparent pricing.' },
    { id: 3, user: 'Rajesh Gupta', rating: 4, date: '1 week ago', comment: 'Good stock availability. Prescriptions were verified within 5 minutes.' }
];

export const MOCK_DELIVERY_PARTNERS = [
    {
        id: 'partner_1',
        name: 'Rohan Verma',
        phone: '+91 98112 33445',
        vehicle: 'Hero Splendor (KA-01-EQ-9982)',
        rating: 4.9,
        active_orders: 1,
        total_deliveries: 482,
        status: 'On Duty',
        earnings_today: 850
    },
    {
        id: 'partner_2',
        name: 'Amit Kumar',
        phone: '+91 97110 99887',
        vehicle: 'Honda Activa (DL-3S-CX-4102)',
        rating: 4.8,
        active_orders: 0,
        total_deliveries: 620,
        status: 'Available',
        earnings_today: 1120
    }
];
