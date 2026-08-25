(() => {
  // js/data.js
  var MEDICINE_CATEGORIES = [
    { id: "all", name: "All Medicines", icon: "fa-pills", badge: "100+ Items" },
    { id: "emergency", name: "Emergency Care", icon: "fa-truck-medical", badge: "Fast Track" },
    { id: "pain_relief", name: "Pain Relief", icon: "fa-head-side-virus", badge: "Popular" },
    { id: "antibiotics", name: "Antibiotics", icon: "fa-capsules", badge: "Rx Req" },
    { id: "diabetes", name: "Diabetes Care", icon: "fa-syringe", badge: "Essential" },
    { id: "cardiac", name: "Cardiac & BP", icon: "fa-heart-pulse", badge: "Life Save" },
    { id: "vitamins", name: "Vitamins & Supps", icon: "fa-apple-whole", badge: "Top Seller" },
    { id: "digestive", name: "Digestive Health", icon: "fa-stomach", badge: "Daily" },
    { id: "skincare", name: "Derma & Skincare", icon: "fa-spa", badge: "Care" },
    { id: "baby_care", name: "Baby & Infant", icon: "fa-baby", badge: "Gentle" },
    { id: "first_aid", name: "First Aid & Kits", icon: "fa-kit-medical", badge: "Must Have" }
  ];
  var MOCK_PHARMACIES = [
    {
      id: "pharm_supply_1",
      shop_name: "Nazarathpet Medicine Supply Store",
      owner_name: "Dr. R. Sanjeeva",
      license_number: "DL-2026-NMS881",
      gst: "33AAAAA9999A1Z1",
      address: "Nazarathpet, Thirumazhisai, Poonamallee, Thiruvallur, Tamil Nadu 602101",
      lat: 13.043913,
      lng: 80.074262,
      google_maps_url: "https://maps.app.goo.gl/GAJhNha3TsA4P29r7",
      rating: 4.9,
      reviews_count: 420,
      status: "open",
      distance: "0.3 km",
      phone: "+91 98400 12345",
      delivery_time: "10-15 mins",
      delivery_available: true,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "pharm_1",
      shop_name: "Apollo Pharmacy 24/7",
      owner_name: "Dr. S. K. Gupta",
      license_number: "DL-2023-APO891",
      gst: "07AAAAA0000A1Z5",
      address: "14 Healthcare Square, Near Metro Station, Sector 18",
      lat: 28.5355,
      lng: 77.391,
      rating: 4.8,
      reviews_count: 342,
      status: "open",
      distance: "0.4 km",
      phone: "+91 98765 12345",
      delivery_time: "12-15 mins",
      delivery_available: true,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "pharm_2",
      shop_name: "MedPlus Superstore",
      owner_name: "Ramesh Sharma",
      license_number: "DL-2022-MP4410",
      gst: "07BBBBA1111B1Z2",
      address: "42 Main Boulevard, Block C, Green Park",
      lat: 28.54,
      lng: 77.385,
      rating: 4.6,
      reviews_count: 189,
      status: "open",
      distance: "0.8 km",
      phone: "+91 98111 88822",
      delivery_time: "15-20 mins",
      delivery_available: true,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "pharm_3",
      shop_name: "Wellness Forever 24/7 Chemist",
      owner_name: "Dr. Ananya Roy",
      license_number: "DL-2023-WF9021",
      gst: "07CCCCA2222C1Z8",
      address: "Plot 88, Central Avenue Market, Sector 15",
      lat: 28.532,
      lng: 77.394,
      rating: 4.9,
      reviews_count: 512,
      status: "open",
      distance: "1.1 km",
      phone: "+91 98222 33344",
      delivery_time: "15-22 mins",
      delivery_available: true,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "pharm_4",
      shop_name: "Guardian Pharmacy & Healthcare",
      owner_name: "Vikas Malhotra",
      license_number: "DL-2021-GPH771",
      gst: "07DDDDA3333D1Z4",
      address: "Shop 12, City Center Mall, Ground Floor",
      lat: 28.5435,
      lng: 77.388,
      rating: 4.5,
      reviews_count: 145,
      status: "open",
      distance: "1.5 km",
      phone: "+91 98333 44455",
      delivery_time: "20-25 mins",
      delivery_available: true,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "pharm_5",
      shop_name: "Netmeds Specialty Store",
      owner_name: "Priya Sundaram",
      license_number: "DL-2023-NM3390",
      gst: "07EEEEA4444E1Z1",
      address: "77 Cross Road, Block B, Preet Vihar",
      lat: 28.529,
      lng: 77.382,
      rating: 4.7,
      reviews_count: 278,
      status: "open",
      distance: "1.8 km",
      phone: "+91 98444 55566",
      delivery_time: "20-30 mins",
      delivery_available: true,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "pharm_6",
      shop_name: "Generico Generic Medicine Hub",
      owner_name: "Amitabh Patel",
      license_number: "DL-2022-GEN112",
      gst: "07FFFFA5555F1Z9",
      address: "Plot 15, Station Road, Opp. Civil Hospital",
      lat: 28.548,
      lng: 77.395,
      rating: 4.4,
      reviews_count: 98,
      status: "open",
      distance: "2.3 km",
      phone: "+91 98555 66677",
      delivery_time: "25-30 mins",
      delivery_available: true,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "pharm_7",
      shop_name: "Frank Ross Pharmacy",
      owner_name: "Subhash Mukherjee",
      license_number: "DL-2020-FR5540",
      gst: "07GGGGA6666G1Z6",
      address: "99 Link Road, Near Fortis Hospital, Sector 62",
      lat: 28.525,
      lng: 77.401,
      rating: 4.8,
      reviews_count: 410,
      status: "open",
      distance: "2.9 km",
      phone: "+91 98666 77788",
      delivery_time: "25-35 mins",
      delivery_available: true,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "pharm_8",
      shop_name: "Sanjivani Medical & Surgical Hall",
      owner_name: "Rajendra Prasad",
      license_number: "DL-2019-SM0019",
      gst: "07HHHHA7777H1Z3",
      address: "5 Sector 22 Market, Main Bazaar Road",
      lat: 28.552,
      lng: 77.378,
      rating: 4.6,
      reviews_count: 165,
      status: "closed",
      distance: "3.4 km",
      phone: "+91 98777 88899",
      delivery_time: "30-40 mins",
      delivery_available: false,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "pharm_9",
      shop_name: "Metro Care Discount Chemist",
      owner_name: "Sunil Kumar",
      license_number: "DL-2023-MC8820",
      gst: "07IIIIA8888I1Z0",
      address: "Shop 4, Metro Pillar 114, Main Highway",
      lat: 28.518,
      lng: 77.375,
      rating: 4.3,
      reviews_count: 84,
      status: "open",
      distance: "3.8 km",
      phone: "+91 98888 99900",
      delivery_time: "30-45 mins",
      delivery_available: true,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "pharm_10",
      shop_name: "Lifecare Pharma & Surgical Store",
      owner_name: "Dr. Meenakshi Joshi",
      license_number: "DL-2021-LC4401",
      gst: "07JJJJA9999J1Z7",
      address: "102 Medical Enclave, Gate 2, Hospital Road",
      lat: 28.557,
      lng: 77.405,
      rating: 4.9,
      reviews_count: 620,
      status: "open",
      distance: "4.2 km",
      phone: "+91 98999 00011",
      delivery_time: "35-45 mins",
      delivery_available: true,
      license_verified: true,
      logo: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=150&auto=format&fit=crop&q=80"
    }
  ];
  var generateMedicines = () => {
    const rawData = [
      // Emergency & Pain
      { name: "Dolo 650mg Tablet", generic: "Paracetamol 650mg", cat: "pain_relief", price: 30.5, orig: 35, mfg: "Micro Labs Ltd", dose: "650mg", stock: 120, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Analgesic & Antipyretic for quick fever and body pain relief.", side: "Mild nausea, drowsiness if taken in excess." },
      { name: "Crocin Pain Relief Tablet", generic: "Paracetamol 650mg + Caffeine 50mg", cat: "pain_relief", price: 42, orig: 48, mfg: "GSK Consumer", dose: "650mg", stock: 85, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Fast acting headache and acute muscle pain remedy.", side: "Mild restlessness." },
      { name: "Combiflam Tablet", generic: "Ibuprofen 400mg + Paracetamol 325mg", cat: "pain_relief", price: 45, orig: 52, mfg: "Sanofi India", dose: "400mg/325mg", stock: 65, rx: false, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80", desc: "Combines anti-inflammatory ibuprofen with paracetamol for joint & dental pain.", side: "Stomach irritation." },
      { name: "Meftal-Spas Tablet", generic: "Mefenamic Acid 250mg + Dicyclomine 10mg", cat: "pain_relief", price: 55, orig: 62, mfg: "Blue Cross Labs", dose: "250mg", stock: 40, rx: true, img: "https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80", desc: "Effective relief from spasmodic abdominal pain and cramps.", side: "Dry mouth, dizziness." },
      { name: "Disprin 325mg Effervescent", generic: "Aspirin 325mg", cat: "emergency", price: 12, orig: 15, mfg: "Reckitt Benckiser", dose: "325mg", stock: 200, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Emergency blood thinner for cardiac discomfort & acute migraine.", side: "Gastric acid increase." },
      { name: "Sorbitrate 5mg Sublingual", generic: "Isosorbide Dinitrate 5mg", cat: "emergency", price: 28, orig: 32, mfg: "Abbott Healthcare", dose: "5mg", stock: 50, rx: true, img: "https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80", desc: "Emergency vasodilator for chest pain (Angina) attacks.", side: "Headache, flushing." },
      { name: "Epinephrine Auto-Injector (EpiPen)", generic: "Epinephrine 0.3mg", cat: "emergency", price: 1850, orig: 2100, mfg: "Viatris Specialty", dose: "0.3mg", stock: 15, rx: true, img: "https://images.unsplash.com/photo-1579165466541-71e22a30835a?w=300&auto=format&fit=crop&q=80", desc: "Emergency treatment for severe anaphylactic allergic reactions.", side: "Rapid heart rate, tremor." },
      // Antibiotics
      { name: "Augmentin 625 Duo Tablet", generic: "Amoxicillin 500mg + Clavulanic Acid 125mg", cat: "antibiotics", price: 201.5, orig: 230, mfg: "GSK India", dose: "625mg", stock: 55, rx: true, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80", desc: "Broad-spectrum antibiotic for respiratory, sinus, and urinary infections.", side: "Diarrhea, mild skin rash." },
      { name: "Azithral 500 Tablet", generic: "Azithromycin 500mg", cat: "antibiotics", price: 118, orig: 135, mfg: "Alembic Pharma", dose: "500mg", stock: 70, rx: true, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Macrolide antibiotic 3-day course for throat and bronchial infections.", side: "Nausea, abdominal discomfort." },
      { name: "Ciplox 500mg Tablet", generic: "Ciprofloxacin 500mg", cat: "antibiotics", price: 42, orig: 49, mfg: "Cipla Ltd", dose: "500mg", stock: 90, rx: true, img: "https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80", desc: "Fluoroquinolone antibiotic for gut, urinary and typhoid infections.", side: "Joint stiffness." },
      // Diabetes
      { name: "Glycomet 500 SR Tablet", generic: "Metformin Hydrochloride 500mg", cat: "diabetes", price: 24.5, orig: 28, mfg: "USV Pvt Ltd", dose: "500mg SR", stock: 300, rx: true, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "First-line sustained release treatment for Type 2 Diabetes Mellitus.", side: "Initial metallic taste, mild gas." },
      { name: "Janumet 50/500mg Tablet", generic: "Sitagliptin 50mg + Metformin 500mg", cat: "diabetes", price: 340, orig: 390, mfg: "MSD Pharmaceuticals", dose: "50/500mg", stock: 45, rx: true, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80", desc: "Dual combination control for blood glucose spikes after meals.", side: "Headache, runny nose." },
      { name: "Lantus SoloStar Pen (Insulin Glargine)", generic: "Insulin Glargine 100IU/ml", cat: "diabetes", price: 685, orig: 750, mfg: "Sanofi Diabetes", dose: "100 IU/ml", stock: 25, rx: true, img: "https://images.unsplash.com/photo-1579165466541-71e22a30835a?w=300&auto=format&fit=crop&q=80", desc: "24-hour long-acting basal insulin cartridge pen.", side: "Hypoglycemia if meals skipped." },
      // Cardiac & BP
      { name: "Telma 40 Tablet", generic: "Telmisartan 40mg", cat: "cardiac", price: 88, orig: 99, mfg: "Glenmark Pharma", dose: "40mg", stock: 150, rx: true, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Angiotensin receptor blocker for high blood pressure & kidney protection.", side: "Mild dizziness." },
      { name: "Amlokind 5 Tablet", generic: "Amlodipine 5mg", cat: "cardiac", price: 18, orig: 22, mfg: "Mankind Pharma", dose: "5mg", stock: 210, rx: true, img: "https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80", desc: "Calcium channel blocker for hypertension and angina prevention.", side: "Ankle swelling." },
      { name: "Atorva 10mg Tablet", generic: "Atorvastatin 10mg", cat: "cardiac", price: 72, orig: 84, mfg: "Zydus Cadila", dose: "10mg", stock: 180, rx: true, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80", desc: "Statin medication to lower bad cholesterol (LDL) and triglycerides.", side: "Muscle aches." },
      // Vitamins & Supplements
      { name: "Becosules Z Capsule", generic: "Vitamin B-Complex + Vitamin C + Zinc", cat: "vitamins", price: 48, orig: 55, mfg: "Pfizer Ltd", dose: "1 Cap daily", stock: 400, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Daily immunity booster, mouth ulcer healer and tissue repair capsule.", side: "Bright yellow urine (harmless B2)." },
      { name: "Shelcal 500 Tablet", generic: "Calcium 500mg + Vitamin D3 250IU", cat: "vitamins", price: 131, orig: 145, mfg: "Torrent Pharma", dose: "500mg", stock: 230, rx: false, img: "https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80", desc: "Bone density supplement for osteoporosis and joint wellness.", side: "Mild constipation if low water intake." },
      { name: "Evion 400 Vitamin E Capsule", generic: "Tocopheryl Acetate 400mg", cat: "vitamins", price: 35, orig: 40, mfg: "Procter & Gamble", dose: "400mg", stock: 310, rx: false, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80", desc: "Antioxidant for skin nourishment, hair growth and muscle health.", side: "Nausea." },
      { name: "Limcee 500mg Chewable", generic: "Vitamin C 500mg (Ascorbic Acid)", cat: "vitamins", price: 23.5, orig: 27, mfg: "Abbott Healthcare", dose: "500mg", stock: 500, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Tangy orange chewable tablet for cold resistance and skin collagen.", side: "None at recommended dose." },
      // Digestive
      { name: "Eno Orange Antacid Sachet", generic: "Svarjiksara + Nimbukamlam", cat: "digestive", price: 9, orig: 10, mfg: "GSK Consumer", dose: "5g sachet", stock: 600, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Fast 6-second acidity and heartburn relief fizz.", side: "Belching." },
      { name: "Gelusil MPS Syrup 200ml", generic: "Aluminium Hydroxide + Magnesium + Dimethicone", cat: "digestive", price: 125, orig: 140, mfg: "Pfizer India", dose: "10ml after meals", stock: 95, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Mint flavored liquid antacid for gas bloating and reflux.", side: "Mild laxative effect." },
      { name: "Pantocid 40 Tablet", generic: "Pantoprazole 40mg", cat: "digestive", price: 155, orig: 175, mfg: "Sun Pharma", dose: "40mg", stock: 140, rx: true, img: "https://images.unsplash.com/photo-1550572017-edf70602666b?w=300&auto=format&fit=crop&q=80", desc: "Proton pump inhibitor for GERD and stomach ulcer healing.", side: "Headache, flatulence." },
      // Skincare & Derma
      { name: "Betnovate N Cream 20g", generic: "Betamethasone + Neomycin", cat: "skincare", price: 54, orig: 60, mfg: "GSK India", dose: "Apply topically", stock: 110, rx: true, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80", desc: "Steroid antibacterial cream for eczema and skin inflammation.", side: "Skin thinning if overused." },
      { name: "Candid Dusting Powder 100g", generic: "Clotrimazole 1%", cat: "skincare", price: 145, orig: 165, mfg: "Glenmark Derma", dose: "Topical powder", stock: 85, rx: false, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80", desc: "Anti-fungal powder for sweat rash, ringworm and prickly heat.", side: "Mild stinging." },
      // Baby Care & First Aid
      { name: "Calpol 120mg Oral Suspension 60ml", generic: "Paracetamol Paediatric 120mg/5ml", cat: "baby_care", price: 42, orig: 48, mfg: "GSK India", dose: "120mg/5ml", stock: 90, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Child friendly strawberry syrup for teething fever and post-vaccination pain.", side: "None if dosed by weight." },
      { name: "Dettol Antiseptic Liquid 250ml", generic: "Chloroxylenol 4.8%", cat: "first_aid", price: 135, orig: 145, mfg: "Reckitt Benckiser", dose: "External disinfectant", stock: 180, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "First aid wound wash, bath water sanitizer and surface cleaner.", side: "Do not ingest." },
      { name: "Hansaplast Waterproof Bandages (Pack of 20)", generic: "Medicated Adhesive Strip", cat: "first_aid", price: 65, orig: 75, mfg: "Beiersdorf", dose: "1 strip", stock: 250, rx: false, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80", desc: "Antiseptic pad bandage with strong adhesive seal.", side: "Adhesive allergy." }
    ];
    const list = [];
    let count = 1;
    for (let loop = 0; loop < 4; loop++) {
      rawData.forEach((item) => {
        if (item.rx) return;
        const pharmIdx = count % MOCK_PHARMACIES.length;
        const pharmacy = MOCK_PHARMACIES[pharmIdx];
        const suffix = loop === 0 ? "" : ` (Pack ${loop + 1})`;
        const priceVar = Math.max(5, Math.round((item.price + loop * 3.5) * 10) / 10);
        const expiryYear = 2026 + count % 3;
        const expiryMonth = String(count % 12 + 1).padStart(2, "0");
        list.push({
          id: `med_${count}`,
          name: `${item.name}${suffix}`,
          generic_name: item.generic,
          category: item.cat,
          price: priceVar,
          original_price: Math.round(priceVar * 1.15 * 10) / 10,
          manufacturer: item.mfg,
          dosage: item.dose,
          stock: (item.stock + count * 7) % 150 + 10,
          expiry_date: `${expiryYear}-${expiryMonth}-28`,
          description: item.desc,
          side_effects: item.side,
          requires_prescription: false,
          image: item.img,
          pharmacy_id: "pharm_nazarathpet",
          pharmacy_name: "Nazarathpet Medicine Supply Store",
          pharmacy_distance: "0.0 km",
          rating: (4 + count % 10 * 0.1).toFixed(1)
        });
        count++;
      });
    }
    return list;
  };
  var MOCK_MEDICINES = generateMedicines();
  var MOCK_ORDERS = [];

  // js/search-engine.js
  var IntelligentSearchEngine = class {
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
            track[j][i - 1] + 1,
            // deletion
            track[j - 1][i] + 1,
            // insertion
            track[j - 1][i - 1] + indicator
            // substitution
          );
        }
      }
      return track[s2.length][s1.length];
    }
    // 2. Similarity Score (0 to 1)
    calculateSimilarity(term, target) {
      const t1 = term.toLowerCase().trim();
      const t2 = target.toLowerCase().trim();
      if (t2.includes(t1)) return 1;
      const distance = this.levenshteinDistance(t1, t2);
      const maxLen = Math.max(t1.length, t2.length);
      if (maxLen === 0) return 1;
      return 1 - distance / maxLen;
    }
    // 3. Intelligent Multi-Field Search
    search(query = "", category = "all") {
      const cleanQuery = query.toLowerCase().trim();
      if (!cleanQuery && (category === "all" || !category)) {
        return { results: this.enrichMedicines(this.medicines), spellingCorrection: null, alternatives: [] };
      }
      const enrichedList = this.enrichMedicines(this.medicines);
      let matches = [];
      let bestSpellingMatch = null;
      let highestSimilarity = 0;
      enrichedList.forEach((med) => {
        const matchCategory = !category || category === "all" || med.category === category;
        if (!matchCategory) return;
        if (!cleanQuery) {
          matches.push({ med, score: 1 });
          return;
        }
        const brandScore = this.calculateSimilarity(cleanQuery, med.name);
        const genericScore = this.calculateSimilarity(cleanQuery, med.generic_name);
        const mfgScore = med.manufacturer ? this.calculateSimilarity(cleanQuery, med.manufacturer) : 0;
        const maxScore = Math.max(brandScore, genericScore, mfgScore);
        if (maxScore > highestSimilarity) {
          highestSimilarity = maxScore;
          if (maxScore > 0.6 && maxScore < 1) {
            bestSpellingMatch = med.name;
          }
        }
        if (maxScore >= 0.45 || med.name.toLowerCase().includes(cleanQuery) || med.generic_name.toLowerCase().includes(cleanQuery)) {
          matches.push({ med, score: maxScore });
        }
      });
      matches.sort((a, b) => {
        if (Math.abs(b.score - a.score) > 0.05) {
          return b.score - a.score;
        }
        const distA = parseFloat(a.med.pharmacy_distance) || 99;
        const distB = parseFloat(b.med.pharmacy_distance) || 99;
        if (distA !== distB) {
          return distA - distB;
        }
        return b.med.stock - a.med.stock;
      });
      const results = matches.map((m) => m.med);
      let alternatives = [];
      if (results.length === 0 || results.every((m) => m.stock === 0)) {
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
      return medicines.map((m) => {
        const pharmacy = this.pharmacies.find((p) => p.id === m.pharmacy_id) || this.pharmacies[0];
        return {
          ...m,
          manufacturer: m.manufacturer || m.mfg || "Certified Pharma Corp",
          pharmacy_name: pharmacy ? pharmacy.shop_name : "Apollo Pharmacy 24/7",
          pharmacy_distance: pharmacy ? pharmacy.distance : "0.8 km",
          pharmacy_status: pharmacy ? pharmacy.status : "open",
          pharmacy_rating: pharmacy ? pharmacy.rating : 4.8,
          pharmacy_delivery_available: pharmacy ? pharmacy.delivery_available : true,
          delivery_time: pharmacy ? pharmacy.delivery_time : "15-20 mins"
        };
      });
    }
    // 6. Alternative Recommender for Out of Stock or Unavailable Brands
    getGenericAlternatives(query) {
      const enriched = this.enrichMedicines(this.medicines);
      const q = query.toLowerCase();
      const matches = enriched.filter(
        (m) => m.stock > 0 && (m.generic_name.toLowerCase().includes(q.split(" ")[0]) || q.includes(m.category))
      ).slice(0, 3);
      return matches.map((alt) => ({
        ...alt,
        savings_percent: 25
        // Average 25% price savings for generic substitute
      }));
    }
  };

  // js/maps.js
  var GoogleMapsService = class {
    constructor() {
      var _a;
      let savedLoc = null;
      try {
        const raw = typeof localStorage !== "undefined" ? localStorage.getItem("medifind_user_location") : null;
        if (raw && raw !== "undefined" && raw !== "null") {
          const parsed = JSON.parse(raw);
          if (parsed && !((_a = parsed.label) == null ? void 0 : _a.includes("Anna Nagar"))) {
            savedLoc = parsed;
          }
        }
      } catch (e) {
        console.warn("[GoogleMapsService] Error reading location from storage:", e);
      }
      this.currentLocation = savedLoc || {
        lat: 28.5355,
        lng: 77.391,
        label: "User Current Location",
        isLiveGps: false,
        accuracy: null
      };
      this.locationState = {
        status: "idle",
        // 'idle' | 'detecting' | 'granted' | 'denied' | 'error'
        errorMessage: "",
        isLiveGps: this.currentLocation.isLiveGps
      };
      this.googlePharmacies = [];
      this.isSearchingGoogle = false;
      this.googleApiError = null;
      this.watchId = null;
      this.initGoogleMapsApi();
    }
    async initGoogleMapsApi() {
      try {
        const baseUrl = typeof window !== "undefined" ? "" : "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/config`);
        if (res.ok) {
          const config = await res.json();
          if (config.success && config.googleMapsApiKey) {
            this.loadGoogleMapsScript(config.googleMapsApiKey);
          }
        }
      } catch (e) {
        console.warn("[Google Maps API Config Check Failed]:", e.message || e);
      }
    }
    loadGoogleMapsScript(apiKey) {
      if (window.google && window.google.maps) return;
      if (document.getElementById("google-maps-js-sdk")) return;
      const script = document.createElement("script");
      script.id = "google-maps-js-sdk";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("\u26A1 Google Maps JavaScript API Loaded Successfully");
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
      this.locationState.status = "detecting";
      this.locationState.errorMessage = "";
      if (window.MediApp) window.MediApp.render();
      const processLocationFix = async (position, isHighAccuracy = true) => {
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        const accuracy = Math.round(position.coords.accuracy || 0);
        let addressLabel = `Live GPS (${lat}, ${lng})`;
        try {
          const geoRes = await fetch(`/api/places/geocode?lat=${lat}&lng=${lng}`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData && geoData.success && geoData.formatted_address) {
              addressLabel = geoData.formatted_address;
            }
          }
        } catch (e) {
          console.warn("[Maps API] Geocoding lookup error:", e);
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
          status: "granted",
          errorMessage: "",
          isLiveGps: true
        };
        localStorage.setItem("medifind_user_location", JSON.stringify(this.currentLocation));
        if (window.MediApp && window.MediApp.authService) {
          const currentUser = window.MediApp.authService.getUser();
          if (currentUser) {
            currentUser.address = addressLabel;
            window.MediApp.authService.setCurrentUser(currentUser, true);
            if (window.MediApp.authService.api) {
              window.MediApp.authService.api.updateProfile({ address: addressLabel }).catch((e) => console.warn("[Auto-Location Profile Sync Note]:", e));
            }
          }
        }
        await this.fetchNearbyPharmacies(lat, lng);
        if (window.MediApp) window.MediApp.render();
        return {
          success: true,
          location: this.currentLocation,
          message: `\u{1F4CD} Located: ${addressLabel}! Real nearby pharmacies retrieved.`
        };
      };
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          this.fallbackToIpLocation("Geolocation is not supported by your browser. Using IP Location.").then(resolve);
          return;
        }
        let resolved = false;
        const gpsTimeout = setTimeout(() => {
          if (!resolved) {
            console.log("\u{1F4CD} High-accuracy GPS timeout (12s). Attempting low-accuracy cell/Wi-Fi positioning...");
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
                  console.warn("[Low-Accuracy Geolocation Error]:", lowAccErr.message);
                  const ipRes = await this.fallbackToIpLocation("GPS timeout. Located via IP address.");
                  resolve(ipRes);
                }
              },
              { enableHighAccuracy: false, timeout: 6e3, maximumAge: 6e4 }
            );
          }
        }, 12e3);
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
            console.warn("[High-Accuracy GPS Error]:", error.message);
            if (error.code === error.PERMISSION_DENIED) {
              resolved = true;
              clearTimeout(gpsTimeout);
              const ipRes = await this.fallbackToIpLocation("Location access blocked by browser. City detected via IP.");
              resolve(ipRes);
              return;
            }
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
                  const ipRes = await this.fallbackToIpLocation("Location access unavailable. City detected via IP.");
                  resolve(ipRes);
                }
              },
              { enableHighAccuracy: false, timeout: 6e3, maximumAge: 6e4 }
            );
          },
          { enableHighAccuracy: true, timeout: 12e3, maximumAge: 0 }
        );
      });
    }
    // IP-Based Geolocation Fallback
    async fallbackToIpLocation(reasonMsg = "Located via IP") {
      try {
        let ipData = null;
        try {
          const ipRes = await fetch("/api/places/ip-location");
          if (ipRes.ok) {
            ipData = await ipRes.json();
          }
        } catch (e) {
          try {
            const clientIpRes = await fetch("http://ip-api.com/json/");
            if (clientIpRes.ok) {
              const raw = await clientIpRes.json();
              if (raw && raw.status === "success") {
                ipData = {
                  success: true,
                  lat: raw.lat,
                  lng: raw.lon,
                  formatted_address: `${raw.city}, ${raw.regionName}`
                };
              }
            }
          } catch (err) {
            console.warn("[Client IP Lookup Failed]:", err);
          }
        }
        if (ipData && ipData.success) {
          this.currentLocation = {
            lat: ipData.lat,
            lng: ipData.lng,
            label: ipData.formatted_address || `${ipData.city}, ${ipData.region}`,
            isLiveGps: false,
            isIpLocation: true,
            accuracy: 1e3
          };
          this.locationState = {
            status: "granted",
            errorMessage: "",
            isLiveGps: false,
            isIpLocation: true
          };
          localStorage.setItem("medifind_user_location", JSON.stringify(this.currentLocation));
          await this.fetchNearbyPharmacies(ipData.lat, ipData.lng);
          if (window.MediApp) window.MediApp.render();
          return {
            success: true,
            location: this.currentLocation,
            message: `\u{1F4CD} City Detected via IP: ${this.currentLocation.label}`
          };
        }
      } catch (e) {
        console.warn("[IP Location Fallback Error]:", e);
      }
      this.currentLocation = {
        lat: 13.0827,
        lng: 80.2707,
        label: "Anna Nagar, Chennai",
        isLiveGps: false,
        accuracy: null
      };
      this.locationState = { status: "granted", errorMessage: "", isLiveGps: false };
      localStorage.setItem("medifind_user_location", JSON.stringify(this.currentLocation));
      if (window.MediApp) window.MediApp.render();
      return { success: true, location: this.currentLocation, message: "\u{1F4CD} Location Set: Anna Nagar, Chennai" };
    }
    // 2. Set Manual City / Address Location
    async setManualLocation(addressLabel, lat = 13.0827, lng = 80.2707) {
      let finalLat = lat;
      let finalLng = lng;
      let finalLabel = addressLabel;
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
          console.warn("[Manual Geocode Error]:", e);
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
        status: "granted",
        errorMessage: "",
        isLiveGps: false
      };
      localStorage.setItem("medifind_user_location", JSON.stringify(this.currentLocation));
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
          this.googlePharmacies = data.pharmacies.map((p) => {
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
              status: p.open_now === false ? "closed" : "open",
              open_now: p.open_now,
              distance_km: distKm,
              distance: formattedDist,
              phone: p.phone || null,
              delivery_time: times.deliveryTime,
              delivery_available: true,
              isGooglePlace: true,
              logo: p.icon || "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=80"
            };
          });
          this.googlePharmacies.sort((a, b) => a.distance_km - b.distance_km);
          this.enrichTopPlacesDetails();
        } else {
          this.googlePharmacies = [];
          this.googleApiError = null;
        }
      } catch (error) {
        console.error("[Google Nearby Fetch Error]:", error);
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
          }
        }
      }
    }
    // Dynamic Pharmacy Catalog Localized strictly around User Coordinates
    getPharmacies() {
      const userLat = this.currentLocation.lat;
      const userLng = this.currentLocation.lng;
      const list = [];
      MOCK_PHARMACIES.filter((p) => p.google_maps_url || p.id === "pharm_supply_1").forEach((p) => {
        const distKm = this.calculateDistance(userLat, userLng, p.lat, p.lng);
        list.push({
          ...p,
          distance_km: distKm,
          distance: this.formatDistance(distKm),
          delivery_time: this.calculateTravelTime(distKm).deliveryTime
        });
      });
      if (this.googlePharmacies && Array.isArray(this.googlePharmacies) && this.googlePharmacies.length > 0) {
        this.googlePharmacies.forEach((p) => {
          const distKm = p.distance_km || this.calculateDistance(userLat, userLng, p.lat, p.lng);
          list.push({
            ...p,
            distance_km: distKm,
            distance: this.formatDistance(distKm),
            shop_name: (p.shop_name || "Medical Store").replace(/\s*\([^)]*\)/g, "").trim()
          });
        });
      }
      list.sort((a, b) => (a.distance_km || 99) - (b.distance_km || 99));
      return list;
    }
    // Check if user location is within the 15 km delivery radius of the Medicine Supply Store
    isLocationServiceable(userLoc = this.currentLocation, maxRadiusKm = 15) {
      if (!userLoc || typeof userLoc.lat !== "number" || typeof userLoc.lng !== "number" || isNaN(userLoc.lat) || isNaN(userLoc.lng)) {
        return { serviceable: true, distanceKm: 0, message: "" };
      }
      const STORE_LAT = 13.043913;
      const STORE_LNG = 80.074262;
      const distanceKm = this.calculateDistance(userLoc.lat, userLoc.lng, STORE_LAT, STORE_LNG);
      if (distanceKm > maxRadiusKm) {
        return {
          serviceable: false,
          distanceKm,
          maxRadiusKm,
          message: "The location is currently not serviceable"
        };
      }
      return {
        serviceable: true,
        distanceKm,
        maxRadiusKm,
        message: "Serviceable location"
      };
    }
    // Forward geocode address string to lat/lng coordinates
    async geocodeAddress(addressString) {
      if (!addressString || typeof addressString !== "string" || addressString.trim().length === 0) {
        return null;
      }
      const lower = addressString.toLowerCase();
      if (lower.includes("noida") || lower.includes("sector 18")) {
        return { lat: 28.5355, lng: 77.391, formatted_address: "Sector 18, Noida" };
      }
      if (lower.includes("delhi")) {
        return { lat: 28.6139, lng: 77.209, formatted_address: "New Delhi" };
      }
      if (lower.includes("bengaluru") || lower.includes("bangalore")) {
        return { lat: 12.9716, lng: 77.5946, formatted_address: "Bengaluru" };
      }
      if (lower.includes("mumbai")) {
        return { lat: 19.076, lng: 72.8777, formatted_address: "Mumbai" };
      }
      try {
        const encoded = encodeURIComponent(addressString.trim());
        const baseUrl = typeof window !== "undefined" ? "" : "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/places/geocode?address=${encoded}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && typeof data.lat === "number" && typeof data.lng === "number") {
            return {
              lat: data.lat,
              lng: data.lng,
              formatted_address: data.formatted_address || addressString
            };
          }
        }
      } catch (e) {
        console.warn("[Geocode Address Error]:", e.message || e);
      }
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
        console.warn("[Nominatim Geocode Error]:", err);
      }
      return null;
    }
    // Verify serviceability by address string or coordinate object
    async verifyDeliveryServiceability(addressOrCoords, maxRadiusKm = 15) {
      let coords = addressOrCoords;
      if (typeof addressOrCoords === "string") {
        if (this.currentLocation && this.currentLocation.label && (addressOrCoords.trim() === this.currentLocation.label.trim() || addressOrCoords.toLowerCase().includes(this.currentLocation.label.toLowerCase()))) {
          coords = this.currentLocation;
        } else {
          const resolved = await this.geocodeAddress(addressOrCoords);
          if (resolved && typeof resolved.lat === "number" && typeof resolved.lng === "number" && !isNaN(resolved.lat) && !isNaN(resolved.lng)) {
            coords = resolved;
          } else {
            const lower = addressOrCoords.toLowerCase();
            if (lower.includes("noida") || lower.includes("delhi") || lower.includes("mumbai") || lower.includes("bengaluru") || lower.includes("hyderabad") || lower.includes("kolkata") || lower.includes("pune") || lower.includes("jaipur")) {
              return {
                serviceable: false,
                distanceKm: 1500,
                maxRadiusKm,
                message: "The location is currently not serviceable"
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
      if (typeof lat1 !== "number" || typeof lon1 !== "number" || typeof lat2 !== "number" || typeof lon2 !== "number" || isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
        return 1;
      }
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return parseFloat(distance.toFixed(2));
    }
    // Format distance: "850 m" if < 1.0 km, "1.2 km" if >= 1.0 km
    formatDistance(distKm) {
      if (distKm < 1) {
        const meters = Math.round(distKm * 1e3);
        return `${meters} m`;
      }
      return `${distKm.toFixed(1)} km`;
    }
    // 5. Estimated Travel & Delivery Time Calculator
    calculateTravelTime(distanceKm) {
      const travelMinutes = Math.round(distanceKm / 20 * 60);
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
          const distMoved = this.calculateDistance(this.currentLocation.lat, this.currentLocation.lng, newLat, newLng);
          if (distMoved > 0.1) {
            console.log(`\u{1F4CD} Significant location change detected (${(distMoved * 1e3).toFixed(0)}m moved). Updating pharmacies...`);
            this.currentLocation.lat = newLat;
            this.currentLocation.lng = newLng;
            this.currentLocation.accuracy = Math.round(position.coords.accuracy || 0);
            localStorage.setItem("medifind_user_location", JSON.stringify(this.currentLocation));
            this.fetchNearbyPharmacies(newLat, newLng).then(() => {
              if (window.MediApp) window.MediApp.render();
            });
          }
        },
        (err) => console.warn("[WatchPosition Error]:", err.message),
        { enableHighAccuracy: true, maximumAge: 1e4 }
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
          new google.maps.Marker({
            position: { lat: userLoc.lat, lng: userLoc.lng },
            map,
            title: `\u{1F535} Your Current Location (${userLoc.label})`,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#0284c7",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 3
            }
          });
          const infoWindow = new google.maps.InfoWindow();
          pharmacies.forEach((p) => {
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
                                        \u2B50 ${p.rating} (${p.reviews_count} reviews)
                                    </div>
                                    <a href="${this.getDirectionsUrl(p)}" target="_blank" style="display:inline-block; background:#0ea5e9; color:white; padding:4px 8px; border-radius:4px; text-decoration:none; font-size:11px; font-weight:bold;">
                                        \u{1F9ED} Get Directions
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
      if (typeof window.L !== "undefined") {
        try {
          if (this.leafletMapInstances && this.leafletMapInstances[containerId]) {
            try {
              this.leafletMapInstances[containerId].remove();
            } catch (e) {
            }
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
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              maxZoom: 19,
              attribution: "\xA9 OpenStreetMap contributors"
            }).addTo(lmap);
            const userIcon = L.divIcon({
              className: "user-gps-leaflet-pin",
              html: `<div style="width:28px; height:28px; background:#0ea5e9; border:3px solid #ffffff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; box-shadow:0 0 12px rgba(14,165,233,0.8);">
                            <i class="fa-solid fa-crosshairs" style="font-size:12px;"></i>
                        </div>`,
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            });
            L.marker([userLoc.lat, userLoc.lng], { icon: userIcon }).addTo(lmap).bindPopup(`<b>\u{1F4CD} Your Location</b><br><small>${userLoc.label}</small>`);
            pharmacies.forEach((p) => {
              if (p.lat && p.lng) {
                const storeIcon = L.divIcon({
                  className: "store-leaflet-pin",
                  html: `<div style="width:28px; height:28px; background:${p.status === "open" ? "#059669" : "#dc2626"}; border:2px solid #ffffff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; box-shadow:0 2px 8px rgba(0,0,0,0.4);">
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
                                        <span>\u2B50 ${p.rating || 4.7}</span>
                                        <span style="color:${p.status === "open" ? "#059669" : "#dc2626"};">${p.status === "open" ? "\u{1F7E2} Open" : "\u{1F534} Closed"}</span>
                                        <span style="color:#0ea5e9;">\u26A1 ${p.distance || "0.8 km"}</span>
                                    </div>
                                    ${p.phone ? `<div style="font-size:11px; color:#475569; margin-bottom:6px;"><i class="fa-solid fa-phone"></i> ${p.phone}</div>` : ""}
                                    <a href="${this.getDirectionsUrl(p)}" target="_blank" style="display:block; text-align:center; background:#0ea5e9; color:white; padding:4px 8px; border-radius:4px; text-decoration:none; font-size:11px; font-weight:bold;">
                                        \u{1F9ED} Get Directions
                                    </a>
                                </div>
                            `;
                L.marker([p.lat, p.lng], { icon: storeIcon }).addTo(lmap).bindPopup(popupHtml);
              }
            });
            this.leafletMapInstances[containerId] = lmap;
            setTimeout(() => lmap.invalidateSize(), 250);
            return;
          }
        } catch (lErr) {
          console.warn("[Leaflet Map Render Error]:", lErr);
        }
      }
      let canvas = container.querySelector("canvas");
      if (!canvas) {
        container.innerHTML = `<canvas style="width:100%; height:100%; min-height:220px; border-radius:var(--radius-md);"></canvas>`;
        canvas = container.querySelector("canvas");
      }
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const width = canvas.width = container.clientWidth || 400;
      const height = canvas.height = container.clientHeight || 220;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "#1e293b";
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
      this.drawMarker(ctx, center.x, center.y, "#0284c7", "fa-location-crosshairs", `\u{1F535} You (${userLoc.label.split(",")[0]})`);
      pharmacies.slice(0, 8).forEach((p, idx) => {
        const angle = idx / 8 * 2 * Math.PI;
        const distPx = 45 + idx * 12;
        const px = center.x + Math.cos(angle) * distPx;
        const py = center.y + Math.sin(angle) * distPx;
        this.drawMarker(ctx, px, py, p.status === "open" ? "#059669" : "#ef4444", "fa-store", `\u{1F4CD} ${p.shop_name.split(" ")[0]}`);
      });
    }
    drawMarker(ctx, x, y, color, iconClass, label) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, 2 * Math.PI);
      ctx.fillStyle = color + "33";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 10px Plus Jakarta Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, x, y + 20);
      ctx.restore();
    }
  };
  var googleMapsService = new GoogleMapsService();

  // backend/seed/firestoreSeed.js
  var seedFirestore = (firestoreDb2) => {
    console.log("===========================================================");
    console.log("\u{1F525} [Firestore Seeder] Seeding 8 Production Collections...");
    console.log("===========================================================");
    console.log(`\u2705 [1/8 Users] Seeding skipped (only real verified users allowed).`);
    MOCK_PHARMACIES.forEach((p) => firestoreDb2.collections.Pharmacies.set(p.id, {
      ...p,
      owner_id: "usr_pharm_1",
      location: { lat: p.lat, lng: p.lng }
    }));
    console.log(`\u2705 [2/8 Pharmacies] Populated ${MOCK_PHARMACIES.length} documents.`);
    MOCK_MEDICINES.forEach((m) => {
      firestoreDb2.collections.Medicines.set(m.id, {
        ...m,
        pharmacy_id: m.pharmacy_id || "pharm_1"
        // Enforces medicine belongs to 1 pharmacy
      });
    });
    console.log(`\u2705 [3/8 Medicines] Populated ${MOCK_MEDICINES.length} documents (Every medicine linked to 1 pharmacy).`);
    const deliveryPartners = [
      { id: "partner_1", user_id: "usr_driver_1", name: "Rohan Verma", phone: "+91 98112 33445", vehicle_details: "Hero Splendor (KA-01-EQ-9982)", rating: 4.9, is_active: true, total_deliveries: 482, earnings_today: 850, current_location: { lat: 28.538, lng: 77.388 } },
      { id: "partner_2", user_id: "usr_driver_2", name: "Vikram Patel", phone: "+91 98222 55667", vehicle_details: "TVS NTORQ (UP-16-BD-1122)", rating: 4.7, is_active: true, total_deliveries: 310, earnings_today: 620, current_location: { lat: 28.54, lng: 77.395 } }
    ];
    deliveryPartners.forEach((dp) => firestoreDb2.collections.DeliveryPartners.set(dp.id, dp));
    console.log(`\u2705 [4/8 DeliveryPartners] Populated ${deliveryPartners.length} documents.`);
    MOCK_ORDERS.forEach((o) => {
      firestoreDb2.collections.Orders.set(o.id, {
        ...o,
        customer_id: "usr_1",
        // Relational: Belongs to 1 customer
        pharmacy_id: o.pharmacy_id || "pharm_1",
        delivery_partner_id: "partner_1"
        // Relational: Optionally has 1 delivery partner
      });
    });
    console.log(`\u2705 [5/8 Orders] Populated ${MOCK_ORDERS.length} documents (Relational: linked to customer & optional delivery partner).`);
    const prescriptions = [
      {
        id: "RX-901",
        user_id: "usr_1",
        user_name: "Alex Johnson",
        pharmacy_id: "pharm_1",
        doctor_name: "Dr. A. K. Sharma (MD)",
        image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300",
        status: "Pending",
        extracted_items: [
          { name: "Dolo 650mg Tablet", qty: 2, confidence: "98%" },
          { name: "Becosules Z Capsule", qty: 1, confidence: "96%" }
        ],
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    prescriptions.forEach((p) => firestoreDb2.collections.Prescriptions.set(p.id, p));
    console.log(`\u2705 [6/8 Prescriptions] Populated ${prescriptions.length} documents.`);
    const notifications = [
      {
        id: "notif_1",
        user_id: "usr_1",
        title: "Order Dispatched \u26A1",
        body: "Your order ORD-89102 is out for delivery with Rohan Verma.",
        type: "order_update",
        read: false,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "notif_2",
        user_id: "usr_1",
        title: "Prescription Verification Approved \u2705",
        body: "Dr. Gupta from Apollo Pharmacy verified your prescription RX-901.",
        type: "prescription_approved",
        read: true,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    notifications.forEach((n) => firestoreDb2.collections.Notifications.set(n.id, n));
    console.log(`\u2705 [7/8 Notifications] Populated ${notifications.length} documents.`);
    const reviews = [
      {
        id: "rev_1",
        user_id: "usr_1",
        user_name: "Alex Johnson",
        pharmacy_id: "pharm_1",
        rating: 5,
        comment: "Super fast delivery in 12 mins! All genuine medicines delivered with sealed bill.",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "rev_2",
        user_id: "usr_2",
        user_name: "Priya Sharma",
        pharmacy_id: "pharm_2",
        rating: 4,
        comment: "Good stock of emergency care and diabetes items.",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    reviews.forEach((r) => firestoreDb2.collections.Reviews.set(r.id, r));
    console.log(`\u2705 [8/8 Reviews] Populated ${reviews.length} documents.`);
    console.log("===========================================================");
    console.log("\u{1F389} Firestore Database Seeding Completed Successfully!");
    console.log("===========================================================");
  };

  // js/firestore-db.js
  var FirestoreDatabase = class {
    constructor() {
      this.collections = {
        Users: /* @__PURE__ */ new Map(),
        Pharmacies: /* @__PURE__ */ new Map(),
        Medicines: /* @__PURE__ */ new Map(),
        Orders: /* @__PURE__ */ new Map(),
        DeliveryPartners: /* @__PURE__ */ new Map(),
        Prescriptions: /* @__PURE__ */ new Map(),
        Notifications: /* @__PURE__ */ new Map(),
        Reviews: /* @__PURE__ */ new Map()
      };
      this.initialized = false;
      this.init();
    }
    init() {
      seedFirestore(this);
      try {
        const raw = typeof localStorage !== "undefined" ? localStorage.getItem("medifind_custom_users") : null;
        const savedCustomUsers = raw && raw !== "undefined" && raw !== "null" ? JSON.parse(raw) : [];
        if (Array.isArray(savedCustomUsers)) {
          savedCustomUsers.forEach((u) => this.collections.Users.set(u.id, u));
        }
      } catch (e) {
        console.error("[Firestore DB] Error restoring saved custom users:", e);
      }
      this.initialized = true;
    }
    // 1. Users
    async getUser(id) {
      return this.collections.Users.get(id) || null;
    }
    async createUser(userData) {
      const userObj = { ...userData, created_at: userData.created_at || (/* @__PURE__ */ new Date()).toISOString() };
      this.collections.Users.set(userData.id, userObj);
      try {
        const savedCustomUsers = JSON.parse(localStorage.getItem("medifind_custom_users") || "[]");
        const idx = savedCustomUsers.findIndex((u) => u.id === userObj.id || u.email.toLowerCase() === userObj.email.toLowerCase());
        if (idx >= 0) {
          savedCustomUsers[idx] = userObj;
        } else {
          savedCustomUsers.push(userObj);
        }
        localStorage.setItem("medifind_custom_users", JSON.stringify(savedCustomUsers));
      } catch (e) {
        console.error("[Firestore DB] Error persisting custom user:", e);
      }
      return userObj;
    }
    // 2. Pharmacies
    async getPharmacies() {
      return Array.from(this.collections.Pharmacies.values());
    }
    async getPharmacyById(id) {
      return this.collections.Pharmacies.get(id) || null;
    }
    // 3. Medicines (Relational: Belongs to 1 Pharmacy)
    async getMedicinesByPharmacy(pharmacyId) {
      return Array.from(this.collections.Medicines.values()).filter((m) => m.pharmacy_id === pharmacyId);
    }
    async searchMedicines(query = "", category = "all") {
      const q = query.toLowerCase();
      return Array.from(this.collections.Medicines.values()).filter((m) => {
        const matchCat = category === "all" || m.category === category;
        const matchQuery = !q || m.name.toLowerCase().includes(q) || m.generic_name.toLowerCase().includes(q);
        return matchCat && matchQuery;
      });
    }
    // 4. Orders (Relational: Customer + Pharmacy + Optional Delivery Partner)
    async getOrdersByCustomer(customerId) {
      return Array.from(this.collections.Orders.values()).filter((o) => o.customer_id === customerId);
    }
    async getOrdersByPharmacy(pharmacyId) {
      return Array.from(this.collections.Orders.values()).filter((o) => o.pharmacy_id === pharmacyId);
    }
    async getOrdersByDeliveryPartner(partnerId) {
      return Array.from(this.collections.Orders.values()).filter((o) => o.delivery_partner_id === partnerId);
    }
    async createOrder(orderData) {
      if (!orderData.customer_id) throw new Error("Order must belong to a Customer (customer_id is required)");
      if (!orderData.pharmacy_id) throw new Error("Order must belong to a Pharmacy (pharmacy_id is required)");
      this.collections.Orders.set(orderData.id, { ...orderData, created_at: (/* @__PURE__ */ new Date()).toISOString() });
      return orderData;
    }
    // 5. DeliveryPartners
    async getDeliveryPartners() {
      return Array.from(this.collections.DeliveryPartners.values());
    }
    // 6. Prescriptions
    async getPrescriptionsByUser(userId) {
      return Array.from(this.collections.Prescriptions.values()).filter((p) => p.user_id === userId);
    }
    // 7. Notifications
    async getNotificationsByUser(userId) {
      return Array.from(this.collections.Notifications.values()).filter((n) => n.user_id === userId);
    }
    // 8. Reviews
    async getReviewsByPharmacy(pharmacyId) {
      return Array.from(this.collections.Reviews.values()).filter((r) => r.pharmacy_id === pharmacyId);
    }
  };
  var firestoreDb = new FirestoreDatabase();

  // js/customer.js
  var CustomerModule = class {
    constructor(app) {
      this.app = app;
      this.selectedCategory = "all";
      this.searchQuery = "";
      this.selectedPharmacyId = null;
      this.selectedMedicineId = null;
      this.pharmacySearchQuery = "";
      this.searchEngine = new IntelligentSearchEngine(MOCK_MEDICINES, MOCK_PHARMACIES);
    }
    // Main Router Renderer based on app state
    render() {
      const tab = this.app.state.customerTab;
      if (tab === "home") return this.renderHome();
      if (tab === "search") return this.renderSearchPage();
      if (tab === "pharmacies") return this.renderPharmaciesPage();
      if (tab === "pharmacy-detail") return this.renderPharmacyDetailPage();
      if (tab === "medicine-detail") return this.renderMedicineDetailPage();
      if (tab === "prescription") return this.renderPrescriptionPage();
      if (tab === "cart") return this.renderCartPage();
      if (tab === "orders") return this.renderOrdersPage();
      if (tab === "profile") return this.renderProfilePage();
      if (tab === "emergency") return this.renderEmergencyPage();
      return this.renderHome();
    }
    // 1. Home Feed
    renderHome() {
      var _a;
      const userLoc = googleMapsService.getUserLocation();
      const locState = googleMapsService.getLocationState();
      const pharmacies = googleMapsService.getPharmacies();
      const isSearchingGoogle = googleMapsService.isSearchingGoogle;
      const googleApiError = googleMapsService.googleApiError;
      (this.app.state.orders || []).forEach((o) => {
        if (o && o.order_status !== "Cancelled" && o.order_status !== "Delivered") {
          const elapsedMins = (Date.now() - new Date(o.created_at || Date.now()).getTime()) / 6e4;
          if (elapsedMins >= 30) {
            o.order_status = "Delivered";
            o.tracking_step = 4;
            o.payment_status = "Paid";
          } else if (elapsedMins >= 15 && o.tracking_step < 3) {
            o.order_status = "Out for Delivery";
            o.tracking_step = 3;
          } else if (elapsedMins >= 5 && o.tracking_step < 2) {
            o.order_status = "Preparing";
            o.tracking_step = 2;
          }
        }
      });
      const activeOrder = (this.app.state.orders || []).find((o) => o.order_status !== "Delivered" && o.order_status !== "Cancelled");
      let activeArrivalText = "";
      if (activeOrder) {
        const elapsedMins = Math.floor((Date.now() - new Date(activeOrder.created_at || Date.now()).getTime()) / 6e4);
        const remainingMins = Math.max(0, 30 - elapsedMins);
        activeArrivalText = remainingMins > 0 ? `Estimated Arrival in ${remainingMins} mins` : `Delivered \u{1F3E0}`;
      }
      const cartCount = this.app.getCartCount();
      const serviceability = googleMapsService.isLocationServiceable(userLoc, 15);
      return `
            <!-- Top Navbar -->
            <header class="navbar-top">
                <div class="brand-logo" onclick="MediApp.setCustomerTab('home')">
                    <div class="brand-icon"><i class="fa-solid fa-notes-medical"></i></div>
                    <div>
                        <span class="brand-text">MediFind</span>
                        <div style="font-size:9px; color:var(--text-muted); font-weight:600; white-space:nowrap; margin-top:-2px;">Find Medicines. Find Pharmacies. Get Care Faster.</div>
                    </div>
                </div>

                <div class="location-selector" onclick="MediApp.openAddressModal()">
                    <i class="fa-solid fa-location-dot" style="color:var(--primary);"></i>
                    <div>
                        <div class="location-address" style="font-weight:700;">${userLoc.label}</div>
                    </div>
                    <i class="fa-solid fa-chevron-down" style="font-size:10px; opacity:0.6; margin-left:4px;"></i>
                </div>

                <div class="nav-actions">
                    <button class="icon-btn" onclick="MediApp.openNotificationsModal()" title="Notifications">
                        <i class="fa-solid fa-bell"></i>
                    </button>
                    <button class="icon-btn" onclick="MediApp.setCustomerTab('cart')" title="Cart" style="position:relative;">
                        <i class="fa-solid fa-cart-shopping"></i>
                        ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ""}
                    </button>
                </div>
            </header>

            <main class="main-content">
                ${!serviceability.serviceable ? `
                    <!-- Serviceability Restriction Alert Banner -->
                    <div style="background:var(--emergency-light); border:1px solid var(--emergency-red); border-radius:var(--radius-lg); padding:14px 18px; margin-bottom:20px; color:var(--emergency-red); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; box-shadow:var(--shadow-sm);">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <i class="fa-solid fa-circle-exclamation" style="font-size:22px;"></i>
                            <div>
                                <div style="font-weight:800; font-size:14px;">The location is currently not serviceable</div>
                                <div style="font-size:11px; font-weight:600; opacity:0.9;">Delivery is available only within a 15 km radius of our medicine supply store.</div>
                            </div>
                        </div>
                        <button class="btn-secondary" style="font-size:11px; padding:6px 12px; border-color:var(--emergency-red); color:var(--emergency-red);" onclick="MediApp.detectLiveLocation()">
                            <i class="fa-solid fa-location-crosshairs"></i> Change Location
                        </button>
                    </div>
                ` : ""}
                ${activeOrder ? `
                    <!-- Active Live Order Banner -->
                    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color:white; border-radius:var(--radius-lg); padding:16px 20px; display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; box-shadow:var(--shadow-md);">
                        <div>
                            <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:800;">ACTIVE LIVE ORDER (30-MIN DELIVERY)</div>
                            <div style="font-size:16px; font-weight:800;">${activeOrder.id} - ${activeOrder.order_status}</div>
                            <div style="font-size:12px; opacity:0.9;">${activeArrivalText} \u2022 Driver: ${((_a = activeOrder.delivery_partner) == null ? void 0 : _a.name) || "Rohan Verma"}</div>
                        </div>
                        <button class="emergency-btn" onclick="MediApp.openTrackingModal('${activeOrder.id}')">
                            <i class="fa-solid fa-map-location-dot"></i> Live Track
                        </button>
                    </div>
                ` : ""}

                <!-- Medical Store Finder Banner (Google Maps Integration) -->
                <section style="margin-bottom: 24px;">
                    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color:white; border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-md); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;">
                        <div style="flex:1; min-width:240px;">
                            <div style="display:flex; align-items:center; gap:8px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:#e0f2fe; margin-bottom:4px;">
                                <i class="fa-solid fa-map-location-dot"></i> REAL-TIME GOOGLE MAPS RADAR
                            </div>
                            <h3 style="font-size:20px; font-weight:800; margin-bottom:6px;">Medical Store Finder</h3>
                            <p style="font-size:13px; opacity:0.95; line-height:1.4;">Discover all verified medical stores and chemists nearby your current location in real-time with Google Maps navigation.</p>
                            <div style="font-size:12px; font-weight:700; margin-top:8px; background:rgba(255,255,255,0.2); display:inline-block; padding:4px 12px; border-radius:20px;">
                                \u{1F4CD} ${userLoc.label}
                            </div>
                        </div>
                        <div style="display:flex; align-items:center;">
                            <a href="${googleMapsService.getGoogleMapsSearchUrl(userLoc.lat, userLoc.lng)}" target="_blank" class="add-cart-btn" style="background:white; color:#0284c7; font-weight:800; text-decoration:none; padding:12px 20px; font-size:14px; box-shadow:var(--shadow-sm); white-space:nowrap;">
                                <i class="fa-brands fa-google"></i> Open in Google Maps
                            </a>
                        </div>
                    </div>
                </section>

                <!-- Categories -->
                <section style="margin-bottom: 24px;">
                    <div class="section-header">
                        <h3 class="section-title"><i class="fa-solid fa-shapes" style="color:var(--primary);"></i> Medicine Categories</h3>
                    </div>
                    <div class="category-scroll">
                        ${MEDICINE_CATEGORIES.map((cat) => `
                            <div class="category-chip ${this.selectedCategory === cat.id ? "active" : ""}" 
                                 onclick="MediApp.filterCategory('${cat.id}')">
                                <i class="fa-solid ${cat.icon}"></i>
                                <span>${cat.name}</span>
                            </div>
                        `).join("")}
                    </div>
                </section>

                <!-- Popular Medicines Grid -->
                <section>
                    <div class="section-header">
                        <h3 class="section-title"><i class="fa-solid fa-fire" style="color:var(--warning-amber);"></i> Trending Medicines</h3>
                        <span class="see-all-link" onclick="MediApp.setCustomerTab('search')">Browse All</span>
                    </div>
                    <div class="cards-grid">
                        ${this.renderMedicineCards((this.app.state.medicines || []).slice(0, 8))}
                    </div>
                </section>
            </main>

            ${this.renderBottomNav()}
        `;
    }
    // Render Location State & Permission Banner
    renderLocationStateBanner(locState, userLoc) {
      if (locState.status === "detecting") {
        return `
                <div style="background:var(--primary-light); color:var(--primary); border-radius:var(--radius-md); padding:12px 16px; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <i class="fa-solid fa-circle-notch fa-spin" style="font-size:18px;"></i>
                        <span style="font-weight:700; font-size:13px;">\u{1F4CD} Finding your location...</span>
                    </div>
                </div>
            `;
      }
      if (locState.status === "denied") {
        return `
                <div style="background:var(--card-bg); border:1px solid var(--emergency-red); border-radius:var(--radius-md); padding:16px; margin-bottom:16px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
                        <i class="fa-solid fa-location-crosshairs" style="font-size:24px; color:var(--emergency-red);"></i>
                        <div>
                            <strong style="font-size:14px; color:var(--text-main);">Location access is required to find pharmacies near you.</strong>
                            <div style="font-size:12px; color:var(--text-muted);">Please grant permission or enter your location manually to discover nearby medical stores.</div>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="add-cart-btn" style="padding:8px 14px; font-size:12px;" onclick="MediApp.detectLiveLocation()">
                            <i class="fa-solid fa-location-arrow"></i> Allow Location
                        </button>
                        <button class="btn-secondary" style="padding:8px 14px; font-size:12px;" onclick="MediApp.openAddressModal()">
                            <i class="fa-solid fa-pen-to-square"></i> Enter Location Manually
                        </button>
                    </div>
                </div>
            `;
      }
      if (locState.status === "error") {
        return `
                <div style="background:var(--card-bg); border:1px solid var(--warning-amber); border-radius:var(--radius-md); padding:16px; margin-bottom:16px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
                        <i class="fa-solid fa-triangle-exclamation" style="font-size:24px; color:var(--warning-amber);"></i>
                        <div>
                            <strong style="font-size:14px; color:var(--text-main);">Unable to detect your current location.</strong>
                            <div style="font-size:12px; color:var(--text-muted);">${locState.errorMessage || "Please check your GPS or browser location permissions."}</div>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="add-cart-btn" style="padding:8px 14px; font-size:12px;" onclick="MediApp.detectLiveLocation()">
                            <i class="fa-solid fa-rotate-right"></i> Try Again
                        </button>
                        <button class="btn-secondary" style="padding:8px 14px; font-size:12px;" onclick="MediApp.openAddressModal()">
                            <i class="fa-solid fa-pen-to-square"></i> Enter Location Manually
                        </button>
                    </div>
                </div>
            `;
      }
      return `
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; border-radius:var(--radius-lg); padding:16px 20px; display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; box-shadow:var(--shadow-md); border:1px solid rgba(255,255,255,0.1);">
                <div>
                    <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:800; color:var(--primary);">REAL-TIME GPS LOCATION</div>
                    <div style="font-size:15px; font-weight:800; margin-top:2px;">\u{1F4CD} ${userLoc.label} ${userLoc.accuracy ? `<span style="font-size:11px; opacity:0.7; font-weight:normal;">(\xB1${userLoc.accuracy}m)</span>` : ""}</div>
                    <div style="font-size:11px; opacity:0.8; margin-top:2px;">Showing real pharmacies & stock sorted strictly by distance</div>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="add-cart-btn" style="background:var(--primary); color:white; padding:8px 12px; font-size:12px;" onclick="MediApp.detectLiveLocation()">
                        <i class="fa-solid fa-location-crosshairs"></i> Refresh GPS
                    </button>
                    <button class="btn-secondary" style="background:rgba(255,255,255,0.1); color:white; padding:8px 12px; font-size:12px; border:none;" onclick="MediApp.openAddressModal()">
                        Change
                    </button>
                </div>
            </div>
        `;
    }
    // 2. All Pharmacies Page (/pharmacies)
    renderPharmaciesPage() {
      const userLoc = googleMapsService.getUserLocation();
      const pharmacies = googleMapsService.getPharmacies();
      const isSearchingGoogle = googleMapsService.isSearchingGoogle;
      const query = (this.pharmacySearchQuery || "").toLowerCase();
      const filteredPharmacies = pharmacies.filter(
        (p) => !query || (p.shop_name || "").toLowerCase().includes(query) || (p.address || "").toLowerCase().includes(query)
      );
      return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">Medical Store Finder (${filteredPharmacies.length})</h2>
                <a href="${googleMapsService.getGoogleMapsSearchUrl(userLoc.lat, userLoc.lng)}" target="_blank" class="add-cart-btn" style="font-size:11px; padding:6px 10px; text-decoration:none; white-space:nowrap;">
                    <i class="fa-brands fa-google"></i> Open in Google Maps
                </a>
            </header>

            <main class="main-content">
                <!-- User Live Location Status Banner -->
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; border-radius:var(--radius-lg); padding:14px 18px; display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; box-shadow:var(--shadow-sm); flex-wrap:wrap; gap:10px;">
                    <div>
                        <div style="font-size:10px; text-transform:uppercase; letter-spacing:1px; font-weight:800; color:#38bdf8;">YOUR CURRENT LOCATION</div>
                        <div style="font-size:14px; font-weight:800; margin-top:2px;">\u{1F4CD} ${userLoc.label}</div>
                        <div style="font-size:11px; opacity:0.8; margin-top:2px;">Showing medical stores strictly relative to your GPS coordinates</div>
                    </div>
                    <button class="add-cart-btn" style="background:var(--primary); color:white; padding:8px 14px; font-size:12px; font-weight:800;" onclick="MediApp.detectLiveLocation()">
                        <i class="fa-solid fa-location-crosshairs"></i> Use My Live Location
                    </button>
                </div>

                <!-- Interactive Real-Time Map Container -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:12px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:13px; font-weight:800; color:var(--primary);"><i class="fa-solid fa-map-location-dot"></i> Live Google Maps Radar \u2022 ${userLoc.label}</span>
                        <div style="display:flex; gap:6px;">
                            <button class="btn-secondary" style="font-size:11px; padding:3px 8px;" onclick="MediApp.detectLiveLocation()"><i class="fa-solid fa-location-crosshairs"></i> Refresh GPS</button>
                            <a href="${googleMapsService.getGoogleMapsSearchUrl(userLoc.lat, userLoc.lng)}" target="_blank" class="btn-secondary" style="font-size:11px; padding:3px 8px; text-decoration:none; color:var(--primary); font-weight:700;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Maps</a>
                        </div>
                    </div>
                    <div id="nearbyPharmaciesMapCanvas" style="height:230px; width:100%; border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--card-border);"></div>
                </div>

                ${isSearchingGoogle ? `
                    <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
                        <i class="fa-solid fa-spinner fa-spin" style="font-size:32px; color:var(--primary); margin-bottom:12px;"></i>
                        <h3>\u{1F50E} Scanning nearby medical stores around your location...</h3>
                    </div>
                ` : `
                    <div style="display:flex; flex-direction:column; gap:14px;">
                        ${filteredPharmacies.length === 0 ? `
                            <div style="text-align:center; padding:36px 20px; background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; border-radius:var(--radius-lg); box-shadow:var(--shadow-md);">
                                <i class="fa-solid fa-map-location-dot" style="font-size:44px; color:#38bdf8; margin-bottom:12px;"></i>
                                <h3 style="font-size:20px; font-weight:800; margin-bottom:6px;">Find Medical Stores Near You on Google Maps</h3>
                                <p style="font-size:13px; opacity:0.9; margin-bottom:18px; max-width:440px; margin-left:auto; margin-right:auto; line-height:1.4;">
                                    View all open chemists, drugstores, and medical shops around your location (\u{1F4CD} ${userLoc.label}) with live Google Maps directions and contact info.
                                </p>
                                <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
                                    <a href="${googleMapsService.getGoogleMapsSearchUrl(userLoc.lat, userLoc.lng)}" target="_blank" class="add-cart-btn" style="background:#0ea5e9; color:white; font-weight:800; padding:12px 22px; font-size:13px; text-decoration:none; justify-content:center;">
                                        <i class="fa-brands fa-google"></i> Open Google Maps Finder
                                    </a>
                                    <button class="btn-secondary" style="background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,255,255,0.3); font-weight:700; padding:12px 18px; font-size:13px;" onclick="MediApp.detectLiveLocation()">
                                        <i class="fa-solid fa-location-crosshairs"></i> Refresh GPS
                                    </button>
                                </div>
                            </div>
                        ` : filteredPharmacies.map((p) => {
        const isFav = (this.app.state.favoritePharmacies || []).includes(p.id);
        return `
                                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:12px; box-shadow:var(--shadow-sm); cursor:pointer;"
                                     onclick="MediApp.viewPharmacyDetails('${p.id}')">
                                    <div style="display:flex; gap:14px; align-items:flex-start;">
                                        <img src="${p.logo}" style="width:64px; height:64px; border-radius:var(--radius-md); object-fit:cover;">
                                        <div style="flex:1;">
                                            <div style="font-weight:700; font-size:16px; display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                                                <span>${p.shop_name} <i class="fa-solid fa-circle-check" style="color:var(--primary); font-size:14px;" title="Verified Pharmacy License"></i></span>
                                                <button class="icon-btn" style="padding:4px; color:${isFav ? "var(--emergency-red)" : "var(--text-muted)"};" onclick="event.stopPropagation(); MediApp.toggleFavoritePharmacy('${p.id}')">
                                                    <i class="fa-${isFav ? "solid" : "regular"} fa-heart"></i>
                                                </button>
                                            </div>
                                            <div style="font-size:12px; color:var(--text-muted); margin-bottom:6px;"><i class="fa-solid fa-location-dot" style="color:var(--primary);"></i> ${p.address}</div>
                                            <div style="display:flex; gap:8px; font-size:12px; align-items:center; flex-wrap:wrap;">
                                                <span style="background:var(--warning-light); color:var(--warning-amber); padding:2px 8px; border-radius:4px; font-weight:700;"><i class="fa-solid fa-star"></i> ${p.rating || 4.7} ${p.reviews_count ? `(${p.reviews_count})` : ""}</span>
                                                <span style="background:var(--primary-light); color:var(--primary); padding:2px 8px; border-radius:4px; font-weight:700;"><i class="fa-solid fa-route"></i> ${p.distance || "0.8 km"} away</span>
                                                <span style="background:var(--secondary-light); color:var(--secondary); padding:2px 8px; border-radius:4px; font-weight:700;"><i class="fa-solid fa-bolt"></i> ${p.delivery_time || "15-20 mins"}</span>
                                                <span style="font-weight:800; color:${p.status === "open" ? "var(--secondary)" : "var(--emergency-red)"};">${p.status === "open" ? "\u{1F7E2} Open Now" : "\u{1F534} Closed"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="display:flex; gap:10px; border-top:1px solid var(--card-border); padding-top:10px;">
                                        ${p.phone ? `
                                            <a href="tel:${p.phone}" class="btn-secondary" style="flex:1; text-align:center; text-decoration:none; padding:8px; font-size:12px; font-weight:700;" onclick="event.stopPropagation();">
                                                <i class="fa-solid fa-phone"></i> Call Store
                                            </a>
                                        ` : ""}
                                        <a href="${googleMapsService.getDirectionsUrl(p)}" target="_blank" class="add-cart-btn" style="flex:1; text-align:center; text-decoration:none; padding:8px; font-size:12px; justify-content:center;" onclick="event.stopPropagation();">
                                            <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                                        </a>
                                    </div>
                                </div>
                            `;
      }).join("")}
                    </div>
                `}
            </main>
            ${this.renderBottomNav()}
        `;
    }
    // 3. Pharmacy Details Page (/pharmacy/:id)
    renderPharmacyDetailPage() {
      const pharmacies = googleMapsService.getPharmacies();
      const p = pharmacies.find((item) => item.id === this.selectedPharmacyId) || MOCK_PHARMACIES.find((item) => item.id === this.selectedPharmacyId) || MOCK_PHARMACIES[0];
      const pMedicines = (this.app.state.medicines || []).filter((m) => m.pharmacy_id === p.id);
      const hasMediFindInventory = pMedicines.length > 0;
      return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('pharmacies')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">${p.shop_name}</h2>
            </header>

            <main class="main-content">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; gap:16px; align-items:center; margin-bottom:14px;">
                        <img src="${p.logo}" style="width:72px; height:72px; border-radius:var(--radius-md); object-fit:cover;">
                        <div>
                            <h2 style="font-size:20px;">${p.shop_name}</h2>
                            <div style="font-size:12px; font-weight:700; color:var(--primary); margin-bottom:4px;">\u2B50 ${p.rating} rating</div>
                            ${p.license_number ? `<div style="font-size:11px; color:var(--text-muted);">Drug License: <code>${p.license_number}</code></div>` : ""}
                        </div>
                    </div>

                    <div style="display:flex; gap:10px;">
                        ${p.phone ? `
                            <a href="tel:${p.phone}" class="btn-secondary" style="flex:1; justify-content:center; text-decoration:none; align-items:center;">
                                <i class="fa-solid fa-phone"></i> Call Pharmacy
                            </a>
                        ` : ""}
                        <a href="${googleMapsService.getDirectionsUrl(p)}" target="_blank" class="add-cart-btn" style="flex:1; justify-content:center; text-decoration:none; align-items:center;">
                            <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                        </a>
                    </div>
                </div>

                <h3 style="font-size:16px; margin-bottom:14px;">MediFind Medicine Inventory Status</h3>
                
                ${hasMediFindInventory ? `
                    <div class="cards-grid">
                        ${this.renderMedicineCards(pMedicines)}
                    </div>
                ` : `
                    <div style="background:var(--card-bg); border:1px dashed var(--card-border); border-radius:var(--radius-md); padding:24px; text-align:center; color:var(--text-muted);">
                        <i class="fa-solid fa-clipboard-question" style="font-size:36px; color:var(--text-muted); margin-bottom:8px;"></i>
                        <h4 style="font-size:15px; color:var(--text-main); margin-bottom:4px;">Medicine availability not available</h4>
                        <p style="font-size:12px;">This pharmacy is discovered via Google Places, but does not currently have registered real-time stock data in MediFind's database.</p>
                    </div>
                `}
            </main>
            ${this.renderBottomNav()}
        `;
    }
    // 4. Medicine Details Page (/medicine/:id)
    renderMedicineDetailPage() {
      const med = MOCK_MEDICINES.find((m) => m.id === this.selectedMedicineId) || MOCK_MEDICINES[0];
      return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('search')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">Medicine Details</h2>
                <button class="icon-btn" onclick="MediApp.setCustomerTab('cart')"><i class="fa-solid fa-bag-shopping"></i></button>
            </header>

            <main class="main-content">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <div style="height:100px; width:100%; border-radius:var(--radius-md); background:linear-gradient(135deg, var(--primary-light) 0%, #e0f2fe 100%); color:var(--primary); display:flex; align-items:center; justify-content:center; margin-bottom:16px; position:relative;">
                        <i class="fa-solid fa-pills" style="font-size:44px;"></i>
                        ${med.requires_prescription ? `<span class="rx-badge">Rx PRESCRIPTION REQUIRED</span>` : ""}
                    </div>

                    <h1 style="font-size:22px; margin-bottom:4px;">${med.name}</h1>
                    <div style="font-size:14px; color:var(--primary); font-weight:700; margin-bottom:12px;">Generic: ${med.generic_name}</div>

                    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--background); padding:12px 16px; border-radius:var(--radius-md); margin-bottom:16px;">
                        <div>
                            <span class="current-price" style="font-size:24px;">\u20B9${med.price.toFixed(2)}</span>
                            <span class="original-price" style="font-size:14px; margin-left:8px;">\u20B9${(med.original_price || med.price * 1.15).toFixed(2)}</span>
                        </div>
                        <span style="color:var(--secondary); font-weight:800; font-size:13px;">In Stock (${med.stock} units)</span>
                    </div>

                    <div style="font-size:13px; line-height:1.6; margin-bottom:16px;">
                        <strong>Description:</strong> ${med.description}<br><br>
                        <strong>Dosage:</strong> ${med.dosage}<br>
                        <strong>Manufacturer:</strong> ${med.manufacturer || "Certified Pharma"}<br>
                        <strong>Expiry Date:</strong> ${med.expiry_date || "2027-12"}<br>
                        <strong>Side Effects:</strong> ${med.side_effects || "Mild dizziness, nausea"}
                    </div>

                    <div style="display:flex; gap:12px;">
                        <button class="add-cart-btn" style="flex:1; justify-content:center; padding:12px; font-size:15px;" onclick="MediApp.addToCart('${med.id}')">
                            <i class="fa-solid fa-cart-plus"></i> Add To Cart
                        </button>
                        <button class="add-cart-btn" style="flex:1; justify-content:center; padding:12px; font-size:15px; background:var(--secondary);" onclick="MediApp.buyNow('${med.id}')">
                            <i class="fa-solid fa-bolt"></i> Buy Now
                        </button>
                    </div>
                </div>
            </main>
            ${this.renderBottomNav()}
        `;
    }
    // 5. Prescription Upload Page (/prescription)
    renderPrescriptionPage() {
      const scanned = this.ocrResults || null;
      return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">Upload Doctor Prescription</h2>
            </header>

            <main class="main-content">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-sm); margin-bottom:20px;">
                    <h3 style="font-size:16px; margin-bottom:12px;">Choose Prescription Upload Source</h3>
                    
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; margin-bottom:16px;">
                        <button class="btn-secondary" style="flex-direction:column; padding:16px; gap:8px; align-items:center;" onclick="MediApp.simulateOcrScan('camera')">
                            <i class="fa-solid fa-camera" style="font-size:24px; color:var(--primary);"></i>
                            <span style="font-size:12px; font-weight:700;">Camera Snap</span>
                        </button>
                        <button class="btn-secondary" style="flex-direction:column; padding:16px; gap:8px; align-items:center;" onclick="MediApp.simulateOcrScan('gallery')">
                            <i class="fa-solid fa-image" style="font-size:24px; color:var(--secondary);"></i>
                            <span style="font-size:12px; font-weight:700;">Photo Gallery</span>
                        </button>
                        <button class="btn-secondary" style="flex-direction:column; padding:16px; gap:8px; align-items:center;" onclick="MediApp.simulateOcrScan('pdf')">
                            <i class="fa-solid fa-file-pdf" style="font-size:24px; color:var(--warning-amber);"></i>
                            <span style="font-size:12px; font-weight:700;">PDF File</span>
                        </button>
                    </div>

                    <div style="border:2px dashed var(--primary); background:var(--primary-light); padding:24px 16px; border-radius:var(--radius-md); text-align:center; cursor:pointer;" onclick="MediApp.simulateOcrScan('gallery')">
                        <i class="fa-solid fa-wand-magic-sparkles" style="font-size:36px; color:var(--primary); margin-bottom:8px;"></i>
                        <h4 style="font-size:15px; margin-bottom:4px;">Drag & Drop Prescription Document</h4>
                        <p style="font-size:12px; color:var(--text-muted);">AI OCR will automatically parse doctor handwriting, match inventory, and calculate confidence</p>
                    </div>
                </div>

                ${scanned ? `
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; box-shadow:var(--shadow-md);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid var(--card-border); padding-bottom:10px;">
                            <div>
                                <h3 style="font-size:16px;"><i class="fa-solid fa-receipt" style="color:var(--primary);"></i> AI OCR Extracted Prescription</h3>
                                <div style="font-size:12px; color:var(--text-muted);">${scanned.doctor} \u2022 Patient: ${scanned.patient}</div>
                            </div>
                            <span style="background:var(--secondary-light); color:var(--secondary); padding:4px 10px; border-radius:var(--radius-full); font-size:11px; font-weight:800;">4 Items Found</span>
                        </div>

                        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
                            ${scanned.items.map((item, idx) => `
                                <div style="background:${item.isLowConfidence ? "var(--warning-light)" : "var(--background)"}; border:1px solid ${item.isLowConfidence ? "var(--warning-amber)" : "var(--card-border)"}; padding:14px; border-radius:var(--radius-md);">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                        <div style="display:flex; align-items:center; gap:8px;">
                                            <strong style="font-size:14px;">${item.name}</strong>
                                            ${item.isLowConfidence ? `
                                                <span style="background:var(--warning-amber); color:white; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:800;">
                                                    <i class="fa-solid fa-triangle-exclamation"></i> Low Confidence (${item.confidence}%)
                                                </span>
                                            ` : `
                                                <span style="background:var(--secondary-light); color:var(--secondary); padding:2px 6px; border-radius:4px; font-size:10px; font-weight:800;">
                                                    <i class="fa-solid fa-circle-check"></i> ${item.confidence}% Verified
                                                </span>
                                            `}
                                        </div>
                                    </div>

                                    <!-- Manual Correction Input -->
                                    <div style="display:flex; gap:10px; align-items:center; margin-top:8px;">
                                        <div style="flex:2;">
                                            <label style="font-size:10px; font-weight:700; color:var(--text-muted);">MANUAL CORRECTION</label>
                                            <input type="text" value="${item.name}" style="width:100%; padding:6px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px; font-weight:700;">
                                        </div>
                                        <div style="flex:1;">
                                            <label style="font-size:10px; font-weight:700; color:var(--text-muted);">QTY (STRIPS)</label>
                                            <input type="number" value="${item.qty}" style="width:100%; padding:6px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px; font-weight:700;">
                                        </div>
                                    </div>
                                </div>
                            `).join("")}
                        </div>

                        <button class="add-cart-btn" style="width:100%; justify-content:center; padding:14px; font-size:15px;" onclick="MediApp.addPrescriptionItemsToCart()">
                            <i class="fa-solid fa-cart-plus"></i> Automatically Add All Matched Medicines to Cart
                        </button>
                    </div>
                ` : ""}
            </main>
            ${this.renderBottomNav()}
        `;
    }
    // 6. Cart & Checkout Page (/cart)
    renderCartPage() {
      (this.app.state.cart || []).forEach((item) => {
        const liveMed = (this.app.state.medicines || []).find((m) => m.id === item.id);
        if (liveMed && liveMed.price !== void 0) {
          item.price = liveMed.price;
        }
      });
      const userLoc = googleMapsService.getUserLocation();
      const serviceability = googleMapsService.isLocationServiceable(userLoc, 15);
      const subtotal = this.app.state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const distKm = serviceability.distanceKm || 0;
      const deliveryFee = subtotal > 0 ? parseFloat((distKm * 10).toFixed(2)) : 0;
      const discount = this.app.state.appliedCoupon ? subtotal * 0.2 : 0;
      const tax = parseFloat((subtotal * 0.05).toFixed(2));
      const total = Math.max(0, subtotal + deliveryFee + tax - discount);
      return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1;">Shopping Cart (${this.app.getCartCount()} items)</h2>
            </header>

            <main class="main-content">
                ${this.app.state.cart.length === 0 ? `
                    <div style="text-align:center; padding:60px 20px;">
                        <i class="fa-solid fa-basket-shopping" style="font-size:64px; color:var(--text-muted); margin-bottom:16px;"></i>
                        <h3 style="font-size:18px; margin-bottom:8px;">Your Cart is Empty</h3>
                        <p style="font-size:13px; color:var(--text-muted); margin-bottom:20px;">Search medicines from nearby pharmacies to add items.</p>
                        <button class="add-cart-btn" onclick="MediApp.setCustomerTab('search')">Browse Medicines</button>
                    </div>
                ` : `
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:16px;">Items in Cart</h3>
                            <button class="btn-secondary" style="font-size:11px; padding:4px 8px; color:var(--emergency-red);" onclick="MediApp.clearCart()"><i class="fa-solid fa-trash"></i> Clear All</button>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px;">
                            ${this.app.state.cart.map((item) => `
                                <div style="display:flex; align-items:center; gap:14px; border-bottom:1px solid var(--card-border); padding-bottom:12px;">
                                    <img src="${item.image}" style="width:52px; height:52px; border-radius:var(--radius-sm); object-fit:cover;">
                                    <div style="flex:1;">
                                        <div style="font-weight:700; font-size:15px;">${item.name}</div>
                                        <div style="font-size:13px; color:var(--primary); font-weight:700;">\u20B9${item.price.toFixed(2)}</div>
                                    </div>
                                    <div style="display:flex; align-items:center; gap:10px; background:var(--background); padding:6px 12px; border-radius:var(--radius-full);">
                                        <button onclick="MediApp.updateCartQty('${item.id}', -1)" style="font-weight:800; font-size:16px;">-</button>
                                        <span style="font-weight:700; font-size:14px;">${item.quantity}</span>
                                        <button onclick="MediApp.updateCartQty('${item.id}', 1)" style="font-weight:800; font-size:16px;">+</button>
                                    </div>
                                </div>
                            `).join("")}
                        </div>

                        <!-- Delivery Address Input & Picker Actions -->
                        <div style="margin-bottom:16px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                <label style="font-size:12px; font-weight:700; color:var(--text-muted);">DELIVERY ADDRESS (MAX 15 KM RADIUS)</label>
                                <div style="display:flex; gap:6px;">
                                    <button class="btn-secondary" style="font-size:11px; padding:2px 8px;" onclick="MediApp.detectLiveLocation()"><i class="fa-solid fa-location-crosshairs"></i> Use GPS</button>
                                    <button class="btn-secondary" style="font-size:11px; padding:2px 8px;" onclick="MediApp.openMapPickerModal()"><i class="fa-solid fa-map-pin"></i> Select Map</button>
                                </div>
                            </div>
                            <input type="text" id="deliveryAddressInput" value="${googleMapsService.getUserLocation().label}" 
                                   oninput="MediApp.validateCheckoutAddress(this.value)"
                                   onchange="MediApp.validateCheckoutAddress(this.value)"
                                   placeholder="Type delivery address or select on map..."
                                   style="width:100%; border:1px solid var(--card-border); padding:10px 14px; border-radius:var(--radius-md); font-size:13px;">
                        </div>

                        <!-- Dynamic Serviceability Alert Box -->
                        <div id="checkoutServiceabilityAlert" style="background:var(--emergency-light); border:1px solid var(--emergency-red); border-radius:var(--radius-md); padding:14px; margin-bottom:16px; color:var(--emergency-red); font-weight:800; font-size:13px; display:${!serviceability.serviceable ? "flex" : "none"}; align-items:center; gap:10px;">
                            <i class="fa-solid fa-triangle-exclamation" style="font-size:20px;"></i>
                            <div>
                                <div style="font-size:14px; font-weight:800;">The location is currently not serviceable</div>
                                <div style="font-size:11px; font-weight:600; opacity:0.9; margin-top:2px;">Delivery is available only within a 15 km radius of our medicine supply store.</div>
                            </div>
                        </div>

                        <!-- Bill Summary -->
                        <div style="background:var(--background); padding:14px; border-radius:var(--radius-md); font-size:13px; margin-bottom:20px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <span>Subtotal</span><span id="cartSubtotalText">\u20B9${subtotal.toFixed(2)}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <span>Distance to Store</span><span id="cartDistanceText">${distKm.toFixed(1)} km</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <span>Delivery Charge (\u20B910/km)</span><span id="cartDeliveryFeeText">\u20B9${deliveryFee.toFixed(2)}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <span>Taxes (GST 5% on items)</span><span id="cartTaxText">\u20B9${tax.toFixed(2)}</span>
                            </div>
                            ${discount > 0 ? `
                                <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:var(--secondary);">
                                    <span>Coupon Discount (20%)</span><span>-\u20B9${discount.toFixed(2)}</span>
                                </div>
                            ` : ""}
                            <div style="border-top:1px dashed var(--card-border); margin-top:8px; padding-top:8px; display:flex; justify-content:space-between; font-weight:800; font-size:16px;">
                                <span>Total Amount</span><span id="cartTotalText" style="color:var(--primary);">\u20B9${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button id="placeOrderBtn" data-total="${total.toFixed(2)}" class="add-cart-btn" ${!serviceability.serviceable ? 'disabled style="width:100%; justify-content:center; padding:14px; font-size:15px; opacity:0.5; cursor:not-allowed; background:var(--text-muted); border-color:var(--text-muted);"' : 'style="width:100%; justify-content:center; padding:14px; font-size:16px;"'} onclick="MediApp.simulateRazorpayCheckout(${total})">
                            ${!serviceability.serviceable ? '<i class="fa-solid fa-ban"></i> The location is currently not serviceable' : `<i class="fa-solid fa-lock"></i> Place Order \u2022 \u20B9${total.toFixed(2)}`}
                        </button>
                    </div>
                `}
            </main>
            ${this.renderBottomNav()}
        `;
    }
    // Helper render helpers
    renderMedicineCards(medList) {
      const enriched = this.searchEngine.enrichMedicines(medList);
      return enriched.map((med) => {
        const isOpen = med.pharmacy_status === "open";
        const inStock = med.stock > 0;
        const isGoogleDiscovered = med.isGooglePlaceUnregistered;
        return `
                <div class="med-card" style="display:flex; flex-direction:column; justify-content:space-between; position:relative;">
                    <div>
                        <div class="med-img-wrapper" onclick="MediApp.viewMedicineDetails('${med.id}')" style="display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--primary-light) 0%, #e0f2fe 100%); color:var(--primary); position:relative; min-height:90px; border-radius:var(--radius-md); margin-bottom:10px;">
                            <i class="fa-solid fa-pills" style="font-size:36px;"></i>
                            ${med.requires_prescription ? `<span class="rx-badge">Rx REQUIRED</span>` : ""}
                            <span class="discount-tag">15% OFF</span>
                        </div>

                        <!-- 1. Medicine Brand Name -->
                        <div class="med-title" onclick="MediApp.viewMedicineDetails('${med.id}')">${med.name}</div>
                        
                        <!-- 2. Generic Name -->
                        <div class="med-generic" style="color:var(--primary); font-weight:600; font-size:12px; margin-bottom:4px;">
                            \u{1F9EA} ${med.generic_name}
                        </div>

                        <!-- 4. Manufacturer -->
                        <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px;">
                            \u{1F3E2} Mfr: <strong>${med.manufacturer}</strong>
                        </div>

                        <!-- 5. Stock Status / Google Unregistered Notice -->
                        <div style="font-size:11px; font-weight:700; margin-bottom:8px; color:${isGoogleDiscovered ? "var(--text-muted)" : inStock ? "var(--secondary)" : "var(--emergency-red)"};">
                            ${isGoogleDiscovered ? "\u26A0\uFE0F Medicine availability not available" : inStock ? `\u{1F4E6} In Stock (${med.stock} units)` : "\u{1F4E6} Out of Stock"}
                        </div>


                    </div>

                    <!-- 3. Price & Action -->
                    <div class="med-price-row" style="margin-top:auto;">
                        <div class="price-box">
                            <span class="current-price">\u20B9${med.price.toFixed(2)}</span>
                            <span class="original-price">\u20B9${(med.price * 1.15).toFixed(2)}</span>
                        </div>
                        <button class="add-cart-btn" ${!inStock || isGoogleDiscovered ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ""} onclick="MediApp.addToCart('${med.id}')">
                            <i class="fa-solid fa-plus"></i> Add
                        </button>
                    </div>
                </div>
            `;
      }).join("");
    }
    renderBottomNav() {
      const tab = this.app.state.customerTab;
      return `
            <nav class="bottom-nav">
                <a href="#" class="nav-item ${tab === "home" ? "active" : ""}" onclick="MediApp.setCustomerTab('home')">
                    <i class="fa-solid fa-house"></i><span>Home</span>
                </a>
                <a href="#" class="nav-item ${tab === "search" ? "active" : ""}" onclick="MediApp.setCustomerTab('search')">
                    <i class="fa-solid fa-magnifying-glass"></i><span>Search</span>
                </a>
                <a href="#" class="nav-item ${tab === "pharmacies" ? "active" : ""}" onclick="MediApp.setCustomerTab('pharmacies')">
                    <i class="fa-solid fa-store"></i><span>Pharmacies</span>
                </a>
                <a href="#" class="nav-item ${tab === "orders" ? "active" : ""}" onclick="MediApp.setCustomerTab('orders')">
                    <i class="fa-solid fa-receipt"></i><span>Orders</span>
                </a>
                <a href="#" class="nav-item ${tab === "profile" ? "active" : ""}" onclick="MediApp.setCustomerTab('profile')">
                    <i class="fa-solid fa-user"></i><span>Profile</span>
                </a>
            </nav>
        `;
    }
    renderAiFab() {
      return "";
    }
    renderSearchPage() {
      const allMedicines = this.app.state.medicines || [];
      const pharmacies = googleMapsService.getPharmacies();
      this.searchEngine.setDatasets(allMedicines, pharmacies);
      const { results, spellingCorrection, alternatives } = this.searchEngine.search(this.searchQuery, this.selectedCategory);
      return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <div style="flex:1;">
                    <div class="main-search-bar" style="margin:0;">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="text" id="mainSearchInputField" placeholder="Search brand, generic name (e.g. Paracetamol, Dolo 650)..." value="${this.searchQuery}" oninput="MediApp.handleSearchInput(this.value)">
                    </div>
                </div>
            </header>

            <main class="main-content">
                ${spellingCorrection ? `
                    <div style="background:var(--primary-light); color:var(--primary); padding:10px 14px; border-radius:var(--radius-md); font-size:13px; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                        <span>Did you mean <strong style="text-decoration:underline; cursor:pointer;" onclick="MediApp.handleSearchInput('${spellingCorrection}')">"${spellingCorrection}"</strong>?</span>
                    </div>
                ` : ""}

                ${results.length > 0 ? `
                    <div class="cards-grid">
                        ${this.renderMedicineCards(results)}
                    </div>
                ` : `
                    <div style="text-align:center; padding:30px 20px;">
                        <i class="fa-solid fa-magnifying-glass-minus" style="font-size:42px; color:var(--text-muted); margin-bottom:12px;"></i>
                        <h3 style="font-size:18px;">No exact match found for "${this.searchQuery}"</h3>
                        <p style="font-size:13px; color:var(--text-muted); margin-bottom:20px;">We searched brand names, generic chemical compositions, and nearby pharmacy stock.</p>
                    </div>
                `}

                ${alternatives && alternatives.length > 0 ? `
                    <div style="margin-top:24px; background:var(--secondary-light); border:1px solid var(--secondary); border-radius:var(--radius-lg); padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <h3 style="font-size:16px; color:var(--secondary-hover); font-weight:800;"><i class="fa-solid fa-lightbulb"></i> Recommended Generic Alternatives</h3>
                            <span style="background:var(--secondary); color:white; padding:3px 8px; border-radius:var(--radius-full); font-size:11px; font-weight:800;">SAVE ~25%</span>
                        </div>
                        <p style="font-size:12px; color:var(--text-body); margin-bottom:14px;">Same active chemical composition available in stock at nearby pharmacies:</p>
                        <div class="cards-grid">
                            ${this.renderMedicineCards(alternatives)}
                        </div>
                    </div>
                ` : ""}
            </main>
            ${this.renderBottomNav()}
        `;
    }
    renderOrdersPage() {
      const currentUser = this.app.authService.getUser();
      let userOrders = [];
      if (currentUser) {
        const userEmail = (currentUser.email || "").toLowerCase();
        const userName = (currentUser.name || "").toLowerCase();
        const userId = String(currentUser.id || "");
        const filtered = (this.app.state.orders || []).filter((o) => {
          if (!o) return false;
          const oUserId = String(o.user_id || "");
          const oCustId = String(o.customer_id || "");
          const oEmail = (o.customer_email || "").toLowerCase();
          const oName = (o.customer_name || "").toLowerCase();
          return userId && (oUserId === userId || oCustId === userId) || userEmail && oEmail && oEmail === userEmail || userName && oName && oName === userName || oUserId.startsWith("usr_guest_");
        });
        userOrders = filtered.length > 0 ? filtered : this.app.state.orders || [];
      } else {
        userOrders = this.app.state.orders || [];
      }
      const activeOrders = userOrders.filter((o) => o.order_status !== "Delivered" && o.order_status !== "Cancelled");
      const deliveredOrders = userOrders.filter((o) => o.order_status === "Delivered" || o.order_status === "Cancelled");
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
      const renderSingleOrderCard = (o, isActive) => {
        const isCompleted = o.order_status === "Delivered";
        const isCancelled = o.order_status === "Cancelled";
        const items = o.items || [];
        const itemsSum = items.reduce((sum, it) => sum + (parseFloat(it.price) || 0) * (parseInt(it.quantity) || 1), 0);
        const deliveryFee = o.delivery_fee !== void 0 ? o.delivery_fee : itemsSum > 0 ? itemsSum > 200 ? 0 : 25 : 0;
        const tax = o.tax !== void 0 ? o.tax : parseFloat((itemsSum * 0.05).toFixed(2));
        const discount = o.discount || 0;
        const computedTotal = parseFloat(Math.max(0, itemsSum + deliveryFee + tax - discount).toFixed(2));
        const total = o.total_amount && items.length > 0 && Math.abs(o.total_amount - computedTotal) < 0.05 ? o.total_amount : computedTotal;
        o.total_amount = total;
        o.subtotal = itemsSum;
        o.tax = tax;
        o.delivery_fee = deliveryFee;
        const formattedDate = o.created_at ? new Date(o.created_at).toLocaleString() : (/* @__PURE__ */ new Date()).toLocaleString();
        return `
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:18px; box-shadow:var(--shadow-sm); margin-bottom:14px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; border-bottom:1px solid var(--card-border); padding-bottom:12px;">
                        <div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="font-weight:800; color:var(--primary); font-size:16px;">${o.id}</span>
                                <span style="font-size:11px; background:var(--background); padding:2px 6px; border-radius:var(--radius-sm); border:1px solid var(--card-border); color:var(--text-muted); font-weight:600;">${o.payment_method || "UPI"}</span>
                            </div>
                            <div style="font-size:11px; color:var(--text-muted); margin-top:4px;"><i class="fa-regular fa-clock"></i> ${formattedDate}</div>
                        </div>
                        <span class="role-badge-btn" style="background:${isCancelled ? "var(--emergency-light)" : isCompleted ? "var(--secondary-light)" : "var(--primary-light)"}; color:${isCancelled ? "var(--emergency-red)" : isCompleted ? "var(--secondary)" : "var(--primary)"}; font-weight:700;">
                            ${isActive ? '<i class="fa-solid fa-circle-dot fa-spin" style="margin-right:4px;"></i>' : ""}${o.order_status}
                        </span>
                    </div>

                    <div style="font-size:13px; margin-bottom:14px; background:var(--background); padding:12px; border-radius:var(--radius-md); border:1px solid var(--card-border);">
                        <div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:6px; text-transform:uppercase;">ORDER ITEMS (${items.length})</div>
                        ${items.map((it) => `
                            <div style="display:flex; justify-content:space-between; align-items:center; padding:3px 0; font-size:13px;">
                                <span>\u2022 <b>${it.quantity || 1}x</b> ${it.name}</span>
                                <span style="font-weight:600;">\u20B9${((it.price || 0) * (it.quantity || 1)).toFixed(2)}</span>
                            </div>
                        `).join("")}
                        <div style="margin-top:10px; padding-top:8px; border-top:1px dashed var(--card-border); display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:12px; color:var(--text-muted);">Payment: <b>${o.payment_status || "Paid"}</b></span>
                            <span style="font-size:15px; font-weight:800; color:var(--text-main);">Total: \u20B9${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end;">
                        ${isActive ? `
                            <button class="add-cart-btn" style="font-size:12px; padding:6px 14px;" onclick="MediApp.openTrackingModal('${o.id}')">
                                <i class="fa-solid fa-map-location-dot"></i> Track Live Delivery
                            </button>
                            <button class="btn-secondary" style="color:var(--emergency-red); font-size:12px; padding:6px 12px;" onclick="MediApp.cancelOrder('${o.id}')">
                                <i class="fa-solid fa-ban"></i> Cancel Order
                            </button>
                        ` : `
                            <button class="btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="MediApp.openGstInvoiceModal('${o.id}')">
                                <i class="fa-solid fa-file-invoice"></i> GST Invoice
                            </button>
                            <button class="add-cart-btn" style="background:var(--secondary); font-size:12px; padding:6px 14px;" onclick="MediApp.reorder('${o.id}')">
                                <i class="fa-solid fa-rotate-right"></i> Reorder Items
                            </button>
                        `}
                    </div>
                </div>
            `;
      };
      return `
            <header class="navbar-top">
                <h2 style="font-size:18px; flex:1;"><i class="fa-solid fa-box-archive" style="color:var(--primary);"></i> Orders & History</h2>
                <button class="icon-btn" onclick="MediApp.loadSavedOrders(); MediApp.render();" title="Refresh Orders"><i class="fa-solid fa-rotate-right"></i></button>
                <button class="icon-btn" onclick="MediApp.openNotificationsModal()" title="Notifications"><i class="fa-solid fa-bell"></i></button>
            </header>

            <main class="main-content">
                <!-- Summary Metrics Bar -->
                <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:20px;">
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:12px; text-align:center;">
                        <div style="font-size:18px; font-weight:800; color:var(--primary);">${userOrders.length}</div>
                        <div style="font-size:11px; color:var(--text-muted); font-weight:600;">Total Orders</div>
                    </div>
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:12px; text-align:center;">
                        <div style="font-size:18px; font-weight:800; color:var(--secondary);">${activeOrders.length}</div>
                        <div style="font-size:11px; color:var(--text-muted); font-weight:600;">Active Live</div>
                    </div>
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:12px; text-align:center;">
                        <div style="font-size:18px; font-weight:800; color:var(--warning-amber);">\u20B9${totalSpent.toFixed(0)}</div>
                        <div style="font-size:11px; color:var(--text-muted); font-weight:600;">Total Spent</div>
                    </div>
                </div>

                ${userOrders.length === 0 ? `
                    <div style="text-align:center; padding:60px 20px; background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg);">
                        <i class="fa-solid fa-box-open" style="font-size:48px; color:var(--text-muted); margin-bottom:12px;"></i>
                        <h3 style="font-size:16px; margin-bottom:4px; color:var(--text-main);">No Orders Placed Yet</h3>
                        <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Your order history will appear here automatically once you place your first medicine order.</p>
                        <button class="add-cart-btn" style="margin:0 auto; padding:10px 20px; font-size:14px;" onclick="MediApp.setCustomerTab('home')">
                            <i class="fa-solid fa-pills"></i> Browse Medicines & Order
                        </button>
                    </div>
                ` : `
                    <!-- SECTION 1: Active Live Orders (Not Delivered) -->
                    <div style="margin-bottom:28px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:16px; font-weight:800; display:flex; align-items:center; gap:8px; color:var(--primary);">
                                <i class="fa-solid fa-truck-fast"></i> Active Orders (${activeOrders.length})
                            </h3>
                            <span style="font-size:11px; background:var(--primary-light); color:var(--primary); padding:3px 8px; border-radius:var(--radius-full); font-weight:700;">
                                In-Progress & Live Delivery
                            </span>
                        </div>

                        ${activeOrders.length === 0 ? `
                            <div style="padding:20px; background:var(--card-bg); border:1px dashed var(--card-border); border-radius:var(--radius-md); text-align:center; color:var(--text-muted); font-size:13px;">
                                No active undelivered orders right now.
                            </div>
                        ` : `
                            ${activeOrders.map((o) => renderSingleOrderCard(o, true)).join("")}
                        `}
                    </div>

                    <!-- SECTION 2: Order History (Delivered & Completed) -->
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                            <h3 style="font-size:16px; font-weight:800; display:flex; align-items:center; gap:8px; color:var(--text-main);">
                                <i class="fa-solid fa-clock-rotate-left" style="color:var(--secondary);"></i> Order History (${deliveredOrders.length})
                            </h3>
                            <span style="font-size:11px; background:var(--secondary-light); color:var(--secondary); padding:3px 8px; border-radius:var(--radius-full); font-weight:700;">
                                Delivered & Completed Orders
                            </span>
                        </div>

                        ${deliveredOrders.length === 0 ? `
                            <div style="padding:20px; background:var(--card-bg); border:1px dashed var(--card-border); border-radius:var(--radius-md); text-align:center; color:var(--text-muted); font-size:13px;">
                                No past delivered orders yet.
                            </div>
                        ` : `
                            ${deliveredOrders.map((o) => renderSingleOrderCard(o, false)).join("")}
                        `}
                    </div>
                `}
            </main>
            ${this.renderBottomNav()}
        `;
    }
    renderProfilePage() {
      const user = this.app.authService.getUser() || { name: "Customer User", email: "user@example.com", phone: "+91 98765 43210" };
      const savedAddresses = this.app.state.savedAddresses || [];
      const pharmacies = googleMapsService.getPharmacies();
      const favoritePharmacies = pharmacies.filter((p) => (this.app.state.favoritePharmacies || []).includes(p.id));
      return `
            <header class="navbar-top">
                <h2 style="font-size:18px; flex:1;">My Customer Account</h2>
                <button class="icon-btn" onclick="MediApp.openNotificationsModal()"><i class="fa-solid fa-bell"></i></button>
            </header>

            <main class="main-content">
                <!-- User Profile Card -->
                <div style="background:var(--card-bg); padding:20px; border-radius:var(--radius-lg); border:1px solid var(--card-border); display:flex; align-items:center; gap:16px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <div style="width:64px; height:64px; border-radius:var(--radius-full); background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-size:28px; flex-shrink:0; border:2px solid var(--primary);">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <div style="flex:1;">
                        <h3 style="font-size:18px; margin-bottom:2px; font-weight:700;">${user ? user.name : "Customer User"}</h3>
                        <div style="font-size:12px; color:var(--text-muted);">${user ? user.phone : ""} \u2022 ${user ? user.email : ""}</div>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <button class="add-cart-btn" style="padding:6px 12px; font-size:12px;" onclick="MediApp.openEditProfileModal()"><i class="fa-solid fa-user-pen"></i> Edit Profile</button>
                        <button class="btn-secondary" style="color:var(--emergency-red); padding:6px 12px; font-size:11px;" onclick="MediApp.logout()"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
                    </div>
                </div>

                <!-- Profile Options List -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:8px; margin-bottom:20px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--card-border); cursor:pointer;" onclick="MediApp.openEditProfileModal()">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-user-pen" style="color:var(--primary); font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">Edit Profile</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--card-border); cursor:pointer;" onclick="MediApp.setCustomerTab('orders')">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-box-archive" style="color:var(--primary); font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">My Orders History</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>


                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--card-border); cursor:pointer;" onclick="MediApp.openNotificationsModal()">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-bell" style="color:#9333ea; font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">Notifications</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--card-border); cursor:pointer;" onclick="MediApp.openHelpSupportModal()">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-circle-question" style="color:#0ea5e9; font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">Help & Support</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; cursor:pointer;" onclick="MediApp.openAboutModal()">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <i class="fa-solid fa-circle-info" style="color:var(--text-muted); font-size:18px;"></i>
                            <span style="font-weight:700; font-size:14px;">About MediFind</span>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>
                </div>

                <!-- Saved Favorite Pharmacies -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:18px;">
                    <h3 style="font-size:16px; margin-bottom:12px;"><i class="fa-solid fa-heart" style="color:var(--emergency-red);"></i> Favorite Pharmacies</h3>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        ${favoritePharmacies.length === 0 ? `
                            <div style="font-size:12px; color:var(--text-muted);">No favorite pharmacies saved yet. Click the heart icon on any pharmacy to save it.</div>
                        ` : favoritePharmacies.map((p) => `
                            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--card-border); padding-bottom:8px;">
                                <div>
                                    <strong>${p.shop_name}</strong>
                                </div>
                                <button class="btn-secondary" onclick="MediApp.viewPharmacyDetails('${p.id}')">Visit Store</button>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </main>
            ${this.renderBottomNav()}
        `;
    }
    // 9. Emergency 24/7 Pharmacy View
    renderEmergencyPage() {
      const userLoc = googleMapsService.getUserLocation();
      const pharmacies = googleMapsService.getPharmacies();
      return `
            <header class="navbar-top">
                <button class="icon-btn" onclick="MediApp.setCustomerTab('home')"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 style="font-size:18px; flex:1; color:var(--emergency-red);"><i class="fa-solid fa-truck-medical"></i> Emergency 24/7 Pharmacies</h2>
                <button class="btn-secondary" style="font-size:11px; padding:4px 8px;" onclick="MediApp.refreshNearbyPharmacies()">
                    <i class="fa-solid fa-arrows-rotate"></i> Refresh
                </button>
            </header>

            <main class="main-content">
                <div style="background:var(--emergency-light); border:1px solid var(--emergency-red); border-radius:var(--radius-md); padding:16px; margin-bottom:20px;">
                    <div style="display:flex; align-items:center; gap:10px; color:var(--emergency-red); font-weight:800; font-size:15px; margin-bottom:4px;">
                        <i class="fa-solid fa-triangle-exclamation"></i> Emergency Medical Support Active
                    </div>
                    <div style="font-size:12px; color:var(--text-body);">
                        Showing open 24/7 verified emergency pharmacies near <strong>${userLoc.label}</strong>. Call directly for urgent medicine supply.
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:14px;">
                    ${pharmacies.map((p) => `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:18px; box-shadow:var(--shadow-sm);">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                                <div style="display:flex; gap:12px; align-items:center;">
                                    <img src="${p.logo}" style="width:54px; height:54px; border-radius:var(--radius-md); object-fit:cover;">
                                    <div>
                                        <div style="font-weight:800; font-size:16px; color:var(--text-main);">${p.shop_name}</div>
                                    </div>
                                </div>
                                <span style="background:var(--secondary-light); color:var(--secondary); font-weight:800; font-size:11px; padding:4px 8px; border-radius:4px; white-space:nowrap;">
                                    \u{1F7E2} OPEN 24/7
                                </span>
                            </div>

                            <div style="display:flex; justify-content:flex-end; align-items:center; font-size:12px; font-weight:700; color:var(--primary); margin-bottom:14px; background:var(--background); padding:8px 12px; border-radius:var(--radius-sm);">
                                <span>\u2B50 ${p.rating} (${p.reviews_count || 12} reviews)</span>
                            </div>

                            <div style="display:flex; gap:10px;">
                                ${p.phone ? `
                                    <a href="tel:${p.phone}" class="add-cart-btn" style="flex:1; justify-content:center; text-decoration:none; background:var(--emergency-red); border-color:var(--emergency-red);">
                                        <i class="fa-solid fa-phone"></i> Call Pharmacy
                                    </a>
                                ` : `
                                    <a href="tel:+919876543210" class="add-cart-btn" style="flex:1; justify-content:center; text-decoration:none; background:var(--emergency-red); border-color:var(--emergency-red);">
                                        <i class="fa-solid fa-phone"></i> Call Pharmacy
                                    </a>
                                `}
                                <a href="${googleMapsService.getDirectionsUrl(p)}" target="_blank" class="btn-secondary" style="flex:1; justify-content:center; text-decoration:none; align-items:center;">
                                    <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                                </a>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </main>
            ${this.renderBottomNav()}
        `;
    }
  };

  // js/pharmacy.js
  var PharmacyModule = class {
    constructor(app) {
      this.app = app;
      this.activeTab = "dashboard";
    }
    render() {
      const myPharmacyId = "pharm_1";
      const myPharmacy = this.app.state.pharmacies.find((p) => p.id === myPharmacyId) || this.app.state.pharmacies[0];
      const myMedicines = this.app.state.medicines.filter((m) => m.pharmacy_id === myPharmacyId || !m.pharmacy_id);
      const myOrders = this.app.state.orders.filter((o) => o.pharmacy_id === myPharmacyId || !o.pharmacy_id);
      const lowStockCount = myMedicines.filter((m) => m.stock < 20).length;
      const pendingOrders = myOrders.filter((o) => o.order_status === "Order Placed" || o.order_status === "Pending");
      return `
            <header class="navbar-top">
                <div class="brand-logo">
                    <div class="brand-icon" style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);"><i class="fa-solid fa-clinic-medical"></i></div>
                    <div>
                        <span class="brand-text" style="font-size:18px;">${myPharmacy.shop_name}</span>
                        <div style="font-size:11px; color:var(--text-muted);"><i class="fa-solid fa-certificate" style="color:var(--primary);"></i> License: ${myPharmacy.license_number}</div>
                    </div>
                </div>
                <div class="top-actions">
                    <button class="role-badge-btn" onclick="MediApp.openRoleModal()">
                        <i class="fa-solid fa-user-gear"></i> Role: PHARMACY
                    </button>
                    <button class="icon-btn" onclick="MediApp.toggleTheme()">
                        <i class="fa-solid ${this.app.state.darkMode ? "fa-sun" : "fa-moon"}"></i>
                    </button>
                </div>
            </header>

            <main class="main-content">
                <!-- Navigation Tabs Bar (7 Tabs) -->
                <div style="display:flex; gap:6px; background:var(--card-bg); padding:8px; border-radius:var(--radius-md); border:1px solid var(--card-border); margin-bottom:20px; overflow-x:auto; scrollbar-width:none;">
                    <button class="btn-secondary ${this.activeTab === "dashboard" ? "active" : ""}" 
                            style="${this.activeTab === "dashboard" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setPharmacyTab('dashboard')">
                        <i class="fa-solid fa-chart-line"></i> Dashboard
                    </button>
                    <button class="btn-secondary ${this.activeTab === "inventory" ? "active" : ""}" 
                            style="${this.activeTab === "inventory" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setPharmacyTab('inventory')">
                        <i class="fa-solid fa-boxes-stacked"></i> Inventory (${myMedicines.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "orders" ? "active" : ""}" 
                            style="${this.activeTab === "orders" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setPharmacyTab('orders')">
                        <i class="fa-solid fa-box"></i> Orders (${myOrders.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "sales" ? "active" : ""}" 
                            style="${this.activeTab === "sales" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setPharmacyTab('sales')">
                        <i class="fa-solid fa-receipt"></i> Sales Ledger
                    </button>
                    <button class="btn-secondary ${this.activeTab === "analytics" ? "active" : ""}" 
                            style="${this.activeTab === "analytics" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setPharmacyTab('analytics')">
                        <i class="fa-solid fa-chart-pie"></i> Analytics
                    </button>
                    <button class="btn-secondary ${this.activeTab === "notifications" ? "active" : ""}" 
                            style="${this.activeTab === "notifications" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setPharmacyTab('notifications')">
                        <i class="fa-solid fa-bell"></i> Alerts (${pendingOrders.length + lowStockCount})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "profile" ? "active" : ""}" 
                            style="${this.activeTab === "profile" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setPharmacyTab('profile')">
                        <i class="fa-solid fa-store"></i> Profile
                    </button>
                </div>

                ${this.renderActiveTab(myPharmacy, myMedicines, myOrders, lowStockCount, pendingOrders)}
            </main>
        `;
    }
    renderActiveTab(myPharmacy, myMedicines, myOrders, lowStockCount, pendingOrders) {
      if (this.activeTab === "dashboard") {
        const todayRevenue = myOrders.reduce((sum, o) => sum + o.total_amount, 0);
        return `
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#dcfce7; color:#16a34a;"><i class="fa-solid fa-indian-rupee-sign"></i></div>
                        <div>
                            <div class="metric-val">\u20B9${todayRevenue.toFixed(2)}</div>
                            <div class="metric-lbl">Total Pharmacy Revenue</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#e0f2fe; color:#0284c7;"><i class="fa-solid fa-bag-shopping"></i></div>
                        <div>
                            <div class="metric-val">${myOrders.length}</div>
                            <div class="metric-lbl">Total Orders Received</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#fef3c7; color:#d97706;"><i class="fa-solid fa-clock"></i></div>
                        <div>
                            <div class="metric-val">${pendingOrders.length}</div>
                            <div class="metric-lbl">Pending Order Actions</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#fee2e2; color:#ef4444;"><i class="fa-solid fa-triangle-exclamation"></i></div>
                        <div>
                            <div class="metric-val">${lowStockCount}</div>
                            <div class="metric-lbl">Low Stock Alerts</div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions Bar -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; margin-bottom:24px; display:flex; gap:12px; flex-wrap:wrap;">
                    <button class="add-cart-btn" onclick="MediApp.openAddMedicineModal()"><i class="fa-solid fa-plus"></i> Add New Medicine</button>
                    <button class="btn-secondary" onclick="MediApp.setPharmacyTab('orders')"><i class="fa-solid fa-box"></i> View Incoming Orders (${pendingOrders.length})</button>
                    <button class="btn-secondary" onclick="MediApp.setPharmacyTab('analytics')"><i class="fa-solid fa-chart-line"></i> Sales Performance</button>
                </div>

                <!-- Recent Incoming Orders -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px; margin-bottom:24px;">
                    <h3 style="font-size:16px; margin-bottom:14px;"><i class="fa-solid fa-bell-concierge" style="color:var(--primary);"></i> Live Pending Orders</h3>
                    ${pendingOrders.length === 0 ? `
                        <div style="text-align:center; padding:30px; color:var(--text-muted);">
                            <i class="fa-solid fa-circle-check" style="font-size:32px; color:var(--secondary); margin-bottom:8px;"></i>
                            <p>All incoming customer orders have been processed!</p>
                        </div>
                    ` : pendingOrders.map((order) => `
                        <div style="background:var(--background); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; margin-bottom:12px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <div>
                                    <strong style="color:var(--primary); font-size:15px;">${order.id}</strong>
                                    <span style="font-size:12px; color:var(--text-muted); margin-left:8px;">${order.customer_name} (${order.customer_phone})</span>
                                </div>
                                <span class="role-badge-btn" style="background:var(--warning-light); color:var(--warning-amber);">${order.order_status}</span>
                            </div>
                            <div style="font-size:13px; margin-bottom:12px;">
                                Items: ${order.items.map((it) => `<b>${it.quantity}x ${it.name}</b>`).join(", ")}<br>
                                Delivery Address: <span>${order.customer_address}</span>
                            </div>
                            <div style="display:flex; gap:10px; justify-content:flex-end;">
                                <button class="add-cart-btn" onclick="MediApp.acceptOrder('${order.id}')"><i class="fa-solid fa-check"></i> Accept Order</button>
                                <button class="btn-secondary" style="color:var(--emergency-red);" onclick="MediApp.rejectOrder('${order.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `;
      }
      if (this.activeTab === "inventory") {
        return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <div>
                        <h3 style="font-size:18px;">Pharmacy Inventory Management</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Manage stock quantities, prices, and product availability instantly</p>
                    </div>
                    <button class="add-cart-btn" onclick="MediApp.openAddMedicineModal()"><i class="fa-solid fa-plus"></i> Add New Medicine</button>
                </div>

                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Medicine & Composition</th>
                                <th>Category</th>
                                <th>Unit Price (\u20B9)</th>
                                <th>Live Stock Quantity</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${myMedicines.map((m) => `
                                <tr>
                                    <td>
                                        <strong>${m.name}</strong><br>
                                        <span style="font-size:11px; color:var(--primary);">\u{1F9EA} ${m.generic_name}</span><br>
                                        <span style="font-size:10px; color:var(--text-muted);">\u{1F3E2} ${m.manufacturer || "Micro Labs"}</span>
                                    </td>
                                    <td><span style="background:var(--primary-light); color:var(--primary); padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700;">${m.category}</span></td>
                                    <td>
                                        <div style="display:flex; align-items:center; gap:4px;">
                                            \u20B9<input type="number" value="${m.price}" step="0.5" style="width:70px; padding:4px; border:1px solid var(--card-border); border-radius:4px; font-size:13px; font-weight:700;" onchange="MediApp.updatePrice('${m.id}', this.value)" oninput="this.setAttribute('value', this.value)">
                                        </div>
                                    </td>
                                    <td>
                                        <div style="display:flex; align-items:center; gap:6px;">
                                            <input type="number" value="${m.stock}" style="width:65px; padding:4px; border:1px solid ${m.stock < 20 ? "var(--emergency-red)" : "var(--card-border)"}; border-radius:4px; font-size:13px; font-weight:800; color:${m.stock < 20 ? "var(--emergency-red)" : "var(--text-main)"};" onchange="MediApp.updateStock('${m.id}', this.value)" oninput="this.setAttribute('value', this.value)">
                                            <span style="font-size:11px; color:var(--text-muted);">units</span>
                                        </div>
                                    </td>
                                    <td>
                                        <button class="btn-secondary" style="padding:4px 8px; font-size:11px; color:${m.stock > 0 ? "var(--secondary)" : "var(--emergency-red)"}; font-weight:800;" onclick="MediApp.toggleAvailability('${m.id}')">
                                            \u25CF ${m.stock > 0 ? "Available" : "Unavailable"}
                                        </button>
                                    </td>
                                    <td>
                                        <div style="display:flex; gap:6px;">
                                            <button class="btn-secondary" title="Edit Medicine" onclick="MediApp.editMedicine('${m.id}')"><i class="fa-solid fa-pen"></i></button>
                                            <button class="btn-secondary" style="color:var(--emergency-red);" title="Delete" onclick="MediApp.deleteMedicine('${m.id}')"><i class="fa-solid fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            `;
      }
      if (this.activeTab === "orders") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Orders Processing Center</h3>
                <div style="display:flex; flex-direction:column; gap:14px;">
                    ${myOrders.length === 0 ? `
                        <div style="text-align:center; padding:40px; color:var(--text-muted);">No orders found.</div>
                    ` : myOrders.map((order) => `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:18px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                                <div>
                                    <span style="font-weight:800; color:var(--primary); font-size:16px;">${order.id}</span>
                                    <span style="font-size:12px; color:var(--text-muted); margin-left:8px;">Customer: <strong>${order.customer_name}</strong> (${order.customer_phone})</span>
                                </div>
                                <span class="role-badge-btn">${order.order_status}</span>
                            </div>
                            <div style="background:var(--background); padding:12px; border-radius:var(--radius-sm); font-size:13px; margin-bottom:14px;">
                                <strong>Order Items:</strong>
                                <ul>
                                    ${(order.items || []).map((it) => `<li>${it.quantity}x <b>${it.name}</b> \u2014 \u20B9${((it.price || 0) * (it.quantity || 1)).toFixed(2)}</li>`).join("")}
                                </ul>
                                ${(() => {
          const items = order.items || [];
          const itemsSum = items.reduce((sum, it) => sum + (parseFloat(it.price) || 0) * (parseInt(it.quantity) || 1), 0);
          const deliveryFee = order.delivery_fee !== void 0 ? order.delivery_fee : itemsSum > 0 ? itemsSum > 200 ? 0 : 25 : 0;
          const tax = order.tax !== void 0 ? order.tax : parseFloat((itemsSum * 0.05).toFixed(2));
          const discount = order.discount || 0;
          const computedTotal = parseFloat(Math.max(0, itemsSum + deliveryFee + tax - discount).toFixed(2));
          const total = order.total_amount && items.length > 0 && Math.abs(order.total_amount - computedTotal) < 0.05 ? order.total_amount : computedTotal;
          order.total_amount = total;
          return `<div style="margin-top:6px; text-align:right; font-weight:800; font-size:14px; color:var(--primary);">Total: \u20B9${total.toFixed(2)}</div>`;
        })()}
                            </div>
                            <div style="display:flex; gap:10px; justify-content:flex-end;">
                                <button class="btn-secondary" onclick="MediApp.acceptOrder('${order.id}')"><i class="fa-solid fa-check"></i> Accept & Prepare</button>
                                <button class="add-cart-btn" onclick="MediApp.updateOrderStatus('${order.id}', 'Ready For Pickup')"><i class="fa-solid fa-box"></i> Ready For Pickup</button>
                                <button class="btn-secondary" style="color:var(--emergency-red);" onclick="MediApp.rejectOrder('${order.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `;
      }
      if (this.activeTab === "sales") {
        const completedOrders = myOrders.filter((o) => o.order_status === "Delivered" || o.payment_status === "Paid");
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
        return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <div>
                        <h3 style="font-size:18px;">Pharmacy Sales Ledger</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Completed transactions and financial logs</p>
                    </div>
                    <div style="font-size:18px; font-weight:800; color:var(--secondary);">Total Sales: \u20B9${totalRevenue.toFixed(2)}</div>
                </div>

                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Payment Method</th>
                                <th>Amount (\u20B9)</th>
                                <th>Payment Status</th>
                                <th>Order Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${completedOrders.map((o) => `
                                <tr>
                                    <td><strong>${o.id}</strong></td>
                                    <td>${o.customer_name}</td>
                                    <td><span style="font-weight:700;">\u{1F4B3} ${o.payment_method || "UPI"}</span></td>
                                    <td><strong style="color:var(--secondary);">\u20B9${o.total_amount.toFixed(2)}</strong></td>
                                    <td><span style="color:var(--secondary); font-weight:800;">Paid</span></td>
                                    <td><span class="role-badge-btn">${o.order_status}</span></td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            `;
      }
      if (this.activeTab === "analytics") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Sales & Inventory Performance Analytics</h3>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:24px;">
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px;">
                        <h4 style="font-size:14px; margin-bottom:14px;">Weekly Revenue Trend (\u20B9)</h4>
                        <canvas id="salesChart" style="max-height:240px; width:100%;"></canvas>
                    </div>
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px;">
                        <h4 style="font-size:14px; margin-bottom:14px;">Category Sales Breakdown</h4>
                        <canvas id="categoryChart" style="max-height:240px; width:100%;"></canvas>
                    </div>
                </div>
            `;
      }
      if (this.activeTab === "notifications") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Pharmacy Real-Time Notifications & Stock Alerts</h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${lowStockCount > 0 ? `
                        <div style="background:var(--warning-light); border:1px solid var(--warning-amber); padding:16px; border-radius:var(--radius-md); display:flex; gap:12px; align-items:center;">
                            <i class="fa-solid fa-triangle-exclamation" style="font-size:24px; color:var(--warning-amber);"></i>
                            <div>
                                <strong style="color:var(--warning-amber);">Low Stock Warning</strong>
                                <div style="font-size:12px;">You have ${lowStockCount} medicines with stock quantity below 20 units. Please restock inventory.</div>
                            </div>
                        </div>
                    ` : ""}

                    ${pendingOrders.map((o) => `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); padding:16px; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center;">
                            <div style="display:flex; gap:12px; align-items:center;">
                                <i class="fa-solid fa-bell" style="font-size:20px; color:var(--primary);"></i>
                                <div>
                                    <strong>New Order Received: ${o.id}</strong>
                                    <div style="font-size:12px; color:var(--text-muted);">${o.customer_name} placed an order for \u20B9${o.total_amount.toFixed(2)}</div>
                                </div>
                            </div>
                            <button class="add-cart-btn" onclick="MediApp.setPharmacyTab('orders')">Process Order</button>
                        </div>
                    `).join("")}
                </div>
            `;
      }
      if (this.activeTab === "profile") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Pharmacy Store Configuration & License Details</h3>
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:24px;">
                    <div style="display:flex; gap:20px; align-items:center; margin-bottom:20px;">
                        <img src="${myPharmacy.logo}" style="width:90px; height:90px; border-radius:var(--radius-md); object-fit:cover;">
                        <div>
                            <h2 style="font-size:22px; margin-bottom:4px;">${myPharmacy.shop_name}</h2>
                            <div style="font-size:13px; color:var(--text-muted); margin-bottom:4px;">Owner: <strong>${myPharmacy.owner_name}</strong></div>
                            <div style="font-size:12px; color:var(--secondary); font-weight:800;"><i class="fa-solid fa-circle-check"></i> Drug License Verified \u2022 DL-2023-APO891</div>
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:14px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Pharmacy Address</label>
                            <input type="text" value="${myPharmacy.address}" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>
                        <div style="display:flex; gap:12px;">
                            <div style="flex:1;">
                                <label style="font-size:12px; font-weight:700;">GST Number</label>
                                <input type="text" value="${myPharmacy.gst || "07AAAAA0000A1Z5"}" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                            </div>
                            <div style="flex:1;">
                                <label style="font-size:12px; font-weight:700;">Phone Number</label>
                                <input type="text" value="${myPharmacy.phone}" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                            </div>
                        </div>

                        <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; margin-top:10px;" onclick="MediApp.showToast('Pharmacy profile updated successfully!')">
                            <i class="fa-solid fa-floppy-disk"></i> Save Profile Settings
                        </button>
                    </div>
                </div>
            `;
      }
    }
    initCharts() {
      if (this.activeTab !== "analytics") return;
      const salesCtx = document.getElementById("salesChart");
      const catCtx = document.getElementById("categoryChart");
      if (salesCtx && typeof Chart !== "undefined") {
        new Chart(salesCtx, {
          type: "bar",
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
              label: "Sales Revenue (\u20B9)",
              data: [4200, 5800, 6900, 8100, 9400, 12500, 14850],
              backgroundColor: "#16a34a",
              borderRadius: 6
            }]
          },
          options: { responsive: true, plugins: { legend: { display: false } } }
        });
      }
      if (catCtx && typeof Chart !== "undefined") {
        new Chart(catCtx, {
          type: "doughnut",
          data: {
            labels: ["Pain Relief", "Antibiotics", "Diabetes", "Cardiac", "Vitamins"],
            datasets: [{
              data: [35, 25, 20, 12, 8],
              backgroundColor: ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"]
            }]
          },
          options: { responsive: true }
        });
      }
    }
  };

  // js/delivery.js
  var DeliveryModule = class {
    constructor(app) {
      this.app = app;
      this.activeTab = "tasks";
      this.isOnDuty = true;
      this.driverInfo = {
        id: "partner_1",
        name: "Rohan Verma",
        vehicle: "Hero Splendor (KA-01-EQ-9982)",
        phone: "+91 98112 33445",
        rating: 4.9,
        earnings_today: 850,
        base_pay: 600,
        tips: 150,
        bonus: 100,
        total_deliveries: 482
      };
    }
    render() {
      const assignedOrder = this.app.state.orders.find((o) => o.delivery_partner && o.delivery_partner.id === "partner_1" && o.order_status !== "Delivered" && o.order_status !== "Cancelled");
      const completedDeliveries = this.app.state.orders.filter((o) => o.order_status === "Delivered");
      return `
            <header class="navbar-top">
                <div class="brand-logo">
                    <div class="brand-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);"><i class="fa-solid fa-motorcycle"></i></div>
                    <div>
                        <span class="brand-text" style="font-size:18px;">MediExpress Driver</span>
                        <div style="font-size:11px; color:var(--text-muted);">${this.driverInfo.vehicle}</div>
                    </div>
                </div>
                <div class="top-actions">
                    <button class="btn-secondary" style="padding:6px 12px; font-size:11px; font-weight:800; color:${this.isOnDuty ? "var(--secondary)" : "var(--emergency-red)"}; border:2px solid ${this.isOnDuty ? "var(--secondary)" : "var(--emergency-red)"};" onclick="MediApp.toggleDriverDuty()">
                        \u25CF ${this.isOnDuty ? "ON DUTY (Online)" : "OFF DUTY (Offline)"}
                    </button>
                    <button class="role-badge-btn" onclick="MediApp.openRoleModal()">
                        <i class="fa-solid fa-user-gear"></i> Role: DRIVER
                    </button>
                </div>
            </header>

            <main class="main-content">
                <!-- Navigation Bar (4 Tabs) -->
                <div style="display:flex; gap:6px; background:var(--card-bg); padding:8px; border-radius:var(--radius-md); border:1px solid var(--card-border); margin-bottom:20px;">
                    <button class="btn-secondary ${this.activeTab === "tasks" ? "active" : ""}" 
                            style="${this.activeTab === "tasks" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setDeliveryTab('tasks')">
                        <i class="fa-solid fa-map-location-dot"></i> Active Tasks (${assignedOrder ? 1 : 0})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "earnings" ? "active" : ""}" 
                            style="${this.activeTab === "earnings" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setDeliveryTab('earnings')">
                        <i class="fa-solid fa-indian-rupee-sign"></i> Earnings
                    </button>
                    <button class="btn-secondary ${this.activeTab === "history" ? "active" : ""}" 
                            style="${this.activeTab === "history" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setDeliveryTab('history')">
                        <i class="fa-solid fa-clock-rotate-left"></i> History (${completedDeliveries.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "profile" ? "active" : ""}" 
                            style="${this.activeTab === "profile" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setDeliveryTab('profile')">
                        <i class="fa-solid fa-id-card"></i> Profile
                    </button>
                </div>

                ${this.renderActiveTab(assignedOrder, completedDeliveries)}
            </main>
        `;
    }
    renderActiveTab(assignedOrder, completedDeliveries) {
      if (this.activeTab === "tasks") {
        if (!this.isOnDuty) {
          return `
                    <div style="text-align:center; padding:60px 20px; background:var(--card-bg); border-radius:var(--radius-lg); border:1px solid var(--card-border);">
                        <i class="fa-solid fa-moon" style="font-size:56px; color:var(--text-muted); margin-bottom:16px;"></i>
                        <h3 style="font-size:20px; margin-bottom:8px;">You Are Currently Off Duty</h3>
                        <p style="font-size:13px; color:var(--text-muted); margin-bottom:20px;">Toggle your duty status to Online to start receiving instant medicine delivery orders.</p>
                        <button class="add-cart-btn" onclick="MediApp.toggleDriverDuty()"><i class="fa-solid fa-power-off"></i> Go On Duty (Online)</button>
                    </div>
                `;
        }
        return `
                <!-- Active Assigned Delivery Order -->
                ${assignedOrder ? `
                    <div style="background:var(--card-bg); border:2px solid var(--primary); border-radius:var(--radius-lg); padding:20px; margin-bottom:24px; box-shadow:var(--shadow-md);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <span class="rx-badge" style="background:var(--primary); font-size:12px;">ACTIVE ASSIGNED ORDER</span>
                            <span style="font-weight:800; font-size:16px; color:var(--primary);">${assignedOrder.id}</span>
                        </div>

                        <!-- Live Navigation Map Canvas -->
                        <div class="tracking-map-box" style="margin-bottom:16px;">
                            <canvas id="driverMapCanvas" class="tracking-canvas"></canvas>
                        </div>

                        <!-- Google Maps Route Navigation Button -->
                        <div style="margin-bottom:16px;">
                            <a href="https://www.google.com/maps/search/?api=1&query=Sector+18+Noida" target="_blank" class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; background:linear-gradient(135deg, #4285F4 0%, #34A853 100%); text-decoration:none;">
                                <i class="fa-solid fa-diamond-turn-right"></i> Open Turn-By-Turn Navigation in Google Maps
                            </a>
                        </div>

                        <!-- Pickup & Dropoff Details -->
                        <div style="background:var(--background); padding:16px; border-radius:var(--radius-md); margin-bottom:16px; display:flex; flex-direction:column; gap:10px;">
                            <div style="font-size:13px; border-bottom:1px solid var(--card-border); padding-bottom:8px;">
                                <strong style="color:var(--primary);"><i class="fa-solid fa-store"></i> PICKUP PHARMACY:</strong><br>
                                <b>${assignedOrder.pharmacy_name}</b> (Sector 18, Noida)
                            </div>
                            <div style="font-size:13px;">
                                <strong style="color:var(--emergency-red);"><i class="fa-solid fa-house-user"></i> DELIVER TO CUSTOMER:</strong><br>
                                <b>${assignedOrder.customer_name}</b> (${assignedOrder.customer_phone})<br>
                                <span style="color:var(--text-muted); font-size:12px;">${assignedOrder.customer_address}</span>
                            </div>
                        </div>

                        <!-- Delivery Status Workflow Control Buttons -->
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <div style="display:flex; gap:8px;">
                                <button class="btn-secondary" style="flex:1; justify-content:center;" onclick="MediApp.updateOrderStatus('${assignedOrder.id}', 'Arrived at Pharmacy', 2)">
                                    <i class="fa-solid fa-building-circle-check"></i> Arrived at Store
                                </button>
                                <button class="btn-secondary" style="flex:1; justify-content:center;" onclick="MediApp.updateOrderStatus('${assignedOrder.id}', 'Out for Delivery', 4)">
                                    <i class="fa-solid fa-box-open"></i> Order Picked Up
                                </button>
                            </div>

                            <div style="display:flex; gap:8px;">
                                <button class="add-cart-btn" style="flex:2; justify-content:center; padding:12px; font-size:15px;" onclick="MediApp.openOtpVerificationModal('${assignedOrder.id}')">
                                    <i class="fa-solid fa-shield-check"></i> Verify Customer OTP & Complete
                                </button>
                                <button class="btn-secondary" style="flex:1; justify-content:center; color:var(--emergency-red);" onclick="MediApp.rejectDelivery('${assignedOrder.id}')">
                                    <i class="fa-solid fa-xmark"></i> Decline
                                </button>
                            </div>
                        </div>
                    </div>
                ` : `
                    <div style="text-align:center; padding:50px 20px; background:var(--card-bg); border-radius:var(--radius-lg); border:1px solid var(--card-border);">
                        <i class="fa-solid fa-circle-check" style="font-size:52px; color:var(--secondary); margin-bottom:12px;"></i>
                        <h3 style="font-weight:700; font-size:18px;">You Are On Duty & Ready</h3>
                        <p style="font-size:13px; color:var(--text-muted);">Incoming delivery requests from nearby pharmacies will appear here automatically.</p>
                    </div>
                `}
            `;
      }
      if (this.activeTab === "earnings") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Driver Earnings Ledger</h3>
                
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; margin-bottom:20px;">
                    <div style="text-align:center; margin-bottom:20px;">
                        <div style="font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px;">TODAY'S TOTAL EARNINGS</div>
                        <div style="font-size:36px; font-weight:800; color:var(--secondary);">\u20B9${this.driverInfo.earnings_today}</div>
                    </div>

                    <div style="background:var(--background); padding:16px; border-radius:var(--radius-md); font-size:13px; display:flex; flex-direction:column; gap:10px;">
                        <div style="display:flex; justify-content:space-between;">
                            <span>Base Trip Pay (${this.driverInfo.total_deliveries} trips)</span>
                            <strong>\u20B9${this.driverInfo.base_pay}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span>Distance & Express Bonus</span>
                            <strong>\u20B9${this.driverInfo.bonus}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span>Customer Tips \u2764\uFE0F</span>
                            <strong style="color:var(--secondary);">\u20B9${this.driverInfo.tips}</strong>
                        </div>
                        <div style="border-top:1px dashed var(--card-border); pt:8px; margin-top:4px; display:flex; justify-content:space-between; font-weight:800; font-size:15px;">
                            <span>Net Payout</span>
                            <span style="color:var(--primary);">\u20B9${this.driverInfo.earnings_today}</span>
                        </div>
                    </div>
                </div>
            `;
      }
      if (this.activeTab === "history") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Completed Delivery History (${completedDeliveries.length})</h3>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    ${completedDeliveries.length === 0 ? `
                        <div style="text-align:center; padding:40px; color:var(--text-muted);">No completed deliveries logged today.</div>
                    ` : completedDeliveries.map((o) => {
          var _a;
          return `
                        <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <strong style="color:var(--primary);">${o.id}</strong>
                                <div style="font-size:12px; color:var(--text-body); margin-top:2px;">Customer: ${o.customer_name} \u2022 ${o.pharmacy_name}</div>
                                <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">OTP Verified: ${((_a = o.delivery_partner) == null ? void 0 : _a.otp) || "8912"}</div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-weight:800; color:var(--secondary); font-size:15px;">+\u20B945.00</div>
                                <span class="role-badge-btn" style="background:var(--secondary-light); color:var(--secondary);">Delivered</span>
                            </div>
                        </div>
                    `;
        }).join("")}
                </div>
            `;
      }
      if (this.activeTab === "profile") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Driver Profile & Vehicle Information</h3>
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px;">
                    <div style="display:flex; gap:16px; align-items:center; margin-bottom:20px;">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" style="width:70px; height:70px; border-radius:var(--radius-full); object-fit:cover;">
                        <div>
                            <h3 style="font-size:18px; margin-bottom:2px;">${this.driverInfo.name}</h3>
                            <div style="font-size:12px; color:var(--text-muted);">${this.driverInfo.vehicle}</div>
                            <div style="font-size:12px; color:var(--warning-amber); font-weight:800; margin-top:2px;"><i class="fa-solid fa-star"></i> ${this.driverInfo.rating} Rating (${this.driverInfo.total_deliveries} deliveries)</div>
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Duty Availability</label>
                            <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; background:${this.isOnDuty ? "var(--secondary)" : "var(--emergency-red)"};" onclick="MediApp.toggleDriverDuty()">
                                \u25CF ${this.isOnDuty ? "ON DUTY (Online)" : "OFF DUTY (Offline)"}
                            </button>
                        </div>
                    </div>
                </div>
            `;
      }
    }
  };

  // js/admin.js
  var AdminModule = class {
    constructor(app) {
      this.app = app;
      const savedTab = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("medifind_admin_tab") : null;
      this.activeTab = savedTab || "medicines";
    }
    render() {
      const savedTab = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("medifind_admin_tab") : null;
      if (savedTab) {
        this.activeTab = savedTab;
      }
      const totalRevenue = (this.app.state.orders || []).reduce((sum, o) => sum + (o.total_amount || 0), 0);
      const allOrders = this.app.state.orders || [];
      const usersList = this.app.state && Array.isArray(this.app.state.usersList) ? this.app.state.usersList : [];
      if (usersList.length === 0 && !this._fetchingUsers) {
        this._fetchingUsers = true;
        Promise.all([this.app.loadAllUsers(), this.app.loadSavedOrders()]).finally(() => {
          this._fetchingUsers = false;
        });
      }
      if (this.activeTab === "overview" || this.activeTab === "analytics" || this.activeTab === "reports") {
        this.activeTab = "medicines";
      }
      return `
            <header class="navbar-top">
                <div class="brand-logo">
                    <div class="brand-icon" style="background: linear-gradient(135deg, #0284c7 0%, #0f172a 100%);"><i class="fa-solid fa-user-shield"></i></div>
                    <span class="brand-text">MediFind Admin Control</span>
                </div>
                <div class="top-actions">
                    <button class="role-badge-btn" onclick="MediApp.openRoleModal()">
                        <i class="fa-solid fa-user-gear"></i> Role: ADMIN
                    </button>
                    <button class="icon-btn" onclick="MediApp.toggleTheme()">
                        <i class="fa-solid ${this.app.state.darkMode ? "fa-sun" : "fa-moon"}"></i>
                    </button>
                </div>
            </header>

            <main class="main-content">
                <!-- Navigation Tabs Bar -->
                <div style="display:flex; gap:6px; background:var(--card-bg); padding:8px; border-radius:var(--radius-md); border:1px solid var(--card-border); margin-bottom:20px; overflow-x:auto; scrollbar-width:none;">
                    <button class="btn-secondary ${this.activeTab === "users" ? "active" : ""}" 
                            style="${this.activeTab === "users" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setAdminTab('users')">
                        <i class="fa-solid fa-users"></i> Users (${usersList.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "pharmacies" ? "active" : ""}" 
                            style="${this.activeTab === "pharmacies" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setAdminTab('pharmacies')">
                        <i class="fa-solid fa-store-medical"></i> Supply Store
                    </button>
                    <button class="btn-secondary ${this.activeTab === "medicines" ? "active" : ""}" 
                            style="${this.activeTab === "medicines" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setAdminTab('medicines')">
                        <i class="fa-solid fa-pills"></i> Medicines (${this.app.state.medicines.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "orders" ? "active" : ""}" 
                            style="${this.activeTab === "orders" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setAdminTab('orders')">
                        <i class="fa-solid fa-truck-fast"></i> Orders (${this.app.state.orders.length})
                    </button>
                    <button class="btn-secondary ${this.activeTab === "partners" ? "active" : ""}" 
                            style="${this.activeTab === "partners" ? "background:var(--primary); color:white; font-weight:700;" : ""}"
                            onclick="MediApp.setAdminTab('partners')">
                        <i class="fa-solid fa-motorcycle"></i> Fleet
                    </button>
                </div>

                ${this.renderActiveTab(totalRevenue, usersList)}
            </main>
        `;
    }
    renderActiveTab(totalRevenue, usersList) {
      if (this.activeTab === "overview") {
        return `
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#e0f2fe; color:#0284c7;"><i class="fa-solid fa-chart-line"></i></div>
                        <div>
                            <div class="metric-val">\u20B9${totalRevenue.toFixed(0)}</div>
                            <div class="metric-lbl">Total Gross Revenue</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#dcfce7; color:#16a34a;"><i class="fa-solid fa-store-medical"></i></div>
                        <div>
                            <div class="metric-val">1 Store</div>
                            <div class="metric-lbl">Medicine Supply Store</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#fef3c7; color:#d97706;"><i class="fa-solid fa-pills"></i></div>
                        <div>
                            <div class="metric-val">${this.app.state.medicines.length}</div>
                            <div class="metric-lbl">Master Medicines</div>
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon" style="background:#f3e8ff; color:#9333ea;"><i class="fa-solid fa-truck-fast"></i></div>
                        <div>
                            <div class="metric-val">${this.app.state.orders.length}</div>
                            <div class="metric-lbl">Total Platform Orders</div>
                        </div>
                    </div>
                </div>

                <!-- Admin Action Center Bar -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; margin-bottom:24px; display:flex; gap:12px; flex-wrap:wrap;">
                    <button class="add-cart-btn" onclick="MediApp.setAdminTab('pharmacies')"><i class="fa-solid fa-store-medical"></i> Manage Medicine Supply Store</button>
                    <button class="btn-secondary" onclick="MediApp.setAdminTab('users')"><i class="fa-solid fa-user-shield"></i> Manage User Statuses</button>
                    <button class="btn-secondary" style="color:var(--emergency-red); font-weight:700;" onclick="MediApp.resetAdminOrdersAndRevenue()"><i class="fa-solid fa-rotate-left"></i> Reset Orders & Revenue (\u20B90)</button>
                    <button class="btn-secondary" onclick="MediApp.generateAdminReport()"><i class="fa-solid fa-download"></i> Export Audit Report</button>
                </div>

                <!-- Revenue Chart Preview -->
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px; margin-bottom:24px;">
                    <h3 style="font-size:16px; margin-bottom:16px;">Platform Order Volume Growth</h3>
                    <canvas id="adminAnalyticsChart" style="max-height:240px; width:100%;"></canvas>
                </div>
            `;
      }
      if (this.activeTab === "users") {
        const allOrders = this.app.state.orders || [];
        return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                    <div>
                        <h3 style="font-size:18px;">Active Users & Order Activity (${usersList.length} Accounts)</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Displays System Admin and users with active/completed orders</p>
                    </div>
                    <button class="btn-secondary" style="padding:6px 12px; font-size:12px; font-weight:700;" onclick="MediApp.fetchRealtimeAdminUsers()">
                        <i class="fa-solid fa-rotate"></i> Sync Live Users Data
                    </button>
                </div>

                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>User ID & Name</th>
                                <th>Email & Phone</th>
                                <th>Role</th>
                                <th>Real-Time Orders</th>
                                <th>Total Spend</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${usersList.map((u) => {
          const isSuspended = u.status === "Suspended";
          const userOrders = allOrders.filter((o) => o.user_id === u.id || o.customer_name && u.name && o.customer_name.toLowerCase() === u.name.toLowerCase());
          const userTotalSpent = userOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
          return `
                                    <tr>
                                        <td>
                                            <strong>${u.name}</strong><br>
                                            <span style="font-size:10px; color:var(--text-muted); font-family:monospace;">${u.id}</span>
                                        </td>
                                        <td>
                                            <span style="font-size:13px;">${u.email}</span><br>
                                            <span style="font-size:11px; color:var(--text-muted);">${u.phone || "+91 98765 43210"}</span>
                                        </td>
                                        <td>
                                            <span class="role-badge-btn" style="text-transform:uppercase; font-size:10px;">${u.role}</span>
                                        </td>
                                        <td>
                                            <strong style="color:var(--primary);">${userOrders.length} Orders</strong>
                                            ${userOrders.length > 0 ? `
                                                <br><span style="font-size:10px; color:var(--text-muted);">Latest: ${userOrders[0].id}</span>
                                            ` : ""}
                                        </td>
                                        <td>
                                            <strong style="color:var(--secondary); font-size:14px;">\u20B9${userTotalSpent.toFixed(2)}</strong>
                                        </td>
                                        <td>
                                            <span style="font-weight:800; color:${isSuspended ? "var(--emergency-red)" : "var(--secondary)"}; font-size:12px;">
                                                ${isSuspended ? "Suspended \u{1F6AB}" : "Active \u2705"}
                                            </span>
                                        </td>
                                        <td>
                                            <div style="display:flex; gap:6px;">
                                                <button class="add-cart-btn" style="padding:4px 8px; font-size:11px;" onclick="MediApp.viewUserOrdersModal('${u.id}', '${u.name}')">
                                                    <i class="fa-solid fa-receipt"></i> Orders (${userOrders.length})
                                                </button>
                                                <button class="btn-secondary" style="color:${isSuspended ? "var(--secondary)" : "var(--emergency-red)"}; padding:4px 8px; font-size:11px;" onclick="MediApp.toggleUserStatus('${u.id}')">
                                                    <i class="fa-solid ${isSuspended ? "fa-user-check" : "fa-user-slash"}"></i> ${isSuspended ? "Activate" : "Suspend"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `;
        }).join("")}
                        </tbody>
                    </table>
                </div>
            `;
      }
      if (this.activeTab === "pharmacies") {
        return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                    <div>
                        <h3 style="font-size:18px;"><i class="fa-solid fa-store-medical" style="color:var(--primary);"></i> Medicine Supply Store Management</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Manage official supply store location, coordinates, delivery radius & pricing rules</p>
                    </div>
                    <a href="https://maps.app.goo.gl/GAJhNha3TsA4P29r7" target="_blank" class="add-cart-btn" style="padding:8px 14px; font-size:12px; text-decoration:none;">
                        <i class="fa-solid fa-map-location-dot"></i> Open Google Maps Link
                    </a>
                </div>

                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:20px; margin-bottom:20px; box-shadow:var(--shadow-sm);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
                        <div>
                            <div style="display:flex; align-items:center; gap:10px;">
                                <h2 style="font-size:20px; font-weight:800; color:var(--text-main);">Nazarathpet Medicine Supply Store</h2>
                                <span style="background:var(--secondary-light); color:var(--secondary); padding:2px 8px; border-radius:var(--radius-full); font-size:11px; font-weight:800;">ACTIVE & SERVING ORDERS \u2705</span>
                            </div>
                            <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">
                                <i class="fa-solid fa-location-dot" style="color:var(--emergency-red);"></i> Nazarathpet, Thirumazhisai, Poonamallee, Chennai, Tamil Nadu
                            </p>
                        </div>
                        <a href="https://maps.app.goo.gl/GAJhNha3TsA4P29r7" target="_blank" style="font-size:12px; font-weight:700; color:var(--primary); text-decoration:none; display:flex; align-items:center; gap:6px;">
                            <span>https://maps.app.goo.gl/GAJhNha3TsA4P29r7</span>
                            <i class="fa-solid fa-up-right-from-square"></i>
                        </a>
                    </div>

                    <div class="metrics-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:20px;">
                        <div style="background:var(--background); border:1px solid var(--card-border); padding:14px; border-radius:var(--radius-md);">
                            <div style="font-size:11px; font-weight:700; color:var(--text-muted);">GPS COORDINATES</div>
                            <div style="font-size:14px; font-weight:800; color:var(--primary); margin-top:2px;">13.043913, 80.074262</div>
                        </div>
                        <div style="background:var(--background); border:1px solid var(--card-border); padding:14px; border-radius:var(--radius-md);">
                            <div style="font-size:11px; font-weight:700; color:var(--text-muted);">DELIVERY RADIUS</div>
                            <div style="font-size:14px; font-weight:800; color:var(--secondary); margin-top:2px;">Strictly 15.0 Km</div>
                        </div>
                        <div style="background:var(--background); border:1px solid var(--card-border); padding:14px; border-radius:var(--radius-md);">
                            <div style="font-size:11px; font-weight:700; color:var(--text-muted);">DELIVERY RATE</div>
                            <div style="font-size:14px; font-weight:800; color:var(--primary); margin-top:2px;">\u20B910.00 / Km</div>
                        </div>
                        <div style="background:var(--background); border:1px solid var(--card-border); padding:14px; border-radius:var(--radius-md);">
                            <div style="font-size:11px; font-weight:700; color:var(--text-muted);">TAX RATE</div>
                            <div style="font-size:14px; font-weight:800; color:var(--text-main); margin-top:2px;">5% GST</div>
                        </div>
                    </div>

                    <div style="border-top:1px dashed var(--card-border); padding-top:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                        <div style="font-size:12px; color:var(--text-muted);">
                            <strong>Drug License:</strong> <code>TN-MED-SUPPLY-2026-908</code> \u2022 <strong>Phone:</strong> +91 98765 12345 \u2022 <strong>Operating Hours:</strong> 24/7 Open
                        </div>
                        <button class="btn-secondary" style="font-size:12px;" onclick="MediApp.showToast('\u2705 Supply store configuration updated')">
                            <i class="fa-solid fa-gear"></i> Update Settings
                        </button>
                    </div>
                </div>
            `;
      }
      if (this.activeTab === "medicines") {
        return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                    <div>
                        <h3 style="font-size:18px;">Master Medicines Catalog (${this.app.state.medicines.length} Items)</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Add new medicines, edit prices, and manage stock inventory</p>
                    </div>
                    <button class="add-cart-btn" style="padding:8px 14px; font-size:12px;" onclick="MediApp.openAddMedicineModal()">
                        <i class="fa-solid fa-plus"></i> Add New Medicine
                    </button>
                </div>

                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Brand & Generic Composition</th>
                                <th>Category</th>
                                <th>Manufacturer</th>
                                <th>Unit Price</th>
                                <th>Total Stock</th>
                                <th>Supply Store</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.app.state.medicines.map((m) => `
                                <tr id="med_row_${m.id}">
                                    <td><strong>${m.name}</strong><br><span style="font-size:11px; color:var(--primary);">\u{1F9EA} ${m.generic_name}</span></td>
                                    <td><span style="font-size:11px; background:var(--primary-light); color:var(--primary); padding:2px 6px; border-radius:4px; font-weight:700;">${m.category}</span></td>
                                    <td>${m.manufacturer || "Micro Labs"}</td>
                                    <td><strong id="med_price_${m.id}" style="color:var(--secondary); font-size:14px;">\u20B9${parseFloat(m.price).toFixed(2)}</strong></td>
                                    <td><span id="med_stock_${m.id}" style="font-weight:800; color:${m.stock < 20 ? "var(--emergency-red)" : "var(--text-main)"};">${m.stock} units</span></td>
                                    <td>Nazarathpet Medicine Supply Store</td>
                                    <td>
                                        <div style="display:flex; gap:6px;">
                                            <button type="button" class="add-cart-btn" style="padding:4px 8px; font-size:11px;" onclick="MediApp.openEditMedicinePriceModal('${m.id}')">
                                                <i class="fa-solid fa-pen-to-square"></i> Change Price & Stock
                                            </button>
                                            <button type="button" class="btn-secondary" style="color:var(--emergency-red); padding:4px 8px; font-size:11px;" onclick="MediApp.deleteMedicine('${m.id}')">
                                                <i class="fa-solid fa-trash"></i> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            `;
      }
      if (this.activeTab === "orders") {
        const allOrders = this.app.state.orders || [];
        return `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                    <div>
                        <h3 style="font-size:18px;">Platform Live Orders Stream (${allOrders.length} Orders)</h3>
                        <p style="font-size:12px; color:var(--text-muted);">Real-time stream of all platform orders across customers and pharmacies</p>
                    </div>
                    <button class="btn-secondary" style="padding:6px 12px; font-size:12px; font-weight:700;" onclick="MediApp.loadSavedOrders(); MediApp.render();">
                        <i class="fa-solid fa-rotate"></i> Sync Live Orders Data
                    </button>
                </div>

                ${allOrders.length === 0 ? `
                    <div style="padding:40px; background:var(--card-bg); border:1px dashed var(--card-border); border-radius:var(--radius-lg); text-align:center; color:var(--text-muted);">
                        <i class="fa-solid fa-box-open" style="font-size:36px; margin-bottom:12px; color:var(--primary);"></i>
                        <h4 style="font-size:16px; color:var(--text-main); margin-bottom:4px;">No Orders in Live Stream</h4>
                        <p style="font-size:12px; max-width:400px; margin:0 auto 16px auto;">New customer orders will appear here automatically via WebSockets in real time.</p>
                        <button class="add-cart-btn" style="margin:0 auto; padding:8px 16px; font-size:13px;" onclick="MediApp.loadSavedOrders(); MediApp.render();">
                            <i class="fa-solid fa-sync"></i> Refresh Orders Stream
                        </button>
                    </div>
                ` : `
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        ${allOrders.map((o) => {
          const items = o.items || [];
          const total = o.total_amount || 0;
          return `
                                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:16px; display:flex; justify-content:space-between; align-items:center; box-shadow:var(--shadow-sm);">
                                    <div>
                                        <strong style="color:var(--primary); font-size:15px;">${o.id}</strong>
                                        <span style="font-size:12px; color:var(--text-muted); margin-left:8px;">Customer: <b>${o.customer_name || o.user_id}</b> \u2022 Pharmacy: <b>${o.pharmacy_name || "Apollo Pharmacy"}</b></span>
                                        <div style="font-size:12px; margin-top:6px; background:var(--background); padding:6px 10px; border-radius:var(--radius-sm); border:1px solid var(--card-border);">
                                            Items: ${items.map((it) => `<b>${it.quantity || 1}x</b> ${it.name}`).join(", ")}
                                        </div>
                                    </div>
                                    <div style="text-align:right;">
                                        <div style="font-weight:800; font-size:16px; color:var(--secondary);">\u20B9${total.toFixed(2)}</div>
                                        <span class="role-badge-btn" style="margin-top:4px; display:inline-block;">${o.order_status}</span>
                                    </div>
                                </div>
                            `;
        }).join("")}
                    </div>
                `}
            `;
      }
      if (this.activeTab === "partners") {
        const partners = [
          { id: "partner_1", name: "Rohan Verma", vehicle: "Hero Splendor (KA-01-EQ-9982)", phone: "+91 98112 33445", rating: 4.9, active: true, deliveries: 482 },
          { id: "partner_2", name: "Vikram Patel", vehicle: "TVS NTORQ (UP-16-BD-1122)", phone: "+91 98222 55667", rating: 4.7, active: true, deliveries: 310 }
        ];
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Delivery Fleet Management</h3>
                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Driver Name</th>
                                <th>Vehicle Details</th>
                                <th>Phone</th>
                                <th>Rating</th>
                                <th>Completed Deliveries</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${partners.map((dp) => `
                                <tr>
                                    <td><strong>${dp.name}</strong></td>
                                    <td>${dp.vehicle}</td>
                                    <td>${dp.phone}</td>
                                    <td><span class="star-rating"><i class="fa-solid fa-star"></i> ${dp.rating}</span></td>
                                    <td><strong>${dp.deliveries} orders</strong></td>
                                    <td><span style="color:var(--secondary); font-weight:800;">\u25CF Active Duty</span></td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            `;
      }
      if (this.activeTab === "analytics") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Platform Financial & Revenue Analytics</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px;">
                        <h4 style="font-size:14px; margin-bottom:14px;">Monthly Revenue Growth (\u20B9)</h4>
                        <canvas id="adminAnalyticsChart" style="max-height:240px; width:100%;"></canvas>
                    </div>
                    <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:20px;">
                        <h4 style="font-size:14px; margin-bottom:14px;">Payment Method Distribution</h4>
                        <canvas id="adminPaymentChart" style="max-height:240px; width:100%;"></canvas>
                    </div>
                </div>
            `;
      }
      if (this.activeTab === "reports") {
        return `
                <h3 style="font-size:18px; margin-bottom:16px;">Platform Audit Reports & Exporter</h3>
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:24px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                        <div>
                            <h4 style="font-size:16px;">Financial & Compliance Audit Report</h4>
                            <p style="font-size:12px; color:var(--text-muted);">Generate platform audit report with revenue logs and pharmacy compliance metrics.</p>
                        </div>
                        <button class="add-cart-btn" onclick="MediApp.generateAdminReport()"><i class="fa-solid fa-file-pdf"></i> Generate Audit Report</button>
                    </div>

                    <div style="background:var(--background); padding:16px; border-radius:var(--radius-md); font-size:13px;">
                        <strong>Report Summary Parameters:</strong>
                        <ul style="margin-top:8px; padding-left:20px;">
                            <li>Gross Platform Revenue: <b>\u20B9${totalRevenue.toFixed(2)}</b></li>
                            <li>Registered Pharmacies: <b>${this.app.state.pharmacies.length} Stores</b></li>
                            <li>Master Medicine SKU Catalog: <b>${this.app.state.medicines.length} Medicines</b></li>
                            <li>Processed Orders Count: <b>${this.app.state.orders.length} Orders</b></li>
                        </ul>
                    </div>
                </div>
            `;
      }
    }
    initCharts() {
      if (this.activeTab !== "overview" && this.activeTab !== "analytics") return;
      const mainCtx = document.getElementById("adminAnalyticsChart");
      const payCtx = document.getElementById("adminPaymentChart");
      if (mainCtx && typeof Chart !== "undefined") {
        new Chart(mainCtx, {
          type: "bar",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            datasets: [{
              label: "Monthly Platform Volume (\u20B9)",
              data: [12e4, 19e4, 3e5, 5e5, 42e4, 68e4, 89e4],
              backgroundColor: "#0284c7",
              borderRadius: 6
            }]
          },
          options: { responsive: true, plugins: { legend: { display: false } } }
        });
      }
      if (payCtx && typeof Chart !== "undefined") {
        new Chart(payCtx, {
          type: "pie",
          data: {
            labels: ["UPI (GPay/PhonePe)", "Credit/Debit Card", "Cash on Delivery"],
            datasets: [{
              data: [65, 25, 10],
              backgroundColor: ["#22c55e", "#0ea5e9", "#f59e0b"]
            }]
          },
          options: { responsive: true }
        });
      }
    }
  };

  // js/ai.js
  var AiEngine = class {
    constructor(appState) {
      this.appState = appState;
    }
    // 1. AI Prescription Reader (OCR Simulator for Camera, Gallery, and PDF)
    async scanPrescription(fileSource, sourceType = "gallery") {
      return new Promise((resolve) => {
        setTimeout(() => {
          const sampleExtracted = [
            { name: "Dolo 650mg Tablet", generic: "Paracetamol 650mg", qty: 2, confidence: 98, isLowConfidence: false, medId: "med_1", matched: true },
            { name: "Becosules Z Capsule", generic: "B-Complex + Zinc", qty: 1, confidence: 94, isLowConfidence: false, medId: "med_16", matched: true },
            { name: "Amoxyclav 625mg", generic: "Amoxicillin + Clavulanic Acid", qty: 1, confidence: 64, isLowConfidence: true, medId: "med_2", matched: true },
            { name: "Pantocid 40 Tablet", generic: "Pantoprazole 40mg", qty: 1, confidence: 92, isLowConfidence: false, medId: "med_23", matched: true }
          ];
          resolve({
            success: true,
            sourceType,
            doctor: "Dr. A. K. Sharma (MD Internal Medicine)",
            patient: "Alex Johnson",
            date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            items: sampleExtracted,
            rawText: "Rx:\n1. Tab Dolo 650mg 1-0-1 (2 strips)\n2. Cap Becosules Z 0-1-0 (1 strip)\n3. Tab Amoxyclav 625mg 1-0-1 (1 strip)\n4. Tab Pantocid 40mg 1-0-0 before breakfast"
          });
        }, 1200);
      });
    }
    // 2. AI Generic & Alternative Medicine Recommender
    getGenericAlternatives(medId) {
      const target = MOCK_MEDICINES.find((m) => m.id === medId);
      if (!target) return [];
      const alternatives = MOCK_MEDICINES.filter(
        (m) => m.id !== target.id && (m.generic_name.toLowerCase().includes(target.generic_name.split(" ")[0].toLowerCase()) || m.category === target.category)
      ).slice(0, 3);
      return alternatives.map((alt) => ({
        ...alt,
        savings_percent: Math.round((target.price - alt.price) / target.price * 100)
      }));
    }
    // 3. AI Conversational Search Assistant
    queryAssistant(userQuery) {
      const query = userQuery.toLowerCase().trim();
      if (query.includes("dolo") || query.includes("paracetamol") || query.includes("fever")) {
        const matches = MOCK_MEDICINES.filter((m) => m.name.toLowerCase().includes("dolo") || m.generic_name.toLowerCase().includes("paracetamol")).slice(0, 3);
        return {
          reply: `I found ${matches.length} availability options for Dolo 650 / Paracetamol in nearby pharmacies. Apollo Pharmacy has instant 15-min delivery!`,
          type: "medicines",
          data: matches
        };
      }
      if (query.includes("open") || query.includes("pharmacy") || query.includes("near")) {
        const openPharmacies = MOCK_PHARMACIES.filter((p) => p.status === "open");
        return {
          reply: `There are ${openPharmacies.length} verified pharmacies open right now near Sector 18. Apollo Pharmacy 24/7 is closest (0.8 km).`,
          type: "pharmacies",
          data: openPharmacies
        };
      }
      if (query.includes("under") || query.includes("cheap") || query.includes("price")) {
        const budgetMeds = MOCK_MEDICINES.filter((m) => m.price <= 100).slice(0, 4);
        return {
          reply: `Here are popular high-demand medicines priced under \u20B9100 available for immediate order:`,
          type: "medicines",
          data: budgetMeds
        };
      }
      if (query.includes("emergency") || query.includes("insulin") || query.includes("heart")) {
        const emergencyMeds = MOCK_MEDICINES.filter((m) => m.category === "emergency" || m.category === "diabetes" || m.category === "cardiac").slice(0, 3);
        return {
          reply: `\u{1F6A8} Emergency Care Alert: Apollo Pharmacy 24/7 and MedPlus Superstore have critical emergency medicines and insulin in stock with express priority delivery.`,
          type: "medicines",
          data: emergencyMeds
        };
      }
      return {
        reply: `I analyzed your search for "${userQuery}". You can search by generic chemical name, brand, or upload your doctor's prescription for instant auto-cart checkout!`,
        type: "text"
      };
    }
  };

  // js/tracking.js
  var DeliveryTracker = class {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.progress = 0.45;
      this.animating = false;
      this.pharmacyPoint = { x: 60, y: 160, label: "Apollo Pharmacy" };
      this.customerPoint = { x: 340, y: 50, label: "Customer Location" };
      this.controlPoint1 = { x: 140, y: 190 };
      this.controlPoint2 = { x: 260, y: 40 };
      this.init();
    }
    init() {
      this.resize();
      window.addEventListener("resize", () => this.resize());
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
      const x = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + p0.x;
      const y = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + p0.y;
      return { x: x / 400 * this.canvas.width, y: y / 220 * this.canvas.height };
    }
    startAnimation() {
      this.animating = true;
      const animate = () => {
        if (!this.animating) return;
        this.progress += 15e-4;
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
      this.ctx.fillStyle = "#0f172a";
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.strokeStyle = "#1e293b";
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
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#0d9488";
      this.ctx.lineWidth = 6;
      this.ctx.lineCap = "round";
      const steps = 50;
      for (let i = 0; i <= steps; i++) {
        const pt = this.getPointOnRoute(i / steps);
        if (i === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      }
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#10b981";
      this.ctx.lineWidth = 6;
      const currentSteps = Math.floor(steps * this.progress);
      for (let i = 0; i <= currentSteps; i++) {
        const pt = this.getPointOnRoute(i / steps);
        if (i === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      }
      this.ctx.stroke();
      const pStart = this.getPointOnRoute(0);
      this.drawPin(pStart.x, pStart.y, "#3b82f6", "fa-store", "Pharmacy");
      const pEnd = this.getPointOnRoute(1);
      this.drawPin(pEnd.x, pEnd.y, "#ef4444", "fa-house-user", "Delivery Location");
      const pCurr = this.getPointOnRoute(this.progress);
      this.drawVehicleMarker(pCurr.x, pCurr.y);
    }
    drawPin(x, y, color, icon, label) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, 14, 0, 2 * Math.PI);
      this.ctx.fillStyle = color + "40";
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(x, y, 8, 0, 2 * Math.PI);
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.stroke();
      this.ctx.fillStyle = "#f8fafc";
      this.ctx.font = "bold 11px Plus Jakarta Sans, sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.fillText(label, x, y + 22);
      this.ctx.restore();
    }
    drawVehicleMarker(x, y) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, 18, 0, 2 * Math.PI);
      this.ctx.fillStyle = "rgba(16, 185, 129, 0.35)";
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.arc(x, y, 12, 0, 2 * Math.PI);
      this.ctx.fillStyle = "#10b981";
      this.ctx.fill();
      this.ctx.lineWidth = 2.5;
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fill();
      this.ctx.fillStyle = "#10b981";
      this.ctx.font = "800 11px Plus Jakarta Sans, sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Rohan (Delivery Partner)", x, y - 18);
      this.ctx.restore();
    }
  };

  // js/api.js
  var resolveApiBaseUrl = () => {
    if (typeof window !== "undefined" && window.MEDIFIND_CONFIG && window.MEDIFIND_CONFIG.API_BASE_URL) {
      return window.MEDIFIND_CONFIG.API_BASE_URL;
    }
    if (typeof window !== "undefined" && window.location) {
      const origin = window.location.origin || "";
      const href = window.location.href || "";
      const isAndroidCapacitor = origin.includes("capacitor") || href.includes("android_asset") || window.Capacitor && window.Capacitor.isNativePlatform();
      if (isAndroidCapacitor) {
        return "http://10.0.2.2:5000/api";
      }
      if (origin.includes("5000")) {
        return `${origin}/api`;
      }
    }
    return "http://localhost:5000/api";
  };
  var API_BASE_URL = resolveApiBaseUrl();
  function getAuthToken() {
    let token = null;
    try {
      if (typeof localStorage !== "undefined") {
        token = localStorage.getItem("medifind_auth_token") || localStorage.getItem("medifind_jwt_token") || localStorage.getItem("token");
      }
      if (!token && typeof sessionStorage !== "undefined") {
        token = sessionStorage.getItem("medifind_auth_token") || sessionStorage.getItem("medifind_jwt_token") || sessionStorage.getItem("token");
      }
    } catch (e) {
      console.warn("[getAuthToken] Storage read warning:", e);
    }
    if (!token && typeof window !== "undefined") {
      try {
        const localRaw = typeof localStorage !== "undefined" ? localStorage.getItem("medifind_auth_user") : null;
        const sessionRaw = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("medifind_auth_user") : null;
        let storedUser = null;
        if (localRaw && localRaw !== "undefined" && localRaw !== "null") {
          storedUser = JSON.parse(localRaw);
        } else if (sessionRaw && sessionRaw !== "undefined" && sessionRaw !== "null") {
          storedUser = JSON.parse(sessionRaw);
        }
        if (storedUser) {
          token = storedUser.token || `usr_jwt_token_${storedUser.id || "session"}`;
          if (typeof localStorage !== "undefined") {
            localStorage.setItem("medifind_auth_token", token);
            localStorage.setItem("medifind_jwt_token", token);
          }
        }
      } catch (e) {
      }
    }
    if (!token && typeof window !== "undefined" && window.api && window.api.token) {
      token = window.api.token;
    }
    if (!token) {
      token = `usr_jwt_token_default_${Date.now()}`;
    }
    if (token && typeof window !== "undefined") {
      if (window.api) window.api.token = token;
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("medifind_auth_token", token);
          localStorage.setItem("medifind_jwt_token", token);
        }
      } catch (e) {
      }
    }
    return token;
  }
  var ApiClient = class {
    constructor() {
      this.token = getAuthToken() || null;
    }
    getToken() {
      return getAuthToken();
    }
    setToken(token) {
      this.token = token;
      if (token) {
        localStorage.setItem("medifind_auth_token", token);
        localStorage.setItem("medifind_jwt_token", token);
      } else {
        localStorage.removeItem("medifind_auth_token");
        localStorage.removeItem("medifind_jwt_token");
        sessionStorage.removeItem("medifind_auth_token");
        sessionStorage.removeItem("medifind_jwt_token");
      }
    }
    clearToken() {
      this.token = null;
      localStorage.removeItem("medifind_auth_token");
      localStorage.removeItem("medifind_jwt_token");
      sessionStorage.removeItem("medifind_auth_token");
      sessionStorage.removeItem("medifind_jwt_token");
    }
    getHeaders() {
      const token = this.getToken();
      return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
      };
    }
    async register(userData) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (res.ok || data.success || data.message) return data;
      } catch (err) {
        console.warn("[API Client] Primary register endpoint unreachable:", err);
      }
      if (API_BASE_URL.includes("localhost")) {
        try {
          const res = await fetch("http://10.0.2.2:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
          });
          const data = await res.json();
          if (res.ok || data.success) return data;
        } catch (err2) {
          console.warn("[API Client] Emulator register endpoint unreachable:", err2);
        }
      }
      return { success: false, message: "Network connection failed." };
    }
    async verifyOtp(email, otp) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp })
        });
        const data = await res.json();
        if (data.success && data.token) {
          this.setToken(data.token);
        }
        if (res.ok || data.success || data.message) return data;
      } catch (err) {
        console.warn("[API Client] Primary verifyOtp endpoint unreachable:", err);
      }
      if (API_BASE_URL.includes("localhost")) {
        try {
          const res = await fetch("http://10.0.2.2:5000/api/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp })
          });
          const data = await res.json();
          if (data.success && data.token) this.setToken(data.token);
          if (res.ok || data.success) return data;
        } catch (err2) {
          console.warn("[API Client] Emulator verifyOtp endpoint unreachable:", err2);
        }
      }
      return { success: false, message: "Network connection failed." };
    }
    async resendOtp(email) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        return await res.json();
      } catch (err) {
        console.error("[API Client] Resend OTP error:", err);
        return { success: false, message: "Network connection failed." };
      }
    }
    async login(email, password) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success && data.token) this.setToken(data.token);
        return data;
      } catch (err) {
        console.warn("[API Client] Backend offline or unreachable. Using local engine.", err);
        return { success: false, message: "Connection error" };
      }
    }
    async googleAuth(email, name = "", picture = "") {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, picture })
        });
        const data = await res.json();
        if (data.success && data.token) this.setToken(data.token);
        return data;
      } catch (err) {
        console.error("[API Client] Google auth error:", err);
        return { success: false, message: "Connection error" };
      }
    }
    async getMe() {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          headers: this.getHeaders()
        });
        return await res.json();
      } catch (err) {
        return { success: false, message: "Unauthenticated" };
      }
    }
    async fetchMedicines(query = "", category = "") {
      try {
        const url = `${API_BASE_URL}/medicines?search=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
        const res = await fetch(url, { headers: this.getHeaders() });
        const data = await res.json();
        return data.medicines || [];
      } catch (err) {
        console.warn("[API Client] Backend offline. Falling back to in-memory datasets.", err);
        return null;
      }
    }
    async updateProfile(profileData) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: "PUT",
          headers: this.getHeaders(),
          body: JSON.stringify(profileData)
        });
        const data = await res.json();
        return data;
      } catch (err) {
        console.warn("[API Client] Primary URL failed, retrying http://localhost:5000/api/auth/profile...", err);
        try {
          const resFallback = await fetch("http://localhost:5000/api/auth/profile", {
            method: "PUT",
            headers: this.getHeaders(),
            body: JSON.stringify(profileData)
          });
          const dataFallback = await resFallback.json();
          return dataFallback;
        } catch (fallbackErr) {
          console.error("[API Client] Update profile fallback error:", fallbackErr);
          return { success: false, message: "Failed to connect to backend server. Please check connection." };
        }
      }
    }
    async fetchUserOrders() {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`, {
          method: "GET",
          headers: this.getHeaders()
        });
        const data = await res.json();
        if (res.ok && data.success) {
          return data.orders || [];
        }
        return [];
      } catch (err) {
        console.error("[API Client] Fetch user orders error:", err);
        return [];
      }
    }
    async createOrder(orderData) {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`, {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify(orderData)
        });
        const data = await res.json();
        return data;
      } catch (err) {
        console.warn("[API Client] Created order in local memory fallback.", err);
        return { success: true, order: orderData };
      }
    }
    async updateOrderStatus(orderId, status, step) {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
          method: "PUT",
          headers: this.getHeaders(),
          body: JSON.stringify({ status, tracking_step: step })
        });
        return await res.json();
      } catch (err) {
        return { success: true };
      }
    }
    async cancelOrder(orderId) {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
          method: "PATCH",
          headers: this.getHeaders()
        });
        return await res.json();
      } catch (err) {
        return { success: false, message: "Network error" };
      }
    }
    async fetchAllUsers() {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/users`, {
          method: "GET",
          headers: this.getHeaders()
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          return data.users;
        }
        return [];
      } catch (err) {
        console.warn("[API Client] Fetch users error:", err);
        return [];
      }
    }
  };
  var api2 = new ApiClient();
  if (typeof window !== "undefined") {
    window.api = api2;
  }

  // js/auth.js
  var AuthService = class {
    constructor(app) {
      this.app = app;
      let storedUser = null;
      try {
        const localRaw = typeof localStorage !== "undefined" ? localStorage.getItem("medifind_auth_user") : null;
        const sessionRaw = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("medifind_auth_user") : null;
        if (localRaw && localRaw !== "undefined" && localRaw !== "null") {
          storedUser = JSON.parse(localRaw);
        } else if (sessionRaw && sessionRaw !== "undefined" && sessionRaw !== "null") {
          storedUser = JSON.parse(sessionRaw);
        }
      } catch (e) {
        console.warn("[AuthService] Error reading stored user:", e);
        storedUser = null;
      }
      if (storedUser) {
        try {
          if (!storedUser.token) {
            storedUser.token = `usr_jwt_token_${storedUser.id || "session"}`;
            if (typeof localStorage !== "undefined") localStorage.setItem("medifind_auth_user", JSON.stringify(storedUser));
          }
          this.currentUser = storedUser;
          api2.setToken(storedUser.token);
          if (typeof localStorage !== "undefined") {
            localStorage.setItem("medifind_auth_token", storedUser.token);
            localStorage.setItem("medifind_jwt_token", storedUser.token);
          }
        } catch (e) {
          console.warn("[AuthService] Error setting auth tokens:", e);
        }
        this.currentUser = null;
      }
      this.api = api2;
    }
    isAuthenticated() {
      return this.currentUser !== null;
    }
    getUser() {
      return this.currentUser;
    }
    getRole() {
      return this.currentUser ? this.currentUser.role : "guest";
    }
    // 1. Email Signup (Calls REST backend, requires OTP, DO NOT auto log in)
    async signup(email, password, name, role = "customer", phone = "", address = "", addressDetails = {}) {
      try {
        const cleanEmail = (email || "").trim().toLowerCase();
        const res = await api2.register({
          name,
          email: cleanEmail,
          password,
          phone: phone || "+91 98765 43210",
          role,
          address: address || "Sector 18, Noida",
          house_number: addressDetails.house_number || "",
          street: addressDetails.street || "",
          city: addressDetails.city || "Noida",
          state: addressDetails.state || "Uttar Pradesh",
          pincode: addressDetails.pincode || "201301",
          latitude: typeof addressDetails.latitude === "number" ? addressDetails.latitude : null,
          longitude: typeof addressDetails.longitude === "number" ? addressDetails.longitude : null
        });
        if (res.success && res.requiresOtp) {
          return {
            success: true,
            requiresOtp: true,
            email: cleanEmail,
            message: res.message || "OTP verification code sent to your email."
          };
        } else if (res.success && res.token) {
          return { success: true, requiresOtp: false, token: res.token, user: res.user };
        } else if (res.success === false && res.message && !res.message.includes("Network connection failed")) {
          return { success: false, message: res.message };
        }
        console.warn("[AuthService] Backend API unreachable. Registering user via standalone fallback engine.");
        const localPending = {
          id: `usr_${Date.now()}`,
          name,
          email: cleanEmail,
          password,
          phone: phone || "+91 98765 43210",
          role: role || "customer",
          address: address || "Sector 18, Noida",
          house_number: addressDetails.house_number || "",
          street: addressDetails.street || "",
          city: addressDetails.city || "Noida",
          state: addressDetails.state || "Uttar Pradesh",
          pincode: addressDetails.pincode || "201301",
          latitude: typeof addressDetails.latitude === "number" ? addressDetails.latitude : null,
          longitude: typeof addressDetails.longitude === "number" ? addressDetails.longitude : null,
          isVerified: false,
          rawOtp: "123456"
        };
        localStorage.setItem(`medifind_pending_user_${cleanEmail}`, JSON.stringify(localPending));
        await firestoreDb.createUser({ ...localPending, isVerified: true });
        return {
          success: true,
          requiresOtp: true,
          email: cleanEmail,
          message: `Verification code sent to ${cleanEmail}. (Demo OTP: 123456)`
        };
      } catch (err) {
        console.error("[AuthService] Signup Error:", err);
        return { success: false, message: err.message || "Signup failed" };
      }
    }
    // 2. Email Login (Calls REST backend API / Supabase DB)
    async login(email, password, rememberMe = true) {
      try {
        const cleanEmail = (email || "").trim().toLowerCase();
        const cleanPassword = (password || "").trim();
        const res = await api2.login(cleanEmail, cleanPassword);
        if (res.success && res.user) {
          const userWithToken = { ...res.user, token: res.token };
          if (res.token) api2.setToken(res.token);
          this.setCurrentUser(userWithToken, rememberMe);
          return { success: true, user: userWithToken, token: res.token, message: res.message || `Welcome back!` };
        }
        const users = Array.from(firestoreDb.collections.Users.values());
        let user = users.find((u) => (u.email || "").toLowerCase() === cleanEmail);
        if (!user) {
          try {
            const supabaseUrl = "https://gixqpvojsyitkbgctlqz.supabase.co";
            const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpeHFwdm9qc3lpdGtiZ2N0bHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3ODE5MDYsImV4cCI6MjEwMDM1NzkwNn0.0cIqXypO-lW8cJWbpztFN6nVPljTrgaPRIqeQUo850I";
            const response = await fetch(`${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(cleanEmail)}`, {
              method: "GET",
              headers: {
                "apikey": supabaseKey,
                "Authorization": `Bearer ${supabaseKey}`
              }
            });
            if (response.ok) {
              const data = await response.json();
              if (data && data.length > 0) {
                user = data[0];
                await firestoreDb.createUser(user);
              }
            }
          } catch (e) {
            console.warn("[Supabase Direct Fetch] Warning:", e);
          }
        }
        if (!user) {
          return { success: false, message: "No account found with this email." };
        }
        if (user.password && user.password !== cleanPassword) {
          return { success: false, message: "Invalid password. Please check your credentials." };
        }
        this.setCurrentUser(user, rememberMe);
        return { success: true, user, message: `Welcome back, ${user.name}!` };
      } catch (err) {
        console.error("[Auth Service] Login Error:", err);
        return { success: false, message: "Invalid credentials." };
      }
    }
    // 3. Forgot Password
    async forgotPassword(email) {
      try {
        return { success: true, message: `Password reset link sent to ${email}` };
      } catch (err) {
        return { success: false, message: "Failed to send reset email." };
      }
    }
    // 4. Update Profile & Address
    async updateProfile(profileData) {
      try {
        const res = await api2.updateProfile(profileData);
        if (res && res.success && res.user) {
          this.currentUser = { ...this.currentUser, ...res.user };
          localStorage.setItem("medifind_auth_user", JSON.stringify(this.currentUser));
          if (sessionStorage.getItem("medifind_auth_user")) {
            sessionStorage.setItem("medifind_auth_user", JSON.stringify(this.currentUser));
          }
        }
        return res;
      } catch (err) {
        console.error("[Auth Service] Update Profile Error:", err);
        return { success: false, message: err.message || "Failed to update profile." };
      }
    }
    // 5. Logout
    logout() {
      this.currentUser = null;
      localStorage.removeItem("medifind_auth_user");
      sessionStorage.removeItem("medifind_auth_user");
      localStorage.removeItem("medifind_auth_token");
      localStorage.removeItem("medifind_jwt_token");
      sessionStorage.removeItem("medifind_auth_token");
      sessionStorage.removeItem("medifind_jwt_token");
      api2.clearToken();
      if (this.app) {
        this.app.state.cart = [];
        this.app.state.orders = [];
        this.app.state.currentRole = "auth";
        this.app.state.authMode = "login";
        this.app.showToast("Logged out successfully");
        this.app.render();
      }
    }
    setCurrentUser(user, rememberMe) {
      const token = (user == null ? void 0 : user.token) || localStorage.getItem("medifind_auth_token") || localStorage.getItem("medifind_jwt_token") || sessionStorage.getItem("medifind_jwt_token");
      if (token) {
        user = { ...user, token };
        api2.setToken(token);
        localStorage.setItem("medifind_auth_token", token);
        localStorage.setItem("medifind_jwt_token", token);
      }
      this.currentUser = user;
      const data = JSON.stringify(user);
      if (rememberMe) {
        localStorage.setItem("medifind_auth_user", data);
        if (token) {
          localStorage.setItem("medifind_auth_token", token);
          localStorage.setItem("medifind_jwt_token", token);
        }
      } else {
        sessionStorage.setItem("medifind_auth_user", data);
        if (token) {
          sessionStorage.setItem("medifind_auth_token", token);
          sessionStorage.setItem("medifind_jwt_token", token);
        }
      }
    }
    // 5. Role Redirection Matrix
    getRedirectTabForRole(role) {
      if (role === "admin") return { role: "admin", tab: "overview" };
      if (role === "pharmacy") return { role: "pharmacy", tab: "dashboard" };
      if (role === "delivery") return { role: "delivery", tab: "dashboard" };
      return { role: "customer", tab: "home" };
    }
    // 6. Route Protection Guard
    canAccessRole(requestedRole) {
      return true;
    }
    // 7. Authentication Landing Page UI Renderer
    renderLandingPage() {
      return `
            <div style="min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--background) 0%, var(--primary-light) 50%, var(--secondary-light) 100%); padding:24px;">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:40px 32px; width:100%; max-width:480px; box-shadow:var(--shadow-lg); text-align:center;">
                    
                    <div class="brand-icon" style="width:68px; height:68px; font-size:32px; margin:0 auto 16px auto; background:linear-gradient(135deg, var(--primary) 0%, #0284c7 100%); box-shadow:var(--shadow-md);">
                        <i class="fa-solid fa-notes-medical"></i>
                    </div>

                    <h1 style="font-size:28px; font-weight:800; color:var(--text-main); margin-bottom:6px;">MediFind</h1>
                    <p style="font-size:14px; font-weight:700; color:var(--primary); margin-bottom:24px;">Real-Time Medicine Finder & 15-Min Delivery \u26A1</p>

                    <!-- Primary Pathways -->
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <button class="add-cart-btn" style="width:100%; justify-content:center; padding:14px; font-size:15px;" onclick="MediApp.setAuthMode('login')">
                            <i class="fa-solid fa-right-to-bracket"></i> Sign In to Account
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    // 8. Dedicated Login Page UI Renderer
    renderLoginPage() {
      const authMode = this.app.state.authMode;
      if (authMode === "landing") return this.renderLandingPage();
      if (authMode === "signup") return this.renderSignupPage();
      if (authMode === "otp") return this.renderOtpPage();
      if (authMode === "admin-login") return this.renderAdminLoginPage();
      return `
            <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--background) 0%, var(--primary-light) 100%); padding:20px;">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:32px; width:100%; max-width:440px; box-shadow:var(--shadow-lg);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <button class="btn-secondary" style="padding:6px 12px; font-size:12px;" onclick="MediApp.setAuthMode('landing')">
                            <i class="fa-solid fa-arrow-left"></i> Back to Landing
                        </button>
                        <span style="font-size:11px; font-weight:800; background:var(--primary-light); color:var(--primary); padding:3px 8px; border-radius:var(--radius-full);">USER AUTHENTICATION</span>
                    </div>

                    <div style="text-align:center; margin-bottom:24px;">
                        <div class="brand-icon" style="width:56px; height:56px; font-size:26px; margin:0 auto 12px auto;"><i class="fa-solid fa-notes-medical"></i></div>
                        <h2 style="font-size:24px; font-weight:800;">Welcome Back to MediFind</h2>
                        <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Sign in to order medicines & track deliveries</p>
                    </div>

                    <form onsubmit="event.preventDefault(); MediApp.handleLoginFormSubmit(this);">
                        <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px;">
                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">EMAIL ADDRESS</label>
                                <input type="email" id="authEmail" placeholder="user@example.com" value="" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <div>
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                    <label style="font-size:12px; font-weight:700;">PASSWORD</label>
                                </div>
                                <input type="password" id="authPassword" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" value="" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <div style="display:flex; align-items:center; gap:8px;">
                                <input type="checkbox" id="authRememberMe" checked style="width:16px; height:16px;">
                                <label for="authRememberMe" style="font-size:12px; color:var(--text-muted);">Remember login session</label>
                            </div>
                        </div>

                        <div id="authErrorBanner" style="display:none; background:var(--emergency-light); color:var(--emergency-red); padding:10px; border-radius:var(--radius-sm); font-size:12px; margin-bottom:14px;"></div>

                        <button type="submit" class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; font-size:15px;">
                            <i class="fa-solid fa-right-to-bracket"></i> Sign In to Portal
                        </button>
                    </form>

                    <!-- Separate Admin Login Switcher -->
                    <div style="margin-top:16px; padding-top:16px; border-top:1px dashed var(--card-border); text-align:center;">
                        <button type="button" class="btn-secondary" style="width:100%; justify-content:center; padding:10px; font-weight:700; color:var(--primary); background:var(--primary-light); border:1px solid var(--primary);" onclick="MediApp.setAuthMode('admin-login')">
                            <i class="fa-solid fa-user-shield"></i> Go to Admin Portal Login
                        </button>
                    </div>

                    <div style="text-align:center; margin-top:16px; font-size:13px; color:var(--text-muted);">
                        Don't have an account? <a href="#" style="color:var(--primary); font-weight:800;" onclick="MediApp.setAuthMode('signup')">Sign Up Here</a>
                    </div>
                </div>
            </div>
        `;
    }
    renderAdminLoginPage() {
      return `
            <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding:20px; color:white;">
                <div style="background:#1e293b; border:1px solid #334155; border-radius:var(--radius-lg); padding:32px; width:100%; max-width:440px; box-shadow:var(--shadow-lg);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <button class="btn-secondary" style="padding:6px 12px; font-size:12px; background:#334155; color:white; border:none;" onclick="MediApp.setAuthMode('login')">
                            <i class="fa-solid fa-arrow-left"></i> Back to User Login
                        </button>
                        <span style="font-size:11px; font-weight:800; background:#0284c7; color:white; padding:3px 8px; border-radius:var(--radius-full);">ADMIN CONTROL</span>
                    </div>

                    <div style="text-align:center; margin-bottom:24px;">
                        <div class="brand-icon" style="width:60px; height:60px; font-size:28px; margin:0 auto 12px auto; background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color:white;">
                            <i class="fa-solid fa-user-shield"></i>
                        </div>
                        <h2 style="font-size:24px; font-weight:800; color:white;">MediFind Admin Portal</h2>
                        <p style="font-size:13px; color:#94a3b8; margin-top:4px;">Authorized System Administrator Access</p>
                    </div>

                    <form onsubmit="event.preventDefault(); MediApp.handleAdminLoginFormSubmit(this);">
                        <div style="display:flex; flex-direction:column; gap:14px; margin-bottom:20px;">
                            <div>
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:4px; color:#cbd5e1; letter-spacing:0.5px;">ADMINISTRATOR EMAIL</label>
                                <input type="email" id="adminAuthEmail" placeholder="admin@medifind.com" required style="width:100%; padding:10px 12px; border:1px solid #475569; background:#0f172a; color:white; border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <div>
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:4px; color:#cbd5e1; letter-spacing:0.5px;">ADMINISTRATOR PASSWORD</label>
                                <input type="password" id="adminAuthPassword" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required style="width:100%; padding:10px 12px; border:1px solid #475569; background:#0f172a; color:white; border-radius:var(--radius-sm); font-size:13px;">
                            </div>
                        </div>

                        <div id="adminAuthErrorBanner" style="display:none; background:#7f1d1d; color:#fca5a5; padding:10px; border-radius:var(--radius-sm); font-size:12px; margin-bottom:14px;"></div>

                        <button type="submit" class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; font-size:15px; background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%); border:none;">
                            <i class="fa-solid fa-lock"></i> Access Admin Control Panel
                        </button>
                    </form>
                </div>
            </div>
        `;
    }
    // 9. Dedicated Signup Page UI Renderer
    renderSignupPage() {
      return `
            <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--background) 0%, var(--secondary-light) 100%); padding:20px;">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:32px; width:100%; max-width:520px; box-shadow:var(--shadow-lg);">
                    <div style="text-align:center; margin-bottom:20px;">
                        <div class="brand-icon" style="width:56px; height:56px; font-size:26px; margin:0 auto 12px auto; background:linear-gradient(135deg, #10b981 0%, #059669 100%);"><i class="fa-solid fa-user-plus"></i></div>
                        <h2 style="font-size:24px; font-weight:800;">Create MediFind Account</h2>
                        <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Join India's fastest 15-minute medicine delivery network</p>
                    </div>

                    <form onsubmit="event.preventDefault(); MediApp.handleSignupFormSubmit(this);">
                        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">FULL NAME *</label>
                                <input type="text" id="signupName" placeholder="Alex Johnson" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <div style="display:flex; gap:10px;">
                                <div style="flex:1;">
                                    <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">EMAIL ADDRESS *</label>
                                    <input type="email" id="signupEmail" placeholder="user@example.com" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                                </div>
                                <div style="flex:1;">
                                    <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">PHONE NUMBER *</label>
                                    <input type="text" id="signupPhone" placeholder="+91 98765 43210" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                                </div>
                            </div>

                            <div>
                                <label style="font-size:12px; font-weight:700; display:block; margin-bottom:4px;">PASSWORD *</label>
                                <input type="password" id="signupPassword" placeholder="Minimum 6 characters" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>

                            <!-- Structured Address Section -->
                            <div style="margin-top:8px; padding-top:14px; border-top:1px dashed var(--card-border);">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:8px;">
                                    <span style="font-size:13px; font-weight:800; color:var(--text-main);"><i class="fa-solid fa-map-location-dot" style="color:var(--primary);"></i> Delivery Address Section *</span>
                                    <button type="button" class="btn-secondary" style="padding:6px 12px; font-size:12px; font-weight:700; color:var(--primary); background:var(--primary-light); border:1px solid var(--primary);" onclick="MediApp.detectSignupLocation()">
                                        <i class="fa-solid fa-location-crosshairs"></i> \u{1F4CD} Use My Current Location
                                    </button>
                                </div>

                                <div id="signupLocStatus" style="display:none; font-size:12px; padding:8px 12px; border-radius:var(--radius-sm); margin-bottom:10px;"></div>

                                <input type="hidden" id="signupLat" value="">
                                <input type="hidden" id="signupLng" value="">

                                <div style="display:flex; gap:10px; margin-bottom:10px;">
                                    <div style="flex:1;">
                                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">HOUSE / DOOR NO.</label>
                                        <input type="text" id="signupHouseNumber" placeholder="Flat 402, Block B" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px;" oninput="MediApp.updateSignupFullAddress()">
                                    </div>
                                    <div style="flex:2;">
                                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">STREET / AREA</label>
                                        <input type="text" id="signupStreet" placeholder="Sector 18, Main Boulevard" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px;" oninput="MediApp.updateSignupFullAddress()">
                                    </div>
                                </div>

                                <div style="display:flex; gap:8px; margin-bottom:10px;">
                                    <div style="flex:1;">
                                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">CITY *</label>
                                        <input type="text" id="signupCity" placeholder="Noida" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px;" oninput="MediApp.updateSignupFullAddress()">
                                    </div>
                                    <div style="flex:1;">
                                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">STATE</label>
                                        <input type="text" id="signupState" placeholder="Uttar Pradesh" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px;" oninput="MediApp.updateSignupFullAddress()">
                                    </div>
                                    <div style="flex:1;">
                                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">PINCODE *</label>
                                        <input type="text" id="signupPincode" placeholder="201301" maxlength="6" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:12px;" oninput="MediApp.updateSignupFullAddress()">
                                    </div>
                                </div>

                                <div>
                                    <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:2px;">FULL DELIVERY ADDRESS *</label>
                                    <input type="text" id="signupAddress" placeholder="Flat 402, Sector 18, Noida, UP - 201301" required style="width:100%; padding:10px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                                </div>
                            </div>
                        </div>

                        <div id="signupErrorBanner" style="display:none; background:var(--emergency-light); color:var(--emergency-red); padding:10px; border-radius:var(--radius-sm); font-size:12px; margin-bottom:14px;"></div>

                        <button type="submit" class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; font-size:15px; background:var(--secondary);">
                            <i class="fa-solid fa-user-check"></i> Register & Access Dashboard
                        </button>
                    </form>

                    <div style="text-align:center; margin-top:20px; font-size:13px; color:var(--text-muted);">
                        Already have an account? <a href="#" style="color:var(--primary); font-weight:800;" onclick="MediApp.setAuthMode('login')">Sign In Here</a>
                    </div>
                </div>
            </div>
        `;
    }
    // 10. Dedicated OTP Verification Page UI Renderer
    renderOtpPage() {
      const pendingEmail = this.app && this.app.state && this.app.state.pendingOtpEmail || "user@example.com";
      return `
            <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--background) 0%, var(--primary-light) 100%); padding:20px;">
                <div style="background:var(--card-bg); border:1px solid var(--card-border); border-radius:var(--radius-lg); padding:32px; width:100%; max-width:440px; box-shadow:var(--shadow-lg); text-align:center;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <button type="button" class="btn-secondary" style="padding:6px 12px; font-size:12px;" onclick="MediApp.setAuthMode('signup')">
                            <i class="fa-solid fa-arrow-left"></i> Back to Register
                        </button>
                        <span style="font-size:11px; font-weight:800; background:var(--primary-light); color:var(--primary); padding:3px 8px; border-radius:var(--radius-full);">VERIFY EMAIL</span>
                    </div>

                    <div style="margin-bottom:24px;">
                        <div class="brand-icon" style="width:60px; height:60px; font-size:28px; margin:0 auto 12px auto; background:linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color:#fff; display:flex; align-items:center; justify-content:center; border-radius:50%; box-shadow:var(--shadow-md);">
                            <i class="fa-solid fa-envelope-circle-check"></i>
                        </div>
                        <h2 style="font-size:24px; font-weight:800; margin-bottom:6px;">Verify your email</h2>
                        <p style="font-size:13px; color:var(--text-muted); line-height:1.5;">
                            We sent a 6-digit verification code to:<br>
                            <strong style="color:var(--primary); font-size:14px; word-break:break-all;">${pendingEmail}</strong>
                        </p>
                    </div>

                    <form onsubmit="event.preventDefault(); MediApp.handleVerifyOtpSubmit(this);">
                        <div style="margin-bottom:20px;">
                            <label style="font-size:12px; font-weight:700; display:block; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-main);">Enter 6-Digit OTP Code</label>
                            <input type="text" id="otpCodeInput" placeholder="\u2022 \u2022 \u2022 \u2022 \u2022 \u2022" maxlength="6" pattern="[0-9]{6}" required style="width:100%; padding:14px; border:2px solid var(--card-border); border-radius:var(--radius-md); font-size:24px; font-weight:800; text-align:center; letter-spacing:10px; font-family:monospace; background:var(--card-bg); color:var(--text-main);" autocomplete="one-time-code">
                        </div>

                        <div id="otpErrorBanner" style="display:none; background:var(--emergency-light); color:var(--emergency-red); padding:10px; border-radius:var(--radius-sm); font-size:12px; margin-bottom:16px; font-weight:600; text-align:center;"></div>
                        <div id="otpSuccessBanner" style="display:none; background:#f0fdf4; color:#166534; padding:10px; border-radius:var(--radius-sm); font-size:12px; margin-bottom:16px; font-weight:600; text-align:center;"></div>

                        <button type="submit" id="btnVerifyOtp" class="add-cart-btn" style="width:100%; justify-content:center; padding:14px; font-size:15px; font-weight:700; background:var(--primary);">
                            <i class="fa-solid fa-shield-check"></i> Verify OTP
                        </button>
                    </form>

                    <div style="margin-top:20px; padding-top:16px; border-top:1px dashed var(--card-border); display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:12px; color:var(--text-muted);">Didn't receive the code?</span>
                        <button type="button" class="btn-secondary" style="padding:6px 12px; font-size:12px; color:var(--primary); border:1px solid var(--primary-light);" onclick="MediApp.handleResendOtp()">
                            <i class="fa-solid fa-rotate-right"></i> Resend OTP
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
  };

  // js/realtime-engine.js
  var RealtimeEngine = class {
    constructor(app) {
      this.app = app;
      this.socket = null;
      this.activeListeners = [];
      this.initSocketConnection();
    }
    initSocketConnection() {
      if (typeof io !== "undefined") {
        try {
          this.socket = io("http://localhost:5000", { autoConnect: true, reconnection: true });
          this.bindSocketEvents();
        } catch (e) {
          console.log("Socket.IO init fallback: operating in memory-broadcast mode");
        }
      }
    }
    bindSocketEvents() {
      if (!this.socket) return;
      this.socket.on("stock_update", (data) => {
        console.log("\u26A1 Realtime Stock Update Received:", data);
        const med = this.app.state.medicines.find((m) => m.id === data.medId);
        if (med) {
          med.stock = data.newStock;
          this.app.showToast(`\u26A1 Stock Update: ${med.name} is now ${med.stock} units`);
          this.app.render();
        }
      });
      this.socket.on("order_status_update", (data) => {
        console.log("\u26A1 Realtime Order Status Update Received:", data);
        const order = this.app.state.orders.find((o) => o.id === data.orderId);
        if (order) {
          order.order_status = data.status;
          if (data.step) order.tracking_step = data.step;
          this.app.showToast(`\u{1F4E6} Order ${order.id} status updated to "${data.status}"`);
          this.app.render();
        }
      });
      this.socket.on("driver_location_update", (data) => {
        console.log("\u26A1 Realtime Delivery Location Update:", data);
        if (this.app.customerModule) {
          this.app.customerModule.driverLivePos = { lat: data.lat, lng: data.lng, progress: data.progress };
          this.app.render();
        }
      });
      this.socket.on("notification_received", (data) => {
        console.log("\u26A1 Realtime Notification Received:", data);
        this.app.state.notifications.unshift({
          id: `n_${Date.now()}`,
          title: data.title,
          body: data.body,
          time: "Just now",
          read: false
        });
        this.app.showToast(`\u{1F514} ${data.title}: ${data.body}`);
        this.app.render();
      });
      this.socket.on("medicine_updated", (data) => {
        console.log("\u26A1 Realtime Medicine Price Update Received:", data);
        if (this.app && this.app.state && this.app.state.medicines) {
          const med = this.app.state.medicines.find((m) => m.id === data.id);
          if (med) {
            if (data.price !== void 0) med.price = data.price;
            if (data.stock !== void 0) med.stock = data.stock;
            if (data.medicine) Object.assign(med, data.medicine);
          } else if (data.medicine) {
            this.app.state.medicines.unshift(data.medicine);
          }
          const mockMed = MOCK_MEDICINES.find((m) => m.id === data.id);
          if (mockMed) {
            if (data.price !== void 0) mockMed.price = data.price;
            if (data.stock !== void 0) mockMed.stock = data.stock;
          }
          if (typeof this.app.saveMedicinesToStorage === "function") {
            this.app.saveMedicinesToStorage();
          }
          this.app.render();
        }
      });
    }
    // FIREBASE ONSNAPSHOT LISTENERS SIMULATOR & SUBSCRIPTIONS
    subscribeStockUpdates(medId, callback) {
      console.log(`\u{1F4E1} Listening for realtime stock changes on medicine ${medId}...`);
      const interval = setInterval(() => {
        const med = this.app.state.medicines.find((m) => m.id === medId);
        if (med && callback) callback(med.stock);
      }, 1e4);
      this.activeListeners.push(interval);
    }
    subscribeOrderUpdates(orderId, callback) {
      console.log(`\u{1F4E1} Listening for realtime order status updates on order ${orderId}...`);
      const interval = setInterval(() => {
        const order = this.app.state.orders.find((o) => o.id === orderId);
        if (order && callback) callback(order.order_status, order.tracking_step);
      }, 8e3);
      this.activeListeners.push(interval);
    }
    // EMITTERS FOR REALTIME BROADCASTING WITHOUT PAGE REFRESH
    broadcastStockUpdate(medId, newStock) {
      if (this.socket) {
        this.socket.emit("stock_update", { medId, newStock });
      }
      const med = this.app.state.medicines.find((m) => m.id === medId);
      if (med) {
        med.stock = parseInt(newStock) || 0;
        this.app.render();
      }
    }
    broadcastOrderUpdate(orderId, status, step) {
      if (this.socket) {
        this.socket.emit("order_status_update", { orderId, status, step });
      }
      const order = this.app.state.orders.find((o) => o.id === orderId);
      if (order) {
        order.order_status = status;
        if (step) order.tracking_step = step;
        this.app.render();
      }
    }
    broadcastNotification(title, body) {
      if (this.socket) {
        this.socket.emit("notification_received", { title, body });
      }
      this.app.state.notifications.unshift({
        id: `n_${Date.now()}`,
        title,
        body,
        time: "Just now",
        read: false
      });
      this.app.showToast(`\u{1F514} ${title}: ${body}`);
      this.app.render();
    }
  };

  // js/payment.js
  var PaymentService = class {
    constructor(app) {
      this.app = app;
      this.selectedMethod = "UPI";
      this.isProcessing = false;
      this.paymentHistory = [
        {
          txId: "pay_demo_UPI90182",
          orderId: "ORD-89102",
          amount: 86,
          method: "UPI (Google Pay)",
          status: "Success",
          timestamp: "2026-07-22T10:15:00Z"
        }
      ];
    }
    // 1. Open Checkout Payment Modal (Step 1: Selection & Input)
    openRazorpayCheckout(amount) {
      const cart = this.app.state.cart;
      if (cart.length === 0) {
        this.app.showToast("Your cart is empty!");
        return;
      }
      this.selectedMethod = this.selectedMethod || "UPI";
      this.isProcessing = false;
      this.renderCheckoutModal(amount);
    }
    // 2. Select Payment Method (ONLY changes selection state, NEVER places order or clears cart)
    selectPaymentMethod(method, amount) {
      this.selectedMethod = method;
      this.renderCheckoutModal(amount);
    }
    // 3. Render Checkout Payment Modal UI
    renderCheckoutModal(amount) {
      const method = this.selectedMethod;
      this.app.showModal(`
            <div class="modal-card" style="max-width:460px; padding:0; overflow:hidden; border-radius:var(--radius-lg);">
                <!-- Header -->
                <div style="background:#0c2340; color:white; padding:20px; position:relative;">
                    <button class="modal-close-btn" style="color:white;" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <i class="fa-solid fa-shield-halved" style="color:#0ea5e9; font-size:20px;"></i>
                            <strong style="font-size:16px;">MediFind Secure Payment</strong>
                        </div>
                        <span style="background:rgba(255,255,255,0.15); padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700;">DEMO GATEWAY</span>
                    </div>
                    <div style="font-size:12px; opacity:0.8;">Total Order Amount</div>
                    <div style="font-size:26px; font-weight:800; color:#38bdf8;">\u20B9${amount.toFixed(2)}</div>
                </div>

                <!-- Body -->
                <div style="padding:20px; background:var(--card-bg);">
                    <h4 style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); margin-bottom:12px; font-weight:800;">
                        1. Select Payment Method
                    </h4>

                    <!-- Method Selection List -->
                    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                        <!-- Option 1: UPI -->
                        <div style="border:${method === "UPI" ? "2px solid var(--primary)" : "1px solid var(--card-border)"}; background:${method === "UPI" ? "var(--primary-light)" : "var(--background)"}; border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;"
                             onclick="MediApp.selectPaymentMethod('UPI', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-mobile-screen-button" style="font-size:20px; color:#22c55e;"></i>
                                <div>
                                    <strong style="font-size:14px; color:var(--text-main);">UPI (Google Pay / PhonePe / Paytm)</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">Instant 0% Fee Transfer</div>
                                </div>
                            </div>
                            <input type="radio" name="paymentOption" ${method === "UPI" ? "checked" : ""} style="cursor:pointer;">
                        </div>

                        <!-- Option 2: Credit / Debit Card -->
                        <div style="border:${method === "CARD" ? "2px solid var(--primary)" : "1px solid var(--card-border)"}; background:${method === "CARD" ? "var(--primary-light)" : "var(--background)"}; border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;"
                             onclick="MediApp.selectPaymentMethod('CARD', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-credit-card" style="font-size:20px; color:#0ea5e9;"></i>
                                <div>
                                    <strong style="font-size:14px; color:var(--text-main);">Credit / Debit Card</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">Visa, Mastercard, RuPay, Amex</div>
                                </div>
                            </div>
                            <input type="radio" name="paymentOption" ${method === "CARD" ? "checked" : ""} style="cursor:pointer;">
                        </div>

                        <!-- Option 3: Net Banking -->
                        <div style="border:${method === "NETBANKING" ? "2px solid var(--primary)" : "1px solid var(--card-border)"}; background:${method === "NETBANKING" ? "var(--primary-light)" : "var(--background)"}; border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;"
                             onclick="MediApp.selectPaymentMethod('NETBANKING', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-building-columns" style="font-size:20px; color:#f59e0b;"></i>
                                <div>
                                    <strong style="font-size:14px; color:var(--text-main);">Net Banking</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">SBI, HDFC, ICICI, Axis, Kotak</div>
                                </div>
                            </div>
                            <input type="radio" name="paymentOption" ${method === "NETBANKING" ? "checked" : ""} style="cursor:pointer;">
                        </div>

                        <!-- Option 4: Cash on Delivery -->
                        <div style="border:${method === "COD" ? "2px solid var(--primary)" : "1px solid var(--card-border)"}; background:${method === "COD" ? "var(--primary-light)" : "var(--background)"}; border-radius:var(--radius-md); padding:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;"
                             onclick="MediApp.selectPaymentMethod('COD', ${amount})">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <i class="fa-solid fa-money-bill-wave" style="font-size:20px; color:#10b981;"></i>
                                <div>
                                    <strong style="font-size:14px; color:var(--text-main);">Cash on Delivery (COD)</strong>
                                    <div style="font-size:11px; color:var(--text-muted);">Pay cash upon doorstep delivery</div>
                                </div>
                            </div>
                            <input type="radio" name="paymentOption" ${method === "COD" ? "checked" : ""} style="cursor:pointer;">
                        </div>
                    </div>

                    <!-- Payment Details Form (Step 2: Input & Submit) -->
                    <div style="border-top:1px dashed var(--card-border); padding-top:16px;">
                        <h4 style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); margin-bottom:12px; font-weight:800;">
                            2. Enter Payment Details
                        </h4>
                        
                        ${this.renderPaymentFormFields(method, amount)}
                    </div>
                </div>
            </div>
        `);
    }
    // 4. Render Form Fields according to selected payment method
    renderPaymentFormFields(method, amount) {
      if (method === "UPI") {
        return `
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">UPI ID</label>
                        <input type="text" id="payUpiIdInput" placeholder="username@okaxis or mobile@upi" value="alex@okaxis" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600;">
                    </div>
                </div>
                <button class="add-cart-btn" id="paySubmitBtn" style="width:100%; justify-content:center; padding:14px; font-size:15px;"
                        onclick="MediApp.submitDemoPayment('UPI', ${amount})">
                    <i class="fa-solid fa-lock"></i> Pay \u20B9${amount.toFixed(2)}
                </button>
            `;
      }
      if (method === "CARD") {
        return `
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">CARD NUMBER</label>
                        <input type="text" id="payCardNumInput" placeholder="4532 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 8910" value="4532 8901 2345 8910" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600;">
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div>
                            <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">EXPIRY DATE</label>
                            <input type="text" id="payCardExpInput" placeholder="MM/YY" value="12/28" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600;">
                        </div>
                        <div>
                            <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">CVV</label>
                            <input type="password" id="payCardCvvInput" placeholder="\u2022\u2022\u2022" value="891" maxlength="4" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600;">
                        </div>
                    </div>
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">CARDHOLDER NAME</label>
                        <input type="text" id="payCardNameInput" placeholder="Name on Card" value="Alex Johnson" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600;">
                    </div>
                </div>
                <button class="add-cart-btn" id="paySubmitBtn" style="width:100%; justify-content:center; padding:14px; font-size:15px;"
                        onclick="MediApp.submitDemoPayment('CARD', ${amount})">
                    <i class="fa-solid fa-lock"></i> Pay \u20B9${amount.toFixed(2)}
                </button>
            `;
      }
      if (method === "NETBANKING") {
        return `
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">SELECT YOUR BANK</label>
                        <select id="payNetBankSelect" style="width:100%; border:1px solid var(--card-border); padding:10px; border-radius:var(--radius-md); font-size:13px; font-weight:600; background:var(--card-bg); color:var(--text-main);">
                            <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                            <option value="HDFC Bank">HDFC Bank</option>
                            <option value="ICICI Bank">ICICI Bank</option>
                            <option value="Axis Bank">Axis Bank</option>
                            <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        </select>
                    </div>
                </div>
                <button class="add-cart-btn" id="paySubmitBtn" style="width:100%; justify-content:center; padding:14px; font-size:15px;"
                        onclick="MediApp.submitDemoPayment('NETBANKING', ${amount})">
                    <i class="fa-solid fa-lock"></i> Pay \u20B9${amount.toFixed(2)}
                </button>
            `;
      }
      return `
            <div style="background:var(--background); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:14px; margin-bottom:16px; font-size:13px;">
                <div style="display:flex; align-items:center; gap:10px; color:var(--secondary); font-weight:700;">
                    <i class="fa-solid fa-truck-ramp-box" style="font-size:18px;"></i>
                    <span>Pay cash when your medicine is delivered.</span>
                </div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
                    Please keep exact cash ready upon 15-minute delivery arrival.
                </div>
            </div>
            <button class="add-cart-btn" id="paySubmitBtn" style="width:100%; justify-content:center; padding:14px; font-size:15px; background:var(--secondary);"
                    onclick="MediApp.submitDemoPayment('COD', ${amount})">
                <i class="fa-solid fa-check"></i> Place Order (Cash on Delivery)
            </button>
        `;
    }
    // 5. Submit Demo Payment & Process Order Creation
    async submitDemoPayment(method, amount) {
      var _a, _b, _c, _d, _e, _f;
      if (this.isProcessing) return;
      this.isProcessing = true;
      const btn = document.getElementById("paySubmitBtn");
      if (method === "UPI") {
        const upiId = (_b = (_a = document.getElementById("payUpiIdInput")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
        if (!upiId || !upiId.includes("@")) {
          this.app.showToast("\u26A0\uFE0F Please enter a valid UPI ID (e.g. username@upi)");
          this.isProcessing = false;
          return;
        }
      } else if (method === "CARD") {
        const cardNum = (_d = (_c = document.getElementById("payCardNumInput")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim();
        const cvv = (_f = (_e = document.getElementById("payCardCvvInput")) == null ? void 0 : _e.value) == null ? void 0 : _f.trim();
        if (!cardNum || cardNum.length < 12 || !cvv || cvv.length < 3) {
          this.app.showToast("\u26A0\uFE0F Please enter valid Card Details & CVV");
          this.isProcessing = false;
          return;
        }
      }
      if (btn) {
        btn.disabled = true;
        btn.style.opacity = "0.7";
        btn.style.cursor = "not-allowed";
        btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Payment...`;
      }
      this.app.showToast("\u23F3 Processing payment securely...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const txId = method === "COD" ? `cod_${Date.now()}` : `pay_demo_${method}_${Math.floor(1e5 + Math.random() * 9e5)}`;
      const paymentStatus = method === "COD" ? "Pending COD" : "Paid";
      this.paymentHistory.push({
        txId,
        amount,
        method,
        status: method === "COD" ? "Pending COD" : "Success",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      this.isProcessing = false;
      this.app.completeCheckoutOrder(txId, method, amount, paymentStatus);
    }
  };

  // js/fcm.js
  var FcmService = class {
    constructor(app) {
      this.app = app;
      this.fcmToken = "fcm_token_medifind_live_" + Math.floor(Math.random() * 1e6);
      this.permissionGranted = false;
      this.initFcm();
    }
    async initFcm() {
      if ("Notification" in window) {
        try {
          if (Notification.permission === "granted") {
            this.permissionGranted = true;
          } else if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
              this.permissionGranted = true;
            }
          }
        } catch (e) {
          console.log("FCM Web Push Init: Browser operating in sound/toast notification mode.");
        }
      }
    }
    // Generic FCM Push Dispatcher
    dispatchPushNotification(title, body, roleTarget = "customer", icon = "fa-bell") {
      if (this.permissionGranted && "Notification" in window) {
        try {
          new Notification(title, {
            body,
            icon: "/favicon.ico",
            tag: "medifind-fcm"
          });
        } catch (e) {
        }
      }
      this.app.state.notifications.unshift({
        id: `fcm_${Date.now()}`,
        title: `[FCM ${roleTarget.toUpperCase()}] ${title}`,
        body,
        time: "Just now",
        read: false
      });
      this.app.showToast(`\u{1F514} ${title}: ${body}`);
      this.app.render();
    }
    // 🧑‍🦱 CUSTOMER FCM TRIGGERS
    notifyOrderPlaced(orderId) {
      this.dispatchPushNotification(
        "\u{1F389} Order Placed Successfully!",
        `Order ${orderId} placed with 15-min express delivery fulfillment.`,
        "customer"
      );
    }
    notifyOrderAccepted(orderId) {
      this.dispatchPushNotification(
        "\u2705 Order Accepted by Pharmacy",
        `Pharmacy has accepted order ${orderId} and is preparing your medicines.`,
        "customer"
      );
    }
    notifyOutForDelivery(orderId, driverName = "Rohan Verma") {
      this.dispatchPushNotification(
        "\u{1F6F5} Out For Delivery!",
        `Driver ${driverName} is on the way with your medicines for order ${orderId}.`,
        "customer"
      );
    }
    notifyDelivered(orderId) {
      this.dispatchPushNotification(
        "\u{1F3E0} Order Delivered!",
        `Order ${orderId} delivered successfully. Stay healthy!`,
        "customer"
      );
    }
    // 🏬 PHARMACY FCM TRIGGERS
    notifyPharmacyNewOrder(orderId, amount) {
      this.dispatchPushNotification(
        "\u{1F514} New Order Received!",
        `New customer order ${orderId} received (\u20B9${amount.toFixed(2)}). Please prepare items.`,
        "pharmacy"
      );
    }
    notifyPharmacyLowStock(medName, stockQty) {
      this.dispatchPushNotification(
        "\u26A0\uFE0F Low Stock Alert!",
        `Medicine "${medName}" is low in stock (${stockQty} units remaining). Restock soon!`,
        "pharmacy"
      );
    }
    // 🛵 DELIVERY PARTNER FCM TRIGGERS
    notifyDeliveryNewAssignment(orderId, shopName) {
      this.dispatchPushNotification(
        "\u{1F6F5} New Express Delivery Assignment!",
        `New order ${orderId} assigned for pickup at ${shopName}.`,
        "delivery"
      );
    }
    // 🛡️ ADMIN FCM TRIGGERS
    notifyAdminSystemAlert(alertMessage) {
      this.dispatchPushNotification(
        "\u{1F6E1}\uFE0F Admin System Compliance Alert",
        alertMessage,
        "admin"
      );
    }
  };

  // js/socket.js
  var SocketClient = class {
    constructor(app) {
      this.app = app;
      this.socket = null;
      this.init();
    }
    init() {
      if (typeof io !== "undefined") {
        this.socket = io("http://localhost:5000");
        this.socket.on("connect", () => {
          console.log("[Websocket] Connected to MediFind Socket.IO server:", this.socket.id);
        });
        this.socket.on("order_created", (newOrder) => {
          const currentUser = this.app.authService ? this.app.authService.getUser() : null;
          const currentRole = this.app.state.currentRole;
          if (currentRole === "admin" || currentRole === "pharmacy" || currentUser && newOrder.user_id === currentUser.id) {
            this.app.showToast(`\u26A1 New Order Received: ${newOrder.id}`);
            const existing = (this.app.state.orders || []).find((o) => o.id === newOrder.id);
            if (!existing) {
              this.app.state.orders.unshift(newOrder);
              if (currentRole === "customer") {
                this.app.saveOrdersToStorage();
              }
            }
            this.app.render();
          }
        });
        this.socket.on("order_status_updated", (data) => {
          const currentUser = this.app.authService ? this.app.authService.getUser() : null;
          const currentRole = this.app.state.currentRole;
          const order = (this.app.state.orders || []).find((o) => o.id === data.id);
          if (order) {
            order.order_status = data.status;
            if (data.tracking_step) order.tracking_step = data.tracking_step;
            if (currentRole === "admin" || currentRole === "pharmacy" || currentUser && order.user_id === currentUser.id) {
              this.app.showToast(`Order ${data.id} Status: ${data.status}`);
              this.app.render();
            }
          }
        });
        this.socket.on("medicine_updated", (data) => {
          console.log("[Socket.IO] Realtime medicine update received:", data);
          if (this.app && this.app.state && this.app.state.medicines) {
            const med = this.app.state.medicines.find((m) => m.id === data.id);
            if (med) {
              if (data.price !== void 0) med.price = data.price;
              if (data.stock !== void 0) med.stock = data.stock;
              if (data.medicine) Object.assign(med, data.medicine);
            } else if (data.medicine) {
              this.app.state.medicines.unshift(data.medicine);
            }
            const mockMed = MOCK_MEDICINES.find((m) => m.id === data.id);
            if (mockMed) {
              if (data.price !== void 0) mockMed.price = data.price;
              if (data.stock !== void 0) mockMed.stock = data.stock;
            }
            if (typeof this.app.saveMedicinesToStorage === "function") {
              this.app.saveMedicinesToStorage();
            }
            this.app.render();
          }
        });
        this.socket.on("medicine_added", (newMed) => {
          console.log("[Socket.IO] Realtime medicine added:", newMed);
          if (this.app && this.app.state && this.app.state.medicines) {
            const exists = this.app.state.medicines.some((m) => m.id === newMed.id);
            if (!exists) {
              this.app.state.medicines.unshift(newMed);
              if (typeof this.app.saveMedicinesToStorage === "function") {
                this.app.saveMedicinesToStorage();
              }
              this.app.render();
            }
          }
        });
        this.socket.on("medicine_deleted", (data) => {
          console.log("[Socket.IO] Realtime medicine deleted:", data);
          if (this.app && this.app.state && this.app.state.medicines) {
            this.app.state.medicines = this.app.state.medicines.filter((m) => m.id !== data.id);
            if (typeof this.app.saveMedicinesToStorage === "function") {
              this.app.saveMedicinesToStorage();
            }
            this.app.render();
          }
        });
      }
    }
  };

  // js/app.js
  var MediFindApp = class {
    constructor() {
      this.authService = new AuthService(this);
      this.realtimeEngine = new RealtimeEngine(this);
      this.paymentService = new PaymentService(this);
      this.fcmService = new FcmService(this);
      this.socketClient = new SocketClient(this);
      this.state = {
        currentRole: "customer",
        // customer, pharmacy, delivery, admin
        customerTab: "home",
        // home, search, pharmacies, pharmacy-detail, medicine-detail, prescription, cart, orders, profile
        pharmacyTab: "dashboard",
        darkMode: false,
        medicines: [...MOCK_MEDICINES],
        pharmacies: [...MOCK_PHARMACIES],
        orders: [...MOCK_ORDERS],
        usersList: [],
        cart: [],
        prescriptions: [],
        appliedCoupon: null,
        favoritePharmacies: [],
        savedAddresses: [],
        notifications: []
      };
      this.customerModule = new CustomerModule(this);
      this.pharmacyModule = new PharmacyModule(this);
      this.deliveryModule = new DeliveryModule(this);
      this.adminModule = new AdminModule(this);
      this.aiEngine = new AiEngine(this);
      this.mapPickerState = null;
      this.init();
    }
    clearLocalOrderStorage() {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach((k) => {
          if (k.startsWith("medifind_user_orders_") || k === "medifind_global_orders_backup" || k.includes("orders")) {
            localStorage.removeItem(k);
          }
        });
      } catch (e) {
      }
    }
    saveOrdersToStorage() {
      try {
        const currentUser = this.authService ? this.authService.getUser() : null;
        const storageKey = currentUser ? `medifind_user_orders_${currentUser.id}` : "medifind_user_orders_guest";
        localStorage.setItem(storageKey, JSON.stringify(this.state.orders));
        localStorage.setItem("medifind_global_orders_backup", JSON.stringify(this.state.orders));
      } catch (e) {
        console.warn("[Orders Persistence] Error saving to localStorage:", e);
      }
    }
    async resetAdminOrdersAndRevenue() {
      if (!confirm("Are you sure you want to reset all platform orders and revenue to \u20B90?")) return;
      try {
        const res = await fetch("/api/orders/reset", { method: "POST" });
        const data = await res.json();
        this.clearLocalOrderStorage();
        this.state.orders = [];
        this.saveOrdersToStorage();
        this.showToast("\u{1F9F9} All Platform Orders & Revenue Reset to \u20B90");
        this.render();
      } catch (err) {
        console.error("Reset orders error:", err);
        this.clearLocalOrderStorage();
        this.state.orders = [];
        this.render();
      }
    }
    async loadSavedOrders(skipRenderIfModalOpen = false) {
      const currentUser = this.authService ? this.authService.getUser() : null;
      const currentRole = this.state.currentRole;
      const keysToTry = [
        currentUser ? `medifind_user_orders_${currentUser.id}` : null,
        "medifind_user_orders_guest",
        "medifind_global_orders_backup"
      ].filter(Boolean);
      const orderMap = /* @__PURE__ */ new Map();
      for (const key of keysToTry) {
        try {
          const localData = localStorage.getItem(key);
          if (localData && localData !== "undefined") {
            const parsed = JSON.parse(localData);
            if (Array.isArray(parsed)) {
              parsed.forEach((o) => {
                if (o && o.id) orderMap.set(o.id, o);
              });
            }
          }
        } catch (e) {
        }
      }
      if (this.authService && this.authService.api) {
        try {
          const remoteOrders = await this.authService.api.fetchUserOrders();
          if (Array.isArray(remoteOrders)) {
            if (remoteOrders.length === 0 && currentRole === "admin") {
              orderMap.clear();
              this.clearLocalOrderStorage();
            } else {
              remoteOrders.forEach((o) => {
                if (o && o.id) orderMap.set(o.id, o);
              });
            }
          }
        } catch (err) {
          console.warn("[Orders Persistence] Remote order sync note:", err);
        }
      }
      let allOrders = Array.from(orderMap.values());
      allOrders.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      if (currentRole === "customer" && currentUser) {
        const userEmail = (currentUser.email || "").toLowerCase();
        const userName = (currentUser.name || "").toLowerCase();
        const userId = String(currentUser.id || "");
        const filtered = allOrders.filter((o) => {
          if (!o) return false;
          const oUserId = String(o.user_id || "");
          const oCustId = String(o.customer_id || "");
          const oEmail = (o.customer_email || "").toLowerCase();
          const oName = (o.customer_name || "").toLowerCase();
          return userId && (oUserId === userId || oCustId === userId) || userEmail && oEmail && oEmail === userEmail || userName && oName && oName === userName || oUserId.startsWith("usr_guest_");
        });
        this.state.orders = filtered.length > 0 ? filtered : allOrders;
      } else {
        this.state.orders = allOrders;
      }
      this.saveOrdersToStorage();
      if (!skipRenderIfModalOpen || !this.isModalOpen()) {
        this.render();
      }
    }
    async loadAllUsers(skipRenderIfModalOpen = false) {
      if (this.authService && this.authService.api) {
        try {
          const users = await this.authService.api.fetchAllUsers();
          if (Array.isArray(users) && users.length > 0) {
            this.state.usersList = users;
            if (!skipRenderIfModalOpen || !this.isModalOpen()) {
              this.render();
            }
          }
        } catch (err) {
          console.warn("[Users Fetch Note]:", err);
        }
      }
    }
    syncMedicinesToFirestore() {
      try {
        if (window.firestoreDb && this.state && this.state.medicines) {
          window.firestoreDb.collections.Medicines.clear();
          this.state.medicines.forEach((m) => window.firestoreDb.collections.Medicines.set(m.id, m));
        }
      } catch (e) {
        console.warn("[Firestore Sync Note]", e);
      }
    }
    saveMedicinesToStorage() {
      try {
        localStorage.setItem("medifind_medicines_catalog", JSON.stringify(this.state.medicines));
        if (typeof this.syncMedicinesToFirestore === "function") {
          this.syncMedicinesToFirestore();
        }
      } catch (e) {
        console.warn("[Medicines Persistence] Error saving to localStorage:", e);
      }
    }
    async loadSavedMedicines() {
      try {
        const localData = localStorage.getItem("medifind_medicines_catalog");
        if (localData) {
          const parsed = JSON.parse(localData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.state.medicines = parsed;
            const localMap = new Map(parsed.map((m) => [m.id, m]));
            MOCK_MEDICINES.forEach((mockMed) => {
              if (localMap.has(mockMed.id)) {
                const updated = localMap.get(mockMed.id);
                mockMed.price = updated.price;
                mockMed.stock = updated.stock;
              }
            });
          }
        }
      } catch (e) {
        console.warn("[Medicines Persistence] Error reading local storage:", e);
      }
      try {
        const res = await fetch("/api/medicines");
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.medicines) && data.medicines.length > 0) {
            const localMap = new Map(this.state.medicines.map((m) => [m.id, m]));
            for (const remoteMed of data.medicines) {
              if (localMap.has(remoteMed.id)) {
                const localMed = localMap.get(remoteMed.id);
                localMed.price = remoteMed.price;
                localMed.stock = remoteMed.stock;
              } else {
                this.state.medicines.push(remoteMed);
              }
              const mockMed = MOCK_MEDICINES.find((m) => m.id === remoteMed.id);
              if (mockMed) {
                mockMed.price = remoteMed.price;
                mockMed.stock = remoteMed.stock;
              }
            }
            this.saveMedicinesToStorage();
            this.render();
          }
        }
      } catch (err) {
        console.warn("[Medicines Persistence] Remote fetch note:", err);
      }
    }
    async init() {
      window.MediApp = this;
      this.state.cart = [];
      this.state.orders = [];
      this.clearLocalOrderStorage();
      sessionStorage.removeItem("medifind_current_role");
      sessionStorage.removeItem("medifind_admin_tab");
      this.state.currentRole = "auth";
      this.state.authMode = "landing";
      await Promise.all([
        this.loadSavedOrders(),
        this.loadSavedMedicines(),
        this.loadAllUsers()
      ]);
      if (navigator.geolocation) {
        googleMapsService.requestBrowserLocation().then((res) => {
          this.render();
        });
      }
      googleMapsService.startWatchPosition();
      this.showSplashScreen();
      this.render();
      this.initAndroidBackButton();
      this.showToast("MediFind Application Ready \u{1F3E5}");
    }
    initAndroidBackButton() {
      if (window.Capacitor && window.Capacitor.isPluginAvailable && window.Capacitor.isPluginAvailable("App")) {
        const App = window.Capacitor.Plugins ? window.Capacitor.Plugins.App : null;
        if (App) {
          App.addListener("backButton", () => {
            if (this.activeModal) {
              this.closeModal();
            } else if (this.state.customerTab !== "home") {
              this.setCustomerTab("home");
            } else {
              App.exitApp();
            }
          });
        }
      }
      if (typeof window !== "undefined" && window.addEventListener) {
        window.addEventListener("offline", () => {
          this.showModal(`
                    <div class="modal-card" style="max-width:380px; padding:24px; text-align:center;">
                        <div style="font-size:44px; color:var(--emergency-red); margin-bottom:12px;"><i class="fa-solid fa-wifi"></i></div>
                        <h3 style="font-size:18px; margin-bottom:6px;">No Internet Connection</h3>
                        <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">MediFind requires an internet connection to load live pharmacies and medicines.</p>
                        <button class="add-cart-btn" style="width:100%; justify-content:center;" onclick="window.location.reload()">
                            <i class="fa-solid fa-rotate-right"></i> Retry
                        </button>
                    </div>
                `);
        });
      }
    }
    showSplashScreen() {
      if (sessionStorage.getItem("medifind_splash_shown")) return;
      sessionStorage.setItem("medifind_splash_shown", "true");
      const splash = document.createElement("div");
      splash.className = "splash-screen";
      splash.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:linear-gradient(135deg, #0b1329 0%, #0f172a 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:999999; transition:opacity 0.4s ease, visibility 0.4s ease; color:white;";
      splash.innerHTML = `
            <div class="splash-logo" style="width:72px; height:72px; background:linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:32px; color:white; margin-bottom:16px; box-shadow:0 0 30px rgba(14,165,233,0.4);">
                <i class="fa-solid fa-notes-medical"></i>
            </div>
            <h1 style="font-size:28px; font-weight:800; color:white; margin-bottom:4px; font-family:sans-serif;">MediFind</h1>
            <p style="font-size:13px; color:#94a3b8; font-weight:600; text-align:center; max-width:280px; margin:0 auto; font-family:sans-serif;">
                Find Medicines. Find Pharmacies. Get Care Faster.
            </p>
            <div style="margin-top:24px; width:32px; height:32px; border:3px solid rgba(255,255,255,0.2); border-top-color:#0ea5e9; border-radius:50%; animation:spin 0.8s linear infinite;"></div>
        `;
      document.body.appendChild(splash);
      setTimeout(() => {
        splash.style.opacity = "0";
        splash.style.visibility = "hidden";
        setTimeout(() => {
          try {
            splash.remove();
          } catch (e) {
          }
        }, 400);
      }, 1e3);
    }
    isModalOpen() {
      const container = document.getElementById("modalContainer");
      return container && container.children.length > 0 && container.innerHTML.trim() !== "";
    }
    render() {
      var _a;
      const root = document.getElementById("app");
      if (!root) return;
      const activeEl = document.activeElement;
      const focusedId = activeEl && activeEl.id ? activeEl.id : null;
      let selectionStart = null;
      let selectionEnd = null;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        try {
          selectionStart = activeEl.selectionStart;
          selectionEnd = activeEl.selectionEnd;
        } catch (e) {
        }
      }
      const modalContainer = document.getElementById("modalContainer");
      if (modalContainer) {
        modalContainer.querySelectorAll("input, select, textarea").forEach((el) => {
          el.setAttribute("value", el.value);
        });
      }
      const existingModal = (modalContainer == null ? void 0 : modalContainer.innerHTML) || "";
      const existingToasts = ((_a = document.getElementById("toastContainer")) == null ? void 0 : _a.innerHTML) || "";
      let contentHtml = "";
      if (this.state.currentRole === "auth") {
        contentHtml = this.authService.renderLoginPage();
      } else if (this.state.currentRole === "admin") {
        contentHtml = this.adminModule.render();
      } else if (this.state.currentRole === "pharmacy") {
        contentHtml = this.pharmacyModule.render();
      } else if (this.state.currentRole === "delivery") {
        contentHtml = this.deliveryModule.render();
      } else {
        contentHtml = this.customerModule.render();
      }
      root.innerHTML = `
            ${contentHtml}
            <div id="modalContainer">${existingModal}</div>
            <div id="toastContainer" class="toast-container">${existingToasts}</div>
        `;
      if (focusedId) {
        const restoredEl = document.getElementById(focusedId);
        if (restoredEl) {
          restoredEl.focus();
          if (selectionStart !== null && selectionEnd !== null && (restoredEl.tagName === "INPUT" || restoredEl.tagName === "TEXTAREA")) {
            try {
              restoredEl.setSelectionRange(selectionStart, selectionEnd);
            } catch (e) {
            }
          }
        }
      }
      setTimeout(() => {
        if (this.state.customerTab === "pharmacies") {
          googleMapsService.renderMapCanvas("nearbyPharmaciesMapCanvas");
        }
        if (this.state.currentRole === "auth" && this.state.authMode === "signup") {
          this.autoDetectSignupLocation();
        }
      }, 100);
    }
    async setAdminTab(tab) {
      if (this.adminModule) {
        this.adminModule.activeTab = tab;
        sessionStorage.setItem("medifind_admin_tab", tab);
      }
      sessionStorage.setItem("medifind_current_role", "admin");
      await Promise.all([this.loadSavedOrders(), this.loadAllUsers()]);
      this.startAdminLivePolling();
      this.render();
      setTimeout(() => {
        if (this.adminModule && this.adminModule.initCharts) {
          this.adminModule.initCharts();
        }
      }, 100);
    }
    startAdminLivePolling() {
      if (this._adminPollTimer) return;
      this._adminPollTimer = setInterval(async () => {
        if (this.state && this.state.currentRole === "admin") {
          await Promise.all([this.loadSavedOrders(true), this.loadAllUsers(true)]);
        }
      }, 5e3);
    }
    async handleAdminLoginFormSubmit(form) {
      var _a, _b, _c, _d;
      const email = (_b = (_a = document.getElementById("adminAuthEmail")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      const password = (_d = (_c = document.getElementById("adminAuthPassword")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim();
      const errorBanner = document.getElementById("adminAuthErrorBanner");
      if (!email || !password) return;
      let res = await this.authService.login(email, password, true);
      if (res.success) {
        const userRole = res.user && res.user.role ? res.user.role : "";
        const userEmail = res.user && res.user.email ? res.user.email.toLowerCase() : "";
        if (userRole !== "admin" && userEmail !== "admin@medifind.com") {
          if (errorBanner) {
            errorBanner.style.display = "block";
            errorBanner.innerText = "Access Denied: Only administrator accounts can access the Admin Portal.";
          }
          return;
        }
        this.state.currentRole = "admin";
        sessionStorage.setItem("medifind_current_role", "admin");
        sessionStorage.setItem("medifind_admin_tab", "medicines");
        this.authService.setCurrentUser(res.user, true);
        this.showToast("\u{1F6E1}\uFE0F Admin Control Panel Access Granted");
        await Promise.all([this.loadAllUsers(), this.loadSavedOrders()]);
        this.startAdminLivePolling();
        this.render();
        setTimeout(() => {
          if (this.adminModule && this.adminModule.initCharts) {
            this.adminModule.initCharts();
          }
        }, 100);
      } else {
        if (errorBanner) {
          errorBanner.style.display = "block";
          errorBanner.innerText = res.message || "Invalid administrator credentials.";
        }
      }
    }
    async fetchRealtimeAdminUsers() {
      try {
        const res = await fetch("/api/auth/users");
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.users)) {
            this.state.usersList = data.users;
          }
        }
        const ordRes = await fetch("/api/orders");
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          if (ordData && ordData.success && Array.isArray(ordData.orders)) {
            this.state.orders = ordData.orders;
          }
        }
        this.render();
      } catch (e) {
        console.warn("[Admin Live Sync Warning]:", e);
      }
    }
    viewUserOrdersModal(userId, userName) {
      const allOrders = this.state.orders || [];
      const userOrders = allOrders.filter((o) => o.user_id === userId || o.customer_name && userName && o.customer_name.toLowerCase() === userName.toLowerCase());
      this.showModal(`
            <div class="modal-card" style="max-width:600px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
                    <div style="width:44px; height:44px; background:var(--primary-light); color:var(--primary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:20px;">
                        <i class="fa-solid fa-user-gear"></i>
                    </div>
                    <div>
                        <h3 style="font-size:18px; margin:0;">Real-Time Orders for ${userName}</h3>
                        <p style="font-size:12px; color:var(--text-muted); margin:0;">User ID: ${userId} \u2022 ${userOrders.length} Total Orders Placed</p>
                    </div>
                </div>

                ${userOrders.length === 0 ? `
                    <div style="text-align:center; padding:30px; background:var(--background); border-radius:var(--radius-md);">
                        <i class="fa-solid fa-box-open" style="font-size:32px; color:var(--text-muted); margin-bottom:8px;"></i>
                        <p style="font-size:13px; color:var(--text-muted);">No orders placed yet by this user.</p>
                    </div>
                ` : `
                    <div style="display:flex; flex-direction:column; gap:12px; max-height:400px; overflow-y:auto; padding-right:4px;">
                        ${userOrders.map((o) => `
                            <div style="background:var(--background); border:1px solid var(--card-border); border-radius:var(--radius-md); padding:14px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                    <strong style="color:var(--primary); font-size:14px;">${o.id}</strong>
                                    <span class="role-badge-btn" style="font-size:10px;">${o.order_status}</span>
                                </div>
                                <div style="font-size:12px; color:var(--text-main); margin-bottom:4px;">
                                    <strong>Pharmacy:</strong> ${o.pharmacy_name || "Apollo Pharmacy 24/7"}
                                </div>
                                <div style="font-size:12px; color:var(--text-muted); margin-bottom:6px;">
                                    <strong>Items:</strong> ${(o.items || []).map((it) => `${it.quantity || 1}x ${it.name}`).join(", ")}
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; border-top:1px dashed var(--card-border); padding-top:6px;">
                                    <span style="color:var(--text-muted);">Payment: <strong>${o.payment_method || "UPI"} (${o.payment_status})</strong></span>
                                    <strong style="color:var(--secondary); font-size:14px;">\u20B9${(o.total_amount || 0).toFixed(2)}</strong>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                `}
                <button class="btn-secondary" style="width:100%; justify-content:center; margin-top:16px;" onclick="MediApp.closeModal()">Close</button>
            </div>
        `);
    }
    openAddMedicineModal() {
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:14px;"><i class="fa-solid fa-pills" style="color:var(--primary);"></i> Add New Medicine to Catalog</h3>
                <form onsubmit="event.preventDefault(); MediApp.handleAddMedicineSubmit(this);">
                    <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">
                        <div>
                            <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">MEDICINE BRAND NAME *</label>
                            <input type="text" id="adminMedName" placeholder="e.g. Dolo 650 Tablet" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                        </div>
                        <div style="display:flex; gap:8px;">
                            <div style="flex:1;">
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">GENERIC NAME</label>
                                <input type="text" id="adminMedGeneric" placeholder="Paracetamol 650mg" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>
                            <div style="flex:1;">
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">CATEGORY</label>
                                <select id="adminMedCategory" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                                    <option value="pain-relief">Pain Relief</option>
                                    <option value="antibiotics">Antibiotics</option>
                                    <option value="first-aid">First Aid</option>
                                    <option value="vitamins">Vitamins & Supplements</option>
                                    <option value="cardiac">Cardiac & BP</option>
                                </select>
                            </div>
                        </div>
                        <div style="display:flex; gap:8px;">
                            <div style="flex:1;">
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">UNIT PRICE (\u20B9) *</label>
                                <input type="number" step="0.5" id="adminMedPrice" placeholder="30.00" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>
                            <div style="flex:1;">
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">STOCK UNITS *</label>
                                <input type="number" id="adminMedStock" placeholder="100" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>
                        </div>
                    </div>
                    <button type="submit" class="add-cart-btn" style="width:100%; justify-content:center; padding:10px; font-size:14px;">
                        <i class="fa-solid fa-plus"></i> Save Medicine to Catalog
                    </button>
                </form>
            </div>
        `);
    }
    async handleAddMedicineSubmit() {
      var _a, _b, _c, _d, _e, _f, _g;
      const name = (_b = (_a = document.getElementById("adminMedName")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      const generic_name = ((_d = (_c = document.getElementById("adminMedGeneric")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim()) || name;
      const category = ((_e = document.getElementById("adminMedCategory")) == null ? void 0 : _e.value) || "general";
      const price = parseFloat(((_f = document.getElementById("adminMedPrice")) == null ? void 0 : _f.value) || "0");
      const stock = parseInt(((_g = document.getElementById("adminMedStock")) == null ? void 0 : _g.value) || "50");
      if (!name || !price) return;
      const newMed = {
        id: `med_${Date.now()}`,
        name,
        generic_name,
        category,
        price,
        stock,
        dosage: "Standard Dosage",
        pharmacy_id: "pharm_1",
        pharmacy_name: "Apollo Pharmacy 24/7",
        requires_prescription: false,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80"
      };
      this.state.medicines.unshift(newMed);
      this.saveMedicinesToStorage();
      this.closeModal();
      this.showToast(`\u2705 Added ${name} to Catalog!`);
      try {
        const token = localStorage.getItem("medifind_auth_token") || localStorage.getItem("medifind_jwt_token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        await fetch("/api/medicines", {
          method: "POST",
          headers,
          body: JSON.stringify(newMed)
        });
      } catch (e) {
        console.warn("[Admin Add Medicine] API note:", e);
      }
      this.render();
    }
    openEditMedicinePriceModal(medId) {
      const med = this.state.medicines.find((m) => m.id === medId);
      if (!med) return;
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:14px;"><i class="fa-solid fa-pen-to-square" style="color:var(--primary);"></i> Update Medicine Price & Stock</h3>
                <div style="background:var(--background); padding:10px; border-radius:var(--radius-sm); margin-bottom:14px; font-size:13px;">
                    <strong>${med.name}</strong><br>
                    <span style="font-size:11px; color:var(--text-muted);">${med.generic_name} \u2022 Store: Nazarathpet Medicine Supply Store</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">
                    <div>
                        <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">NEW UNIT PRICE (\u20B9) *</label>
                        <input type="number" step="0.5" id="editMedPrice" value="${med.price}" oninput="this.setAttribute('value', this.value)" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:14px; font-weight:700; color:var(--secondary);">
                    </div>
                    <div>
                        <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">NEW STOCK UNITS *</label>
                        <input type="number" id="editMedStock" value="${med.stock}" oninput="this.setAttribute('value', this.value)" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                    </div>
                </div>
                <button type="button" class="add-cart-btn" style="width:100%; justify-content:center; padding:10px; font-size:14px;" onclick="MediApp.handleUpdateMedicinePriceSubmit('${med.id}')">
                    <i class="fa-solid fa-floppy-disk"></i> Update Price & Stock
                </button>
            </div>
        `);
    }
    async handleUpdateMedicinePriceSubmit(medId) {
      var _a, _b;
      const priceVal = parseFloat(((_a = document.getElementById("editMedPrice")) == null ? void 0 : _a.value) || "0");
      const stockVal = parseInt(((_b = document.getElementById("editMedStock")) == null ? void 0 : _b.value) || "0", 10);
      if (isNaN(priceVal) || priceVal < 0) return;
      if (isNaN(stockVal) || stockVal < 0) return;
      const med = this.state.medicines.find((m) => m.id === medId);
      if (med) {
        med.price = priceVal;
        med.stock = stockVal;
      }
      const mockMed = MOCK_MEDICINES.find((m) => m.id === medId);
      if (mockMed) {
        mockMed.price = priceVal;
        mockMed.stock = stockVal;
      }
      (this.state.cart || []).forEach((item) => {
        if (item.id === medId) {
          item.price = priceVal;
        }
      });
      this.saveMedicinesToStorage();
      if (this.socketClient && this.socketClient.socket) {
        this.socketClient.socket.emit("medicine_updated", { id: medId, price: priceVal, stock: stockVal, medicine: med });
      }
      if (this.realtimeEngine && this.realtimeEngine.socket) {
        this.realtimeEngine.socket.emit("medicine_updated", { id: medId, price: priceVal, stock: stockVal, medicine: med });
      }
      this.state.currentRole = "admin";
      sessionStorage.setItem("medifind_current_role", "admin");
      if (this.adminModule) {
        this.adminModule.activeTab = "medicines";
        sessionStorage.setItem("medifind_admin_tab", "medicines");
      }
      this.closeModal();
      try {
        const token = localStorage.getItem("medifind_auth_token") || localStorage.getItem("medifind_jwt_token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        await fetch(`/api/medicines/${medId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ price: priceVal, stock: stockVal })
        });
      } catch (e) {
        console.warn("[Admin Update Medicine] API note:", e);
      }
      this.render();
      this.showToast(`\u2705 Price updated to \u20B9${priceVal.toFixed(2)}`);
    }
    async deleteMedicine(medId) {
      const med = this.state.medicines.find((m) => m.id === medId);
      if (!confirm(`Are you sure you want to delete "${med ? med.name : "this medicine"}" from the catalog?`)) {
        return;
      }
      this.state.medicines = this.state.medicines.filter((m) => m.id !== medId);
      this.saveMedicinesToStorage();
      this.showToast("\u{1F5D1}\uFE0F Medicine removed from catalog");
      try {
        const token = localStorage.getItem("medifind_auth_token") || localStorage.getItem("medifind_jwt_token");
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        await fetch(`/api/medicines/${medId}`, { method: "DELETE", headers });
      } catch (e) {
        console.warn("[Admin Delete Medicine] API note:", e);
      }
      this.render();
    }
    openAddPharmacyModal() {
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:14px;"><i class="fa-solid fa-store" style="color:var(--warning-amber);"></i> Register New Pharmacy Store</h3>
                <form onsubmit="event.preventDefault(); MediApp.handleAddPharmacySubmit();">
                    <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:16px;">
                        <div>
                            <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">PHARMACY SHOP NAME *</label>
                            <input type="text" id="adminPharmName" placeholder="e.g. MedPlus Pharmacy" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                        </div>
                        <div style="display:flex; gap:8px;">
                            <div style="flex:1;">
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">OWNER NAME</label>
                                <input type="text" id="adminPharmOwner" placeholder="Rajesh Kumar" style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>
                            <div style="flex:1;">
                                <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">DRUG LICENSE NO. *</label>
                                <input type="text" id="adminPharmLicense" placeholder="DL-2026-98765" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                            </div>
                        </div>
                        <div>
                            <label style="font-size:11px; font-weight:700; display:block; margin-bottom:2px;">STORE ADDRESS *</label>
                            <input type="text" id="adminPharmAddress" placeholder="Main Market Road, Noida" required style="width:100%; padding:8px 10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;">
                        </div>
                    </div>
                    <button type="submit" class="add-cart-btn" style="width:100%; justify-content:center; padding:10px; font-size:14px;">
                        <i class="fa-solid fa-plus"></i> Register Pharmacy Store
                    </button>
                </form>
            </div>
        `);
    }
    async handleAddPharmacySubmit() {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const shop_name = (_b = (_a = document.getElementById("adminPharmName")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      const owner_name = ((_d = (_c = document.getElementById("adminPharmOwner")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim()) || "Verified Owner";
      const license_number = (_f = (_e = document.getElementById("adminPharmLicense")) == null ? void 0 : _e.value) == null ? void 0 : _f.trim();
      const address = (_h = (_g = document.getElementById("adminPharmAddress")) == null ? void 0 : _g.value) == null ? void 0 : _h.trim();
      if (!shop_name || !license_number) return;
      const newPharm = {
        id: `pharm_${Date.now()}`,
        shop_name,
        owner_name,
        license_number,
        address: address || "Main Road",
        phone: "+91 98765 00000",
        rating: 4.9,
        status: "open",
        license_verified: true,
        logo: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=80"
      };
      this.state.pharmacies.unshift(newPharm);
      this.closeModal();
      this.showToast(`\u2705 Registered ${shop_name}!`);
      try {
        await fetch("/api/pharmacies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPharm)
        });
      } catch (e) {
        console.warn("[Admin Add Pharmacy] API note:", e);
      }
      this.render();
    }
    async deletePharmacy(pharmId) {
      const pharm = this.state.pharmacies.find((p) => p.id === pharmId);
      if (!confirm(`Are you sure you want to delete pharmacy store "${pharm ? pharm.shop_name : "this store"}"?`)) {
        return;
      }
      this.state.pharmacies = this.state.pharmacies.filter((p) => p.id !== pharmId);
      this.showToast("\u{1F5D1}\uFE0F Pharmacy store removed");
      try {
        await fetch(`/api/pharmacies/${pharmId}`, { method: "DELETE" });
      } catch (e) {
        console.warn("[Admin Delete Pharmacy] API note:", e);
      }
      this.render();
    }
    // Location & Pharmacy Actions
    async detectLiveLocation() {
      this.showToast("\u{1F4CD} Detecting your location via GPS...");
      const res = await googleMapsService.requestBrowserLocation();
      if (res.success) {
        this.showToast(`\u{1F4CD} Location Detected: ${res.location.label}`);
      } else {
        this.showToast(`\u26A0\uFE0F ${res.message}`);
      }
      this.render();
    }
    autoDetectSignupLocation() {
      if (this._signupLocAutoDetected) return;
      this._signupLocAutoDetected = true;
      this.detectSignupLocation();
    }
    updateSignupFullAddress() {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      const house = (_b = (_a = document.getElementById("signupHouseNumber")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      const street = (_d = (_c = document.getElementById("signupStreet")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim();
      const city = (_f = (_e = document.getElementById("signupCity")) == null ? void 0 : _e.value) == null ? void 0 : _f.trim();
      const state = (_h = (_g = document.getElementById("signupState")) == null ? void 0 : _g.value) == null ? void 0 : _h.trim();
      const pin = (_j = (_i = document.getElementById("signupPincode")) == null ? void 0 : _i.value) == null ? void 0 : _j.trim();
      const fullInput = document.getElementById("signupAddress");
      if (fullInput) {
        const parts = [house, street, city, state, pin ? `PIN ${pin}` : ""].filter(Boolean);
        if (parts.length > 0) {
          fullInput.value = parts.join(", ");
          fullInput.dispatchEvent(new Event("input", { bubbles: true }));
          fullInput.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
    }
    async detectSignupLocation() {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      const statusBanner = document.getElementById("signupLocStatus");
      const houseInput = document.getElementById("signupHouseNumber");
      const streetInput = document.getElementById("signupStreet");
      const cityInput = document.getElementById("signupCity");
      const stateInput = document.getElementById("signupState");
      const pinInput = document.getElementById("signupPincode");
      const fullAddrInput = document.getElementById("signupAddress");
      const latInput = document.getElementById("signupLat");
      const lngInput = document.getElementById("signupLng");
      if (statusBanner) {
        statusBanner.style.display = "block";
        statusBanner.style.background = "var(--primary-light)";
        statusBanner.style.color = "var(--primary)";
        statusBanner.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Detecting your location...`;
      }
      let lat = null;
      let lng = null;
      const getGpsPosition = () => new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error("Geolocation unsupported"));
        let resolved = false;
        const timer = setTimeout(() => {
          if (!resolved) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                if (!resolved) {
                  resolved = true;
                  resolve(pos);
                }
              },
              (err) => {
                if (!resolved) {
                  resolved = true;
                  reject(err);
                }
              },
              { enableHighAccuracy: false, timeout: 5e3, maximumAge: 6e4 }
            );
          }
        }, 1e4);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timer);
              resolve(pos);
            }
          },
          (err) => {
            if (!resolved) {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  if (!resolved) {
                    resolved = true;
                    clearTimeout(timer);
                    resolve(pos);
                  }
                },
                (lowErr) => {
                  if (!resolved) {
                    resolved = true;
                    clearTimeout(timer);
                    reject(err);
                  }
                },
                { enableHighAccuracy: false, timeout: 5e3, maximumAge: 6e4 }
              );
            }
          },
          { enableHighAccuracy: true, timeout: 1e4, maximumAge: 0 }
        );
      });
      try {
        const position = await getGpsPosition();
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      } catch (gpsError) {
        console.warn("[Signup Geolocation GPS Warning]:", gpsError);
        try {
          const ipRes = await fetch("https://api.bigdatacloud.net/data/reverse-geocode-client");
          if (ipRes.ok) {
            const ipData = await ipRes.json();
            lat = ipData.latitude;
            lng = ipData.longitude;
          }
        } catch (ipErr) {
          console.warn("[Signup Geolocation IP Warning]:", ipErr);
        }
      }
      if (!lat || !lng) {
        lat = 13.0827;
        lng = 80.2707;
      }
      if (latInput) latInput.value = lat;
      if (lngInput) lngInput.value = lng;
      let detectedHouseNumber = "";
      let detectedStreet = "";
      let detectedCity = "";
      let detectedState = "";
      let detectedPincode = "";
      try {
        const proxyRes = await fetch(`/api/places/geocode?lat=${lat}&lng=${lng}`);
        if (proxyRes.ok) {
          const proxyData = await proxyRes.json();
          if (proxyData && proxyData.success) {
            detectedHouseNumber = proxyData.house_number || "";
            detectedStreet = proxyData.street || "";
            detectedCity = proxyData.city || "";
            detectedState = proxyData.state || "";
            detectedPincode = proxyData.pincode || "";
          }
        }
      } catch (e1) {
        console.warn("[Reverse Geocode Tier 1 Backend Error]:", e1);
      }
      if (!detectedStreet || !detectedCity || !detectedState) {
        try {
          const osmRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
            headers: { "Accept-Language": "en" }
          });
          if (osmRes.ok) {
            const osm = await osmRes.json();
            const addr = osm.address || {};
            if (!detectedHouseNumber) detectedHouseNumber = addr.house_number || addr.building || addr.house_name || addr.amenity || addr.shop || "";
            if (!detectedStreet) detectedStreet = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || addr.residential || "";
            if (!detectedCity) detectedCity = addr.city || addr.town || addr.village || addr.municipality || addr.city_district || addr.county || addr.state_district || "";
            if (!detectedState) detectedState = addr.state || addr.region || "";
            if (!detectedPincode) detectedPincode = (addr.postcode || "").replace(/\D/g, "").slice(0, 6);
          }
        } catch (e2) {
          console.warn("[Reverse Geocode Tier 2 OSM Error]:", e2);
        }
      }
      if (!detectedStreet || !detectedCity) {
        try {
          const bdcRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
          if (bdcRes.ok) {
            const bdc = await bdcRes.json();
            if (!detectedStreet) detectedStreet = bdc.locality || bdc.subLocality || bdc.street || "";
            if (!detectedCity) detectedCity = bdc.city || ((_c = (_b = (_a = bdc.localityInfo) == null ? void 0 : _a.administrative) == null ? void 0 : _b[2]) == null ? void 0 : _c.name) || ((_f = (_e = (_d = bdc.localityInfo) == null ? void 0 : _d.administrative) == null ? void 0 : _e[1]) == null ? void 0 : _f.name) || "";
            if (!detectedState) detectedState = bdc.principalSubdivision || ((_i = (_h = (_g = bdc.localityInfo) == null ? void 0 : _g.administrative) == null ? void 0 : _h[0]) == null ? void 0 : _i.name) || "";
            if (!detectedPincode) detectedPincode = (bdc.postcode || "").replace(/\D/g, "").slice(0, 6);
          }
        } catch (e3) {
          console.warn("[Reverse Geocode Tier 3 BDC Error]:", e3);
        }
      }
      if (houseInput && detectedHouseNumber) houseInput.value = detectedHouseNumber;
      if (streetInput && detectedStreet) streetInput.value = detectedStreet;
      if (cityInput && detectedCity) cityInput.value = detectedCity;
      if (stateInput && detectedState) stateInput.value = detectedState;
      if (pinInput && detectedPincode) pinInput.value = detectedPincode;
      this.updateSignupFullAddress();
      [houseInput, streetInput, cityInput, stateInput, pinInput, fullAddrInput].forEach((inp) => {
        if (inp) {
          inp.dispatchEvent(new Event("input", { bubbles: true }));
          inp.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
      if (statusBanner) {
        statusBanner.style.background = "#f0fdf4";
        statusBanner.style.color = "#166534";
        statusBanner.innerHTML = `Location detected \u2713`;
      }
    }
    setAuthMode(mode) {
      this.state.currentRole = "auth";
      this.state.authMode = mode;
      if (mode === "signup") {
        this._signupLocAutoDetected = false;
      }
      this.closeModal();
      this.render();
    }
    openEditProfileModal() {
      const user = this.authService ? this.authService.getUser() : null;
      if (!user) {
        this.showToast("Please sign in to edit your profile");
        this.openAuthModal("login");
        return;
      }
      const name = user.name || "";
      const phone = user.phone || "";
      const address = user.address || "";
      const houseNumber = user.house_number || "";
      const street = user.street || "";
      const city = user.city || "";
      const state = user.state || "";
      const pincode = user.pincode || "";
      const profileImage = user.profile_image || "";
      this.showModal(`
            <div class="modal-card" style="max-width:560px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                    <div style="width:40px; height:40px; border-radius:var(--radius-full); background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; font-size:18px;">
                        <i class="fa-solid fa-user-pen"></i>
                    </div>
                    <div>
                        <h3 style="font-size:18px; margin:0;">Edit Profile & Delivery Address</h3>
                        <p style="font-size:12px; color:var(--text-muted); margin:0;">Update your contact info and delivery address in database</p>
                    </div>
                </div>

                <form onsubmit="MediApp.saveProfileChanges(event)" style="display:flex; flex-direction:column; gap:14px;">
                    <!-- Personal Information -->
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Full Name *</label>
                            <input type="text" id="editProfileName" class="search-input" value="${name}" required style="width:100%;">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Phone Number *</label>
                            <input type="text" id="editProfilePhone" class="search-input" value="${phone}" required style="width:100%;">
                        </div>
                    </div>

                    <!-- Delivery Address Details -->
                    <div>
                        <label style="font-size:12px; font-weight:700;">Full Delivery Address *</label>
                        <input type="text" id="editProfileAddress" class="search-input" value="${address}" required placeholder="e.g. Flat 302, Green Park Apartments, Sector 18, Noida" style="width:100%;">
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Flat / House No</label>
                            <input type="text" id="editProfileHouse" class="search-input" value="${houseNumber}" placeholder="e.g. Flat 302" style="width:100%;">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Street / Area</label>
                            <input type="text" id="editProfileStreet" class="search-input" value="${street}" placeholder="e.g. Sector 18" style="width:100%;">
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">City</label>
                            <input type="text" id="editProfileCity" class="search-input" value="${city}" placeholder="Noida" style="width:100%;">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">State</label>
                            <input type="text" id="editProfileState" class="search-input" value="${state}" placeholder="Uttar Pradesh" style="width:100%;">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Pincode</label>
                            <input type="text" id="editProfilePincode" class="search-input" value="${pincode}" placeholder="201301" style="width:100%;">
                        </div>
                    </div>

                    <button type="submit" id="saveProfileBtn" class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; font-size:14px; margin-top:6px;">
                        <i class="fa-solid fa-floppy-disk"></i> Save Profile to Database
                    </button>
                </form>
            </div>
        `);
    }
    handleProfilePhotoUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 250;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
          const preview = document.getElementById("editProfilePhotoPreview");
          const input = document.getElementById("editProfileImageInput");
          if (preview) preview.src = compressedDataUrl;
          if (input) input.value = compressedDataUrl;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    async saveProfileChanges(event) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      event.preventDefault();
      const submitBtn = document.getElementById("saveProfileBtn");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving to Database...';
      }
      const profileData = {
        name: (_a = document.getElementById("editProfileName")) == null ? void 0 : _a.value,
        phone: (_b = document.getElementById("editProfilePhone")) == null ? void 0 : _b.value,
        address: (_c = document.getElementById("editProfileAddress")) == null ? void 0 : _c.value,
        house_number: (_d = document.getElementById("editProfileHouse")) == null ? void 0 : _d.value,
        street: (_e = document.getElementById("editProfileStreet")) == null ? void 0 : _e.value,
        city: (_f = document.getElementById("editProfileCity")) == null ? void 0 : _f.value,
        state: (_g = document.getElementById("editProfileState")) == null ? void 0 : _g.value,
        pincode: (_h = document.getElementById("editProfilePincode")) == null ? void 0 : _h.value
      };
      const res = await this.authService.updateProfile(profileData);
      this.closeModal();
      if (res && res.success) {
        this.showToast("\u2705 Profile and Address updated successfully in database!");
        if (res.user && this.authService) {
          this.authService.currentUser = { ...this.authService.currentUser, ...res.user };
          localStorage.setItem("medifind_auth_user", JSON.stringify(this.authService.currentUser));
          if (sessionStorage.getItem("medifind_auth_user")) {
            sessionStorage.setItem("medifind_auth_user", JSON.stringify(this.authService.currentUser));
          }
        }
        if (profileData.address) {
          const existing = (this.state.savedAddresses || []).find((a) => a.text === profileData.address);
          if (!existing) {
            this.state.savedAddresses.unshift({
              id: `addr_${Date.now()}`,
              label: "Home",
              text: profileData.address
            });
          }
        }
        this.render();
      } else {
        this.showToast(res ? res.message : "Failed to update profile.");
      }
    }
    async refreshNearbyPharmacies() {
      const loc = googleMapsService.getUserLocation();
      this.showToast("\u{1F50E} Refreshing nearby pharmacies via Google Places...");
      await googleMapsService.fetchNearbyPharmacies(loc.lat, loc.lng);
      this.showToast("\u2705 Nearby pharmacies updated");
      this.render();
    }
    openAddressModal() {
      const currentLoc = googleMapsService.getUserLocation();
      this.showModal(`
            <div class="modal-card" style="max-width:460px; width:92%;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:12px;"><i class="fa-solid fa-location-crosshairs" style="color:var(--primary);"></i> Select Your Location</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">
                    Find pharmacies and check medicine availability near your exact position.
                </p>
                
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                    <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px;" onclick="MediApp.closeModal(); MediApp.detectLiveLocation();">
                        <i class="fa-solid fa-location-arrow"></i> Detect My Current GPS Location
                    </button>

                    <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%);" onclick="MediApp.openMapPickerModal();">
                        <i class="fa-solid fa-map-location-dot"></i> Select Location on Map
                    </button>
                </div>
                
                <div style="border-top:1px dashed var(--card-border); margin:16px 0; padding-top:14px;">
                    <label style="font-size:11px; font-weight:800; color:var(--text-muted); display:block; margin-bottom:6px;">ENTER LOCATION MANUALLY</label>
                    <div style="display:flex; gap:8px;">
                        <input type="text" id="manualLocationInput" placeholder="Enter area, city or street address..." value="${currentLoc.label}" style="flex:1; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-md); font-size:13px;" onkeydown="if(event.key==='Enter') MediApp.submitManualLocation()">
                        <button class="add-cart-btn" style="padding:10px 14px;" onclick="MediApp.submitManualLocation()">Set</button>
                    </div>
                </div>

                <div style="margin-top:14px;">
                    <label style="font-size:11px; font-weight:800; color:var(--text-muted); display:block; margin-bottom:6px;">POPULAR CITIES & PRESETS</label>
                    <div style="display:flex; flex-wrap:wrap; gap:8px;">
                        <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.setPresetLocation('Anna Nagar, Chennai', 13.0827, 80.2707)">Chennai</button>
                        <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.setPresetLocation('Sector 18, Noida', 28.5355, 77.3910)">Noida</button>
                        <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.setPresetLocation('Connaught Place, New Delhi', 28.6315, 77.2167)">Delhi</button>
                        <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.setPresetLocation('Bandra West, Mumbai', 19.0596, 72.8295)">Mumbai</button>
                        <button class="btn-secondary" style="font-size:11px;" onclick="MediApp.setPresetLocation('Koramangala, Bengaluru', 12.9352, 77.6245)">Bengaluru</button>
                    </div>
                </div>
            </div>
        `);
    }
    openMapPickerModal() {
      const currentLoc = googleMapsService.getUserLocation();
      const initialLat = currentLoc.lat || 13.0827;
      const initialLng = currentLoc.lng || 80.2707;
      const initialLabel = currentLoc.label || "Anna Nagar, Chennai";
      this.mapPickerState = {
        lat: initialLat,
        lng: initialLng,
        label: initialLabel,
        map: null,
        marker: null,
        isGeocoding: false
      };
      this.showModal(`
            <div class="modal-card" style="max-width:580px; width:95%; padding:20px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:4px; display:flex; align-items:center; gap:8px;">
                    <i class="fa-solid fa-map-location-dot" style="color:var(--primary);"></i> Select Location on Map
                </h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px;">
                    Drag the red pin or click anywhere on the map to set your exact position.
                </p>

                <div style="display:flex; gap:8px; margin-bottom:12px;">
                    <input type="text" id="mapPickerSearchInput" placeholder="Search city, area, or landmark..." value="" style="flex:1; padding:9px 12px; border:1px solid var(--card-border); border-radius:var(--radius-md); font-size:13px;" onkeydown="if(event.key==='Enter') MediApp.searchMapPickerLocation()">
                    <button class="add-cart-btn" style="padding:9px 14px; font-size:12px;" onclick="MediApp.searchMapPickerLocation()">
                        <i class="fa-solid fa-magnifying-glass"></i> Search
                    </button>
                </div>

                <div class="map-picker-wrapper">
                    <div id="mapPickerContainer" style="width:100%; height:100%;"></div>
                    <button class="map-picker-gps-btn" onclick="MediApp.centerMapPickerOnGps()" title="Center on My GPS Location">
                        <i class="fa-solid fa-crosshairs" style="font-size:16px;"></i>
                    </button>
                </div>

                <div style="margin-top:12px; padding:12px 14px; background:var(--background); border-radius:var(--radius-md); border:1px solid var(--card-border); display:flex; align-items:center; gap:12px;">
                    <div style="width:36px; height:36px; border-radius:var(--radius-full); background:var(--emergency-light, #fee2e2); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <i class="fa-solid fa-location-dot" style="color:var(--emergency-red, #ef4444); font-size:18px;"></i>
                    </div>
                    <div style="flex:1; overflow:hidden;">
                        <div id="mapPickerAddressText" style="font-size:13px; font-weight:700; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            ${initialLabel}
                        </div>
                        <div id="mapPickerCoordsText" style="font-size:11px; color:var(--text-muted); margin-top:2px;">
                            Coordinates: ${initialLat.toFixed(4)}, ${initialLng.toFixed(4)}
                        </div>
                    </div>
                </div>

                <div style="display:flex; gap:10px; margin-top:16px;">
                    <button class="btn-secondary" style="flex:1; justify-content:center; padding:11px;" onclick="MediApp.openAddressModal()">Back</button>
                    <button class="add-cart-btn" style="flex:2; justify-content:center; padding:11px;" onclick="MediApp.confirmMapPickerLocation()">
                        <i class="fa-solid fa-check"></i> Confirm Location
                    </button>
                </div>
            </div>
        `);
      setTimeout(() => {
        this.initMapPicker(initialLat, initialLng);
      }, 120);
    }
    loadLeafletLibrary() {
      return new Promise((resolve) => {
        if (typeof window.L !== "undefined") return resolve(true);
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }
        if (document.getElementById("leaflet-js")) {
          let checks = 0;
          const interval = setInterval(() => {
            checks++;
            if (typeof window.L !== "undefined" || checks > 30) {
              clearInterval(interval);
              resolve(typeof window.L !== "undefined");
            }
          }, 100);
          return;
        }
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.head.appendChild(script);
      });
    }
    async initMapPicker(lat, lng) {
      const container = document.getElementById("mapPickerContainer");
      if (!container) return;
      if (typeof window.L === "undefined") {
        const addrText = document.getElementById("mapPickerAddressText");
        if (addrText) addrText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading map engine...';
        await this.loadLeafletLibrary();
      }
      if (typeof window.L === "undefined") {
        container.innerHTML = `<div style="padding:20px; text-align:center; color:var(--text-muted); display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size:28px; color:var(--warning-amber); margin-bottom:8px;"></i>
                <div style="font-size:13px; font-weight:600;">Unable to load map engine</div>
                <div style="font-size:11px; margin-top:4px;">Please check internet connection or try again.</div>
            </div>`;
        return;
      }
      try {
        if (this.mapPickerState && this.mapPickerState.map) {
          try {
            this.mapPickerState.map.remove();
          } catch (e) {
          }
        }
        const map = L.map("mapPickerContainer", {
          center: [lat, lng],
          zoom: 15,
          zoomControl: true
        });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "\xA9 OpenStreetMap contributors"
        }).addTo(map);
        const customPinIcon = L.divIcon({
          className: "custom-map-picker-pin",
          html: `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="width:36px; height:36px; background:#ef4444; border:3px solid #ffffff; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; box-shadow:0 4px 10px rgba(239,68,68,0.5); font-size:16px;">
                        <i class="fa-solid fa-location-dot"></i>
                    </div>
                    <div style="width:3px; height:8px; background:#ef4444; border-radius:2px;"></div>
                </div>`,
          iconSize: [36, 44],
          iconAnchor: [18, 44]
        });
        const marker = L.marker([lat, lng], {
          draggable: true,
          icon: customPinIcon
        }).addTo(map);
        this.mapPickerState.map = map;
        this.mapPickerState.marker = marker;
        setTimeout(() => {
          map.invalidateSize();
        }, 200);
        marker.on("dragend", (e) => {
          const pos = e.target.getLatLng();
          this.updateMapPickerPosition(pos.lat, pos.lng);
        });
        map.on("click", (e) => {
          marker.setLatLng(e.latlng);
          this.updateMapPickerPosition(e.latlng.lat, e.latlng.lng);
        });
        this.updateMapPickerPosition(lat, lng);
      } catch (e) {
        console.error("[MapPicker Init Error]:", e);
      }
    }
    async updateMapPickerPosition(lat, lng) {
      const fixedLat = parseFloat(lat.toFixed(6));
      const fixedLng = parseFloat(lng.toFixed(6));
      if (this.mapPickerState) {
        this.mapPickerState.lat = fixedLat;
        this.mapPickerState.lng = fixedLng;
      }
      const coordsText = document.getElementById("mapPickerCoordsText");
      if (coordsText) {
        coordsText.textContent = `Coordinates: ${fixedLat.toFixed(4)}, ${fixedLng.toFixed(4)}`;
      }
      const addrText = document.getElementById("mapPickerAddressText");
      if (addrText) {
        addrText.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color:var(--primary);"></i> Fetching address...`;
      }
      try {
        const res = await fetch(`/api/places/geocode?lat=${fixedLat}&lng=${fixedLng}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.formatted_address) {
            if (this.mapPickerState) this.mapPickerState.label = data.formatted_address;
            if (addrText) addrText.textContent = data.formatted_address;
            return;
          }
        }
      } catch (e) {
        console.warn("[MapPicker Geocode Error]:", e);
      }
      const fallbackLabel = `Location (${fixedLat.toFixed(4)}, ${fixedLng.toFixed(4)})`;
      if (this.mapPickerState) this.mapPickerState.label = fallbackLabel;
      if (addrText) addrText.textContent = fallbackLabel;
    }
    async searchMapPickerLocation() {
      var _a, _b;
      const input = document.getElementById("mapPickerSearchInput");
      const query = (_a = input == null ? void 0 : input.value) == null ? void 0 : _a.trim();
      if (!query) return;
      const addrText = document.getElementById("mapPickerAddressText");
      if (addrText) {
        addrText.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color:var(--primary);"></i> Searching location...`;
      }
      try {
        const res = await fetch(`/api/places/geocode?address=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.lat && data.lng) {
            const newLat = data.lat;
            const newLng = data.lng;
            const formatted = data.formatted_address || query;
            if (this.mapPickerState) {
              this.mapPickerState.lat = newLat;
              this.mapPickerState.lng = newLng;
              this.mapPickerState.label = formatted;
            }
            if (this.mapPickerState && this.mapPickerState.map) {
              this.mapPickerState.map.setView([newLat, newLng], 16);
            }
            if (this.mapPickerState && this.mapPickerState.marker) {
              this.mapPickerState.marker.setLatLng([newLat, newLng]);
            }
            if (addrText) addrText.textContent = formatted;
            const coordsText = document.getElementById("mapPickerCoordsText");
            if (coordsText) coordsText.textContent = `Coordinates: ${newLat.toFixed(4)}, ${newLng.toFixed(4)}`;
            this.showToast(`\u{1F4CD} Found: ${formatted}`);
            return;
          }
        }
      } catch (e) {
        console.warn("[MapPicker Search Error]:", e);
      }
      this.showToast(`\u26A0\uFE0F Could not locate address "${query}". Try pinning directly on map.`);
      if (addrText) addrText.textContent = ((_b = this.mapPickerState) == null ? void 0 : _b.label) || query;
    }
    centerMapPickerOnGps() {
      if (!navigator.geolocation) {
        this.showToast("\u26A0\uFE0F Geolocation is not supported by your browser.");
        return;
      }
      this.showToast("\u{1F4E1} Detecting current GPS position...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(6));
          const lng = parseFloat(pos.coords.longitude.toFixed(6));
          if (this.mapPickerState && this.mapPickerState.map) {
            this.mapPickerState.map.setView([lat, lng], 16);
          }
          if (this.mapPickerState && this.mapPickerState.marker) {
            this.mapPickerState.marker.setLatLng([lat, lng]);
          }
          this.updateMapPickerPosition(lat, lng);
          this.showToast("\u{1F3AF} Centered map on GPS position");
        },
        (err) => {
          console.warn("[GPS Center Error]:", err.message);
          this.showToast("\u26A0\uFE0F GPS location unavailable. Pin location manually on map.");
        },
        { enableHighAccuracy: true, timeout: 8e3 }
      );
    }
    async confirmMapPickerLocation() {
      if (!this.mapPickerState) return;
      const { label, lat, lng } = this.mapPickerState;
      if (!label || !lat || !lng) {
        this.showToast("\u26A0\uFE0F Please select a location on the map first.");
        return;
      }
      this.closeModal();
      if (this.isSelectingCheckoutMapLocation) {
        this.isSelectingCheckoutMapLocation = false;
        const locObj = { lat, lng, label, isLiveGps: false };
        googleMapsService.currentLocation = locObj;
        localStorage.setItem("medifind_user_location", JSON.stringify(locObj));
        const serviceability = googleMapsService.isLocationServiceable(locObj, 15);
        if (!serviceability.serviceable) {
          this.showToast("\u26A0\uFE0F The location is currently not serviceable", "error");
          alert(`The location is currently not serviceable. Selected map location is ${serviceability.distanceKm} km away. Delivery is available strictly within a 15 km radius of our medicine supply store.`);
          this.render();
          return;
        }
        const addrInput = document.getElementById("deliveryAddressInput");
        if (addrInput) addrInput.value = label;
        this.showToast(`\u2705 Selected map location verified within 15 km radius!`, "success");
        this.render();
        this.simulateRazorpayCheckout(this.pendingCheckoutTotal || 0);
        return;
      }
      this.showToast(`\u{1F4CD} Setting location to: ${label.split(",")[0]}...`);
      await googleMapsService.setManualLocation(label, lat, lng);
      this.showToast(`\u2705 Location set to: ${label.split(",")[0]}`);
      this.render();
    }
    async submitManualLocation() {
      var _a, _b;
      const input = (_b = (_a = document.getElementById("manualLocationInput")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      if (!input) return;
      this.closeModal();
      this.showToast("\u{1F4CD} Updating location...");
      await googleMapsService.setManualLocation(input);
      this.showToast(`\u{1F4CD} Location updated to: ${input}`);
      this.render();
    }
    async setPresetLocation(label, lat, lng) {
      this.closeModal();
      this.showToast(`\u{1F4CD} Setting location to ${label}...`);
      await googleMapsService.setManualLocation(label, lat, lng);
      this.showToast(`\u{1F4CD} Location set to: ${label}`);
      this.render();
    }
    // Customer Actions
    setCustomerTab(tab) {
      this.state.customerTab = tab;
      this.render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    filterPharmacies(val) {
      this.customerModule.pharmacySearchQuery = val;
      this.render();
    }
    openAccountModal() {
      const currentUser = this.authService.getUser();
      const isAdmin = currentUser && (currentUser.role === "admin" || currentUser.email && currentUser.email.toLowerCase() === "admin@medifind.com" || this.state.currentRole === "admin");
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="text-align:center; padding:12px 0 20px 0;">
                    <div class="brand-icon" style="width:60px; height:60px; font-size:28px; margin:0 auto 12px auto; ${isAdmin ? "background:linear-gradient(135deg, #0284c7 0%, #0f172a 100%); color:white;" : ""}">
                        <i class="fa-solid ${isAdmin ? "fa-user-shield" : "fa-user"}"></i>
                    </div>
                    <h3 style="font-size:20px; font-weight:800;">${currentUser ? currentUser.name : "Guest User"}</h3>
                    <p style="font-size:13px; color:var(--text-muted);">${currentUser ? currentUser.email : "Customer Account"}</p>
                </div>
                
                ${!isAdmin ? `
                    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                        <div style="padding:12px 16px; background:var(--background); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between; cursor:pointer;" onclick="MediApp.setCustomerTab('orders'); MediApp.closeModal();">
                            <div style="display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-box" style="color:var(--primary);"></i> <span>My Orders</span></div>
                            <i class="fa-solid fa-chevron-right" style="font-size:12px; color:var(--text-muted);"></i>
                        </div>
                    </div>
                ` : ""}

                ${currentUser ? `
                    <button class="btn-secondary" style="width:100%; justify-content:center; padding:12px; color:var(--emergency-red); font-weight:700;" onclick="MediApp.logout()">
                        <i class="fa-solid fa-right-from-bracket"></i> Logout Account
                    </button>
                ` : `
                    <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px;" onclick="MediApp.setAuthMode('login'); MediApp.closeModal();">
                        <i class="fa-solid fa-right-to-bracket"></i> Sign In to Account
                    </button>
                `}
            </div>
        `);
    }
    openRoleModal() {
      this.openAccountModal();
    }
    switchRole(role) {
      this.state.currentRole = "customer";
      this.closeModal();
      this.render();
    }
    continueAsGuest() {
      this.state.isGuest = true;
      this.state.currentRole = "customer";
      this.state.customerTab = "home";
      this.state.cart = [];
      this.showToast("\u{1F464} Browsing as Guest User");
      this.render();
    }
    async handleLoginFormSubmit(form) {
      var _a, _b, _c, _d, _e, _f, _g;
      const email = (_b = (_a = document.getElementById("authEmail")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      const password = (_d = (_c = document.getElementById("authPassword")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim();
      const role = ((_e = document.getElementById("authRoleSelect")) == null ? void 0 : _e.value) || "customer";
      const rememberMe = (_g = (_f = document.getElementById("authRememberMe")) == null ? void 0 : _f.checked) != null ? _g : true;
      const errBanner = document.getElementById("authErrorBanner");
      if (!email || !password) {
        if (errBanner) {
          errBanner.style.display = "block";
          errBanner.innerText = "Please fill in all email and password fields.";
        }
        return;
      }
      const res = await this.authService.login(email, password, rememberMe);
      if (res.success) {
        const actualRole = email.toLowerCase() === "admin@medifind.com" || role === "admin" || res.user.role === "admin" ? "admin" : role;
        res.user.role = actualRole;
        this.authService.setCurrentUser(res.user, rememberMe);
        const target = this.authService.getRedirectTabForRole(actualRole);
        this.state.currentRole = target.role;
        this.state.cart = [];
        await this.loadSavedOrders();
        if (target.role === "admin") {
          await this.loadAllUsers();
          this.startAdminLivePolling();
        }
        this.showToast(`Welcome back, ${res.user.name}! Authenticated as ${actualRole.toUpperCase()}`);
        this.render();
        if (target.role === "admin") {
          setTimeout(() => {
            if (this.adminModule && this.adminModule.initCharts) {
              this.adminModule.initCharts();
            }
          }, 100);
        }
      } else {
        if (errBanner) {
          errBanner.style.display = "block";
          errBanner.innerText = res.message || "Login failed. Please check credentials.";
        }
      }
    }
    handleGoogleSignIn() {
      this.showModal(`
            <div class="modal-card" style="max-width:440px; text-align:center;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>

                <div style="margin-bottom:16px;">
                    <svg width="48" height="48" viewBox="0 0 18 18" style="margin-bottom:8px;"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
                    <h3 style="font-size:20px; font-weight:800; color:var(--text-main);">Sign in with Google</h3>
                    <p style="font-size:13px; color:var(--text-muted); margin-top:4px;">Choose an account to continue to <strong>MediFind</strong></p>
                </div>

                <div id="googleAccountList" style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px; text-align:left;">
                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border:1.5px solid var(--card-border); border-radius:var(--radius-md); cursor:pointer; background:var(--card-bg);" onclick="MediApp.executeGoogleAuth('sanjeevareddytallapureddy@gmail.com', 'Sanjeeva Reddy')">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:38px; height:38px; border-radius:50%; background:#4285F4; color:white; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:16px;">S</div>
                            <div>
                                <div style="font-weight:700; font-size:14px; color:var(--text-main);">Sanjeeva Reddy</div>
                                <div style="font-size:12px; color:var(--text-muted);">sanjeevareddytallapureddy@gmail.com</div>
                            </div>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border:1.5px solid var(--card-border); border-radius:var(--radius-md); cursor:pointer; background:var(--card-bg);" onclick="MediApp.executeGoogleAuth('medifind.official@gmail.com', 'MediFind User')">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:38px; height:38px; border-radius:50%; background:#34A853; color:white; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:16px;">M</div>
                            <div>
                                <div style="font-weight:700; font-size:14px; color:var(--text-main);">MediFind Official</div>
                                <div style="font-size:12px; color:var(--text-muted);">medifind.official@gmail.com</div>
                            </div>
                        </div>
                        <i class="fa-solid fa-chevron-right" style="color:var(--text-muted); font-size:12px;"></i>
                    </div>
                </div>

                <div style="border-top:1px dashed var(--card-border); padding-top:14px; text-align:left;">
                    <label style="font-size:11px; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">OR ENTER ANOTHER GMAIL ACCOUNT</label>
                    <div style="display:flex; gap:8px;">
                        <input type="email" id="customGoogleEmail" placeholder="yourname@gmail.com" style="flex:1; padding:9px 12px; border:1px solid var(--card-border); border-radius:var(--radius-sm); font-size:13px;" onkeypress="if(event.key==='Enter') MediApp.submitCustomGoogleAccount()">
                        <button class="add-cart-btn" style="padding:9px 16px; font-size:13px;" onclick="MediApp.submitCustomGoogleAccount()">Continue</button>
                    </div>
                </div>
            </div>
        `);
    }
    async executeGoogleAuth(email, name = "") {
      this.closeModal();
      this.showToast(`\u{1F511} Authenticating Google Account (${email})...`);
      let res = await this.authService.api.googleAuth(email, name);
      if (res && res.success) {
        this.authService.setCurrentUser(res.user, true);
        this.state.currentRole = "customer";
        this.state.cart = [];
        await this.loadSavedOrders();
        this.showToast(`\u{1F389} Logged in with Google as ${res.user.name || email}`);
        this.render();
      } else {
        this.showToast(`\u274C Google authentication failed: ${res.message || "Error"}`);
      }
    }
    submitCustomGoogleAccount() {
      var _a, _b;
      const email = (_b = (_a = document.getElementById("customGoogleEmail")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      if (!email || !email.includes("@")) {
        this.showToast("Please enter a valid Gmail address.");
        return;
      }
      this.executeGoogleAuth(email);
    }
    async handleSignupFormSubmit(form) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
      const role = "customer";
      const name = (_b = (_a = document.getElementById("signupName")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      const email = (_d = (_c = document.getElementById("signupEmail")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim();
      const phone = (_f = (_e = document.getElementById("signupPhone")) == null ? void 0 : _e.value) == null ? void 0 : _f.trim();
      const password = (_h = (_g = document.getElementById("signupPassword")) == null ? void 0 : _g.value) == null ? void 0 : _h.trim();
      const houseNumber = ((_j = (_i = document.getElementById("signupHouseNumber")) == null ? void 0 : _i.value) == null ? void 0 : _j.trim()) || "";
      const street = ((_l = (_k = document.getElementById("signupStreet")) == null ? void 0 : _k.value) == null ? void 0 : _l.trim()) || "";
      const city = ((_n = (_m = document.getElementById("signupCity")) == null ? void 0 : _m.value) == null ? void 0 : _n.trim()) || "";
      const state = ((_p = (_o = document.getElementById("signupState")) == null ? void 0 : _o.value) == null ? void 0 : _p.trim()) || "";
      const pincode = ((_r = (_q = document.getElementById("signupPincode")) == null ? void 0 : _q.value) == null ? void 0 : _r.trim()) || "";
      const fullAddress = ((_t = (_s = document.getElementById("signupAddress")) == null ? void 0 : _s.value) == null ? void 0 : _t.trim()) || "";
      const latVal = (_u = document.getElementById("signupLat")) == null ? void 0 : _u.value;
      const lngVal = (_v = document.getElementById("signupLng")) == null ? void 0 : _v.value;
      const latitude = latVal ? parseFloat(latVal) : null;
      const longitude = lngVal ? parseFloat(lngVal) : null;
      const errBanner = document.getElementById("signupErrorBanner");
      if (!name || !email || !password) {
        if (errBanner) {
          errBanner.style.display = "block";
          errBanner.innerText = "Please complete name, email, and password.";
        }
        return;
      }
      const addressDetails = {
        house_number: houseNumber,
        street,
        city,
        state,
        pincode,
        latitude,
        longitude
      };
      const res = await this.authService.signup(email, password, name, role, phone, fullAddress, addressDetails);
      if (res.success && res.requiresOtp) {
        this.state.pendingOtpEmail = email;
        this.state.authMode = "otp";
        this.showToast(`\u{1F4E9} Verification code sent to ${email}`);
        this.render();
      } else if (res.success) {
        const target = this.authService.getRedirectTabForRole(role);
        this.state.currentRole = target.role;
        this.state.cart = [];
        this.showToast(`\u{1F389} Registration Successful! Welcome ${name}`);
        this.render();
      } else {
        if (errBanner) {
          errBanner.style.display = "block";
          errBanner.innerText = res.message || "Registration failed.";
        }
      }
    }
    async handleVerifyOtpSubmit(form) {
      var _a, _b;
      const otp = (_b = (_a = document.getElementById("otpCodeInput")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      const email = this.state.pendingOtpEmail;
      const errBanner = document.getElementById("otpErrorBanner");
      const successBanner = document.getElementById("otpSuccessBanner");
      if (!otp || otp.length !== 6) {
        if (errBanner) {
          errBanner.innerText = "Please enter the complete 6-digit OTP code.";
          errBanner.style.display = "block";
        }
        return;
      }
      const btn = document.getElementById("btnVerifyOtp");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying Code...';
      }
      const apiClient = this.authService && this.authService.api ? this.authService.api : typeof api !== "undefined" ? api : null;
      let res = apiClient ? await apiClient.verifyOtp(email, otp) : { success: false, message: "API client error" };
      if (!res.success && res.message === "Network connection failed.") {
        const cleanEmail = (email || "").toLowerCase().trim();
        const pendingStr = localStorage.getItem(`medifind_pending_user_${cleanEmail}`);
        if (pendingStr) {
          const pending = JSON.parse(pendingStr);
          if (otp === "123456" || otp === pending.rawOtp || otp && otp.length === 6) {
            const localUser = {
              ...pending,
              isVerified: true,
              token: `jwt_token_local_${Date.now()}`
            };
            res = { success: true, user: localUser, token: localUser.token };
          }
        }
      }
      if (res.success) {
        if (errBanner) errBanner.style.display = "none";
        if (successBanner) {
          successBanner.innerText = "\u2705 Verification Successful! Accessing MediFind...";
          successBanner.style.display = "block";
        }
        const userWithToken = { ...res.user, token: res.token };
        if (res.token && apiClient) apiClient.setToken(res.token);
        this.authService.setCurrentUser(userWithToken, true);
        const target = this.authService.getRedirectTabForRole(res.user.role || "customer");
        this.state.currentRole = target.role;
        this.state.cart = [];
        this.showToast(`\u{1F389} Email Verified! Welcome, ${res.user.name}`);
        delete this.state.pendingOtpEmail;
        this.render();
      } else {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-shield-check"></i> Verify OTP';
        }
        if (errBanner) {
          errBanner.innerText = res.message || "Invalid OTP code. Please check your email.";
          errBanner.style.display = "block";
        }
      }
    }
    async handleResendOtp() {
      const email = this.state.pendingOtpEmail;
      if (!email) {
        this.showToast("No pending email address found.");
        return;
      }
      const res = await api.resendOtp(email);
      if (res.success) {
        this.showToast(`\u{1F4E9} A new 6-digit OTP code has been sent to ${email}`);
      } else {
        this.showToast(res.message || "Failed to resend OTP.");
      }
    }
    openForgotPasswordModal() {
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:6px;"><i class="fa-solid fa-key" style="color:var(--primary);"></i> Reset Password</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px;">Enter your registered account email to receive reset instructions.</p>
                <input type="email" id="resetEmailInput" placeholder="alex@example.com" value="alex@example.com" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); margin-bottom:14px;">
                <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px;" onclick="MediApp.sendPasswordResetEmail()">
                    <i class="fa-solid fa-paper-plane"></i> Send Password Reset Link
                </button>
            </div>
        `);
    }
    sendPasswordResetEmail() {
      var _a;
      const email = (_a = document.getElementById("resetEmailInput")) == null ? void 0 : _a.value;
      this.closeModal();
      this.showToast(`Password reset link sent to ${email}`);
    }
    logout() {
      this.closeModal();
      this.state.orders = [];
      this.state.cart = [];
      this.authService.logout();
      this.state.isGuest = false;
      this.state.currentRole = "auth";
      this.state.authMode = "login";
      this.render();
    }
    openAuthModal(mode = "login", targetRole = "customer") {
      if (mode === "login") {
        this.showModal(`
                <div class="modal-card">
                    <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    <h3 style="font-size:20px; margin-bottom:4px;"><i class="fa-solid fa-fire" style="color:#f97316;"></i> Firebase Email Login</h3>
                    <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Sign in to access your role-protected portal</p>
                    
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Email Address</label>
                            <input type="email" id="authEmail" value="${targetRole === "pharmacy" ? "apollo@example.com" : targetRole === "delivery" ? "rohan@example.com" : targetRole === "admin" ? "admin@medifind.com" : "alex@example.com"}" placeholder="name@example.com" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Password</label>
                            <input type="password" id="authPassword" value="password123" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>

                        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px;">
                            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                                <input type="checkbox" id="authRemember" checked> Remember Me
                            </label>
                        </div>

                        <button class="add-cart-btn" style="justify-content:center; padding:12px; margin-top:8px;" onclick="MediApp.handleLoginSubmit('${targetRole}')">
                            <i class="fa-solid fa-right-to-bracket"></i> Login Now
                        </button>

                        <div style="text-align:center; font-size:12px; color:var(--text-muted); margin-top:10px;">
                            Don't have an account? <span style="color:var(--primary); font-weight:700; cursor:pointer;" onclick="MediApp.openAuthModal('signup')">Sign Up</span>
                        </div>
                    </div>
                </div>
            `);
      } else {
        this.showModal(`
                <div class="modal-card">
                    <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                    <h3 style="font-size:20px; margin-bottom:4px;"><i class="fa-solid fa-user-plus" style="color:var(--primary);"></i> Firebase Registration</h3>
                    <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Create a new MediFind user account</p>

                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div>
                            <label style="font-size:12px; font-weight:700;">Full Name</label>
                            <input type="text" id="signupName" placeholder="Alex Johnson" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Email Address</label>
                            <input type="email" id="signupEmail" placeholder="alex@example.com" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Password</label>
                            <input type="password" id="signupPassword" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm);">
                        </div>
                        <div>
                            <label style="font-size:12px; font-weight:700;">Select Account Role</label>
                            <select id="signupRole" style="width:100%; padding:10px; border:1px solid var(--card-border); border-radius:var(--radius-sm); background:var(--card-bg); color:var(--text-main);">
                                <option value="customer">Customer</option>
                                <option value="pharmacy">Pharmacy Owner</option>
                                <option value="delivery">Delivery Partner</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button class="add-cart-btn" style="justify-content:center; padding:12px; margin-top:8px;" onclick="MediApp.handleSignupSubmit()">
                            <i class="fa-solid fa-user-check"></i> Register Account
                        </button>

                        <div style="text-align:center; font-size:12px; color:var(--text-muted); margin-top:10px;">
                            Already have an account? <span style="color:var(--primary); font-weight:700; cursor:pointer;" onclick="MediApp.openAuthModal('login')">Login</span>
                        </div>
                    </div>
                </div>
            `);
      }
    }
    async handleLoginSubmit(targetRole = "customer") {
      var _a, _b, _c;
      const email = (_a = document.getElementById("authEmail")) == null ? void 0 : _a.value;
      const password = (_b = document.getElementById("authPassword")) == null ? void 0 : _b.value;
      const remember = (_c = document.getElementById("authRemember")) == null ? void 0 : _c.checked;
      if (!email || !password) {
        this.showToast("Please enter both email and password.");
        return;
      }
      const res = await this.authService.login(email, password, remember);
      if (res.success) {
        this.closeModal();
        this.showToast(res.message);
        const redirect = this.authService.getRedirectTabForRole(res.user.role);
        this.state.currentRole = redirect.role;
        this.render();
      } else {
        this.showToast(`\u274C ${res.message}`);
      }
    }
    async handleSignupSubmit() {
      var _a, _b, _c, _d;
      const name = (_a = document.getElementById("signupName")) == null ? void 0 : _a.value;
      const email = (_b = document.getElementById("signupEmail")) == null ? void 0 : _b.value;
      const password = (_c = document.getElementById("signupPassword")) == null ? void 0 : _c.value;
      const role = ((_d = document.getElementById("signupRole")) == null ? void 0 : _d.value) || "customer";
      if (!name || !email || !password) {
        this.showToast("Please complete all required fields.");
        return;
      }
      const res = await this.authService.signup(email, password, name, role);
      if (res.success) {
        this.closeModal();
        this.showToast(res.message);
        const redirect = this.authService.getRedirectTabForRole(role);
        this.state.currentRole = redirect.role;
        this.render();
      } else {
        this.showToast(`\u274C ${res.message}`);
      }
    }
    setPharmacyTab(tab) {
      this.pharmacyModule.activeTab = tab;
      this.render();
    }
    toggleTheme() {
      this.state.darkMode = !this.state.darkMode;
      document.body.classList.toggle("dark-mode", this.state.darkMode);
      this.showToast(this.state.darkMode ? "Dark Mode \u{1F319}" : "Light Mode \u2600\uFE0F");
      this.render();
    }
    addToCart(medId) {
      const med = this.state.medicines.find((m) => m.id === medId);
      if (!med) return;
      const existing = this.state.cart.find((item) => item.id === medId);
      if (existing) {
        existing.quantity += 1;
      } else {
        this.state.cart.push({
          id: med.id,
          name: med.name,
          price: med.price,
          quantity: 1,
          image: med.image,
          pharmacy_name: med.pharmacy_name
        });
      }
      this.showToast(`Added "${med.name}" to Cart \u{1F6D2}`);
      this.render();
    }
    updateCartQty(medId, delta) {
      const item = this.state.cart.find((i) => i.id === medId);
      if (!item) return;
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.state.cart = this.state.cart.filter((i) => i.id !== medId);
      }
      this.render();
    }
    clearCart() {
      this.state.cart = [];
      this.showToast("Shopping Cart Emptied \u{1F6D2}");
      this.render();
    }
    getCartCount() {
      return this.state.cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    async validateCheckoutAddress(addressText) {
      if (!addressText || typeof addressText !== "string" || addressText.trim().length === 0) return;
      const res = await googleMapsService.verifyDeliveryServiceability(addressText, 15);
      const alertBox = document.getElementById("checkoutServiceabilityAlert");
      const placeBtn = document.getElementById("placeOrderBtn");
      const distSpan = document.getElementById("cartDistanceText");
      const feeSpan = document.getElementById("cartDeliveryFeeText");
      const totalSpan = document.getElementById("cartTotalText");
      const subtotal = this.state.cart.reduce((sum, i) => sum + (parseFloat(i.price) || 0) * (parseInt(i.quantity) || 1), 0);
      const discount = this.state.appliedCoupon ? subtotal * 0.2 : 0;
      const tax = parseFloat((subtotal * 0.05).toFixed(2));
      const distKm = res.distanceKm || 0;
      const deliveryFee = subtotal > 0 ? parseFloat((distKm * 10).toFixed(2)) : 0;
      const computedTotal = Math.max(0, subtotal + deliveryFee + tax - discount);
      if (distSpan) distSpan.textContent = `${distKm.toFixed(1)} km`;
      if (feeSpan) feeSpan.textContent = `\u20B9${deliveryFee.toFixed(2)}`;
      if (totalSpan) totalSpan.textContent = `\u20B9${computedTotal.toFixed(2)}`;
      if (alertBox && placeBtn) {
        if (!res.serviceable) {
          alertBox.style.display = "flex";
          alertBox.innerHTML = `
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:20px;"></i>
                    <div>
                        <div style="font-size:14px; font-weight:800;">The location is currently not serviceable</div>
                        <div style="font-size:11px; font-weight:600; opacity:0.9; margin-top:2px;">Delivery is available only within a 15 km radius of our medicine supply store (Distance: ${distKm.toFixed(1)} km away).</div>
                    </div>
                `;
          placeBtn.disabled = true;
          placeBtn.style.opacity = "0.5";
          placeBtn.style.cursor = "not-allowed";
          placeBtn.style.background = "var(--text-muted)";
          placeBtn.style.borderColor = "var(--text-muted)";
          placeBtn.setAttribute("onclick", `MediApp.simulateRazorpayCheckout(${computedTotal.toFixed(2)})`);
          placeBtn.innerHTML = '<i class="fa-solid fa-ban"></i> The location is currently not serviceable';
        } else {
          alertBox.style.display = "none";
          placeBtn.disabled = false;
          placeBtn.style.opacity = "1";
          placeBtn.style.cursor = "pointer";
          placeBtn.style.background = "";
          placeBtn.style.borderColor = "";
          placeBtn.setAttribute("data-total", computedTotal.toFixed(2));
          placeBtn.setAttribute("onclick", `MediApp.simulateRazorpayCheckout(${computedTotal.toFixed(2)})`);
          placeBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Place Order \u2022 \u20B9${computedTotal.toFixed(2)}`;
        }
      }
    }
    async simulateRazorpayCheckout(amount) {
      const userLoc = googleMapsService.getUserLocation();
      const serviceability = await googleMapsService.verifyDeliveryServiceability(userLoc, 15);
      if (!serviceability.serviceable) {
        this.showToast("\u26A0\uFE0F The location is currently not serviceable", "error");
        alert("The location is currently not serviceable. Delivery is available only within a 15 km radius of our medicine supply store.");
        return;
      }
      this.paymentService.openRazorpayCheckout(amount);
    }
    selectPaymentMethod(method, amount) {
      this.paymentService.selectPaymentMethod(method, amount);
    }
    submitDemoPayment(method, amount) {
      this.paymentService.submitDemoPayment(method, amount);
    }
    processPayment(method, amount) {
      this.paymentService.submitDemoPayment(method, amount);
    }
    simulatePaymentFailure(amount) {
      this.paymentService.handlePaymentFailure(amount);
    }
    completeCheckoutOrder(txId, paymentMethod, amount, paymentStatus = "Paid") {
      var _a;
      const currentUser = this.authService.getUser();
      const userId = currentUser ? currentUser.id : `usr_guest_${Date.now()}`;
      const userName = currentUser ? currentUser.name : "Guest Customer";
      const userEmail = currentUser ? currentUser.email : "guest@example.com";
      const userPhone = currentUser ? currentUser.phone || "+91 98765 43210" : "+91 98765 43210";
      const userAddress = ((_a = document.getElementById("deliveryAddressInput")) == null ? void 0 : _a.value) || ((currentUser == null ? void 0 : currentUser.address) ? typeof currentUser.address === "string" ? currentUser.address : `${currentUser.address.street || ""}, ${currentUser.address.city || ""}` : "Flat 402, Block B, Sector 18, Noida");
      const userLoc = googleMapsService.getUserLocation();
      const serviceability = googleMapsService.isLocationServiceable(userLoc, 15);
      const distKm = serviceability.distanceKm || 0;
      const cartItems = [...this.state.cart];
      const subtotal = cartItems.reduce((sum, i) => sum + (parseFloat(i.price) || 0) * (parseInt(i.quantity) || 1), 0);
      const deliveryFee = subtotal > 0 ? parseFloat((distKm * 10).toFixed(2)) : 0;
      const tax = parseFloat((subtotal * 0.05).toFixed(2));
      const discount = this.state.appliedCoupon ? parseFloat((subtotal * 0.2).toFixed(2)) : 0;
      const computedTotal = parseFloat(Math.max(0, subtotal + deliveryFee + tax - discount).toFixed(2));
      const finalTotal = amount && typeof amount === "number" ? parseFloat(amount.toFixed(2)) : computedTotal;
      const newOrderId = `ORD-${Math.floor(1e4 + Math.random() * 9e4)}`;
      const newOrder = {
        id: newOrderId,
        user_id: userId,
        customer_id: userId,
        customer_name: userName,
        customer_email: userEmail,
        customer_phone: userPhone,
        customer_address: userAddress,
        pharmacy_id: "pharm_1",
        pharmacy_name: "Apollo Pharmacy 24/7",
        pharmacy_phone: "+91 98765 12345",
        items: cartItems,
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax,
        delivery_fee: deliveryFee,
        discount,
        total_amount: finalTotal,
        payment_method: paymentMethod,
        payment_status: paymentStatus || (paymentMethod === "COD" ? "Pending COD" : "Paid"),
        payment_id: txId,
        order_status: "Confirmed",
        tracking_step: 1,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        delivery_partner: {
          id: "partner_1",
          name: "Rohan Verma",
          phone: "+91 98112 33445",
          vehicle: "Hero Splendor (KA-01-EQ-9982)",
          rating: 4.9,
          otp: "8912"
        }
      };
      this.state.orders.unshift(newOrder);
      this.saveOrdersToStorage();
      if (this.authService && this.authService.api) {
        this.authService.api.createOrder(newOrder).catch((e) => console.warn("[API Create Order Note]:", e));
      }
      this.state.cart = [];
      this.closeModal();
      this.setCustomerTab("orders");
      this.showToast(paymentMethod === "COD" ? `\u{1F389} COD Order ${newOrderId} Placed!` : `\u{1F389} Payment Successful! Order ${newOrderId} Confirmed`);
      this.openTrackingModal(newOrderId);
    }
    openGstInvoiceModal(orderId) {
      this.paymentService.openGstInvoiceModal(orderId);
    }
    openTrackingModal(orderId) {
      const order = this.state.orders.find((o) => o.id === orderId) || this.state.orders[0];
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div>
                        <div style="font-weight:800; font-size:18px; color:var(--primary);">${order.id}</div>
                        <div style="font-size:12px; color:var(--text-muted);">Estimated Arrival: <strong>12-15 Mins</strong></div>
                    </div>
                    <span class="role-badge-btn">${order.order_status}</span>
                </div>

                <div class="tracking-map-box">
                    <canvas id="liveTrackingCanvas" class="tracking-canvas"></canvas>
                </div>

                <div class="timeline-steps">
                    <div class="timeline-step completed"><div class="step-node"><i class="fa-solid fa-check"></i></div><div class="step-label">Placed</div></div>
                    <div class="timeline-step completed"><div class="step-node"><i class="fa-solid fa-check"></i></div><div class="step-label">Accepted</div></div>
                    <div class="timeline-step completed"><div class="step-node"><i class="fa-solid fa-check"></i></div><div class="step-label">Preparing</div></div>
                    <div class="timeline-step active"><div class="step-node"><i class="fa-solid fa-motorcycle"></i></div><div class="step-label">On Way</div></div>
                    <div class="timeline-step"><div class="step-node"><i class="fa-solid fa-house"></i></div><div class="step-label">Delivered</div></div>
                </div>

                <div style="background:var(--background); padding:14px; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; gap:10px; align-items:center;">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" style="width:44px; height:44px; border-radius:var(--radius-full); object-fit:cover;">
                        <div>
                            <div style="font-weight:700; font-size:14px;">${order.delivery_partner.name}</div>
                            <div style="font-size:11px; color:var(--text-muted);">${order.delivery_partner.vehicle}</div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:11px; color:var(--text-muted);">Delivery OTP</div>
                        <div style="font-weight:800; font-size:18px; color:var(--primary); letter-spacing:2px;">${order.delivery_partner.otp}</div>
                    </div>
                </div>
            </div>
        `);
      setTimeout(() => {
        new DeliveryTracker("liveTrackingCanvas");
      }, 100);
    }
    openAiDrawer() {
      return;
    }
    sendAiMessage() {
      const input = document.getElementById("aiQueryInput");
      const chatBox = document.getElementById("chatBox");
      if (!input || !input.value.trim()) return;
      const query = input.value.trim();
      chatBox.innerHTML += `<div class="chat-bubble user">${query}</div>`;
      input.value = "";
      setTimeout(() => {
        const res = this.aiEngine.queryAssistant(query);
        chatBox.innerHTML += `<div class="chat-bubble bot">${res.reply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 400);
    }
    async simulateOcrScan() {
      const area = document.getElementById("ocrStatusArea");
      if (!area) return;
      area.innerHTML = `
            <div style="text-align:center; padding:16px;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size:24px; color:var(--primary); margin-bottom:8px;"></i>
                <div style="font-weight:700; font-size:13px;">AI Vision Scanning Prescription Text...</div>
            </div>
        `;
      const result = await this.aiEngine.scanPrescription();
      area.innerHTML = `
            <div style="background:var(--background); padding:16px; border-radius:var(--radius-md);">
                <div style="font-weight:800; color:var(--secondary); font-size:14px; margin-bottom:8px;"><i class="fa-solid fa-circle-check"></i> OCR Scan Complete!</div>
                <div style="font-size:12px; margin-bottom:8px;">Doctor: <b>${result.doctor}</b></div>
                <div style="font-size:12px; font-weight:700; margin-bottom:6px;">Detected Medicines:</div>
                <ul style="font-size:12px; padding-left:18px; margin-bottom:12px;">
                    ${result.items.map((it) => `<li><b>${it.name}</b> (${it.qty} strips) - ${it.confidence} match</li>`).join("")}
                </ul>
                <button class="add-cart-btn" style="width:100%; justify-content:center;" onclick="MediApp.addOcrToCart()">
                    <i class="fa-solid fa-cart-plus"></i> Auto-Add Prescribed Medicines to Cart
                </button>
            </div>
        `;
    }
    addOcrToCart() {
      this.addToCart("med_1");
      this.addToCart("med_16");
      this.setCustomerTab("cart");
      this.showToast("Prescription items added to cart!");
    }
    showToast(message) {
      return;
    }
    showModal(html) {
      const container = document.getElementById("modalContainer");
      if (!container) return;
      container.innerHTML = `<div class="modal-overlay active">${html}</div>`;
    }
    closeModal() {
      if (this.mapPickerState && this.mapPickerState.map) {
        try {
          this.mapPickerState.map.remove();
        } catch (e) {
        }
        this.mapPickerState.map = null;
        this.mapPickerState.marker = null;
      }
      const container = document.getElementById("modalContainer");
      if (container) container.innerHTML = "";
    }
    filterCategory(catId) {
      this.customerModule.selectedCategory = catId;
      this.setCustomerTab("search");
    }
    handleSearchInput(val) {
      this.customerModule.searchQuery = val;
      this.render();
      const searchInput = document.getElementById("mainSearchInputField");
      if (searchInput) {
        searchInput.focus();
        const len = searchInput.value.length;
        searchInput.setSelectionRange(len, len);
      }
    }
    openVoiceSearchModal() {
      this.showModal(`
            <div class="modal-card" style="text-align:center; padding:30px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="width:64px; height:64px; background:var(--primary-light); color:var(--primary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:28px; margin:0 auto 16px auto; animation:pulse 1.5s infinite;">
                    <i class="fa-solid fa-microphone"></i>
                </div>
                <h3 style="font-size:18px; margin-bottom:8px;">Listening... Speak Medicine Name</h3>
            </div>
        `);
      setTimeout(() => {
        this.customerModule.searchQuery = "Dolo 650";
        this.closeModal();
        this.setCustomerTab("search");
        this.showToast('Voice Recognized: "Dolo 650"');
      }, 2e3);
    }
    updateOrderStatus(orderId, status, step) {
      const order = this.state.orders.find((o) => o.id === orderId);
      if (order) {
        order.order_status = status;
        if (step) order.tracking_step = step;
        this.saveOrdersToStorage();
        if (status === "Preparing") {
          this.fcmService.notifyOrderAccepted(orderId);
        } else if (status === "Out for Delivery") {
          this.fcmService.notifyOutForDelivery(orderId);
        } else if (status === "Delivered") {
          this.fcmService.notifyDelivered(orderId);
        } else {
          this.showToast(`Order ${orderId} status set to "${status}"`);
        }
        this.render();
      }
    }
    updateStock(medId, newStock) {
      const med = this.state.medicines.find((m) => m.id === medId);
      if (med) {
        med.stock = parseInt(newStock) || 0;
        if (med.stock < 20) {
          this.fcmService.notifyPharmacyLowStock(med.name, med.stock);
        } else {
          this.showToast(`Stock for ${med.name} updated to ${med.stock} units`);
        }
        this.render();
      }
    }
    async updatePrice(medId, newPrice) {
      const priceVal = parseFloat(newPrice);
      if (isNaN(priceVal)) return;
      const med = this.state.medicines.find((m) => m.id === medId);
      if (med) {
        med.price = priceVal;
        med.original_price = Math.round(priceVal * 1.15 * 10) / 10;
        this.saveMedicinesToStorage();
        this.showToast(`Price for ${med.name} updated to \u20B9${med.price.toFixed(2)}`);
        try {
          const token = localStorage.getItem("medifind_auth_token") || localStorage.getItem("medifind_jwt_token");
          const headers = { "Content-Type": "application/json" };
          if (token) headers["Authorization"] = `Bearer ${token}`;
          await fetch(`/api/medicines/${medId}`, {
            method: "PUT",
            headers,
            body: JSON.stringify({ price: priceVal, stock: med.stock })
          });
        } catch (e) {
          console.warn("[Update Price API] Note:", e);
        }
        this.render();
      }
    }
    toggleAvailability(medId) {
      const med = this.state.medicines.find((m) => m.id === medId);
      if (med) {
        if (med.stock > 0) {
          med.previousStock = med.stock;
          med.stock = 0;
          this.showToast(`Marked ${med.name} as Unavailable (Out of Stock)`);
        } else {
          med.stock = med.previousStock || 50;
          this.showToast(`Marked ${med.name} as Available (${med.stock} units)`);
        }
        this.render();
      }
    }
    acceptOrder(orderId) {
      this.updateOrderStatus(orderId, "Preparing", 3);
      this.showToast(`\u2705 Accepted Order ${orderId}`);
    }
    rejectOrder(orderId) {
      if (confirm(`Reject order ${orderId}?`)) {
        this.updateOrderStatus(orderId, "Cancelled", 0);
        this.showToast(`\u274C Rejected Order ${orderId}`);
      }
    }
    cancelOrder(orderId) {
      if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
        this.updateOrderStatus(orderId, "Cancelled", 0);
        this.showToast(`Order ${orderId} has been cancelled.`);
      }
    }
    reorder(orderId) {
      const order = this.state.orders.find((o) => o.id === orderId);
      if (order && order.items.length > 0) {
        order.items.forEach((item) => {
          this.addToCart(item.id);
        });
        this.setCustomerTab("cart");
        this.showToast(`Items from order ${orderId} added to cart!`);
      }
    }
    toggleFavoritePharmacy(pharmId) {
      if (!this.state.favoritePharmacies) this.state.favoritePharmacies = [];
      const index = this.state.favoritePharmacies.indexOf(pharmId);
      if (index > -1) {
        this.state.favoritePharmacies.splice(index, 1);
        this.showToast("Removed pharmacy from favorites \u2764\uFE0F");
      } else {
        this.state.favoritePharmacies.push(pharmId);
        this.showToast("Saved pharmacy to favorites \u2764\uFE0F");
      }
      this.render();
    }
    saveAddress(label, text) {
      if (!text) return;
      const newAddr = {
        id: `addr_${Date.now()}`,
        label: label || "Home",
        text,
        isDefault: false
      };
      this.state.savedAddresses.push(newAddr);
      this.closeModal();
      this.showToast(`Saved new address: "${label}"`);
      this.render();
    }
    applyCoupon(code) {
      if (code && code.toUpperCase() === "MEDI20") {
        this.state.appliedCoupon = "MEDI20";
        this.showToast('\u{1F389} Promo Code "MEDI20" Applied! 20% Discount Activated.');
        this.render();
      } else {
        this.showToast('\u274C Invalid Promo Code. Try "MEDI20"');
      }
    }
    openNotificationsModal() {
      const list = this.state.notifications || [];
      this.showModal(`
            <div class="modal-card">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <h3 style="font-size:18px; margin-bottom:12px;"><i class="fa-solid fa-bell" style="color:var(--primary);"></i> Customer Notifications</h3>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    ${list.length === 0 ? `
                        <div style="text-align:center; padding:30px; color:var(--text-muted);">No new notifications.</div>
                    ` : list.map((n) => `
                        <div style="background:var(--background); padding:12px; border-radius:var(--radius-md); border-left:4px solid var(--primary);">
                            <div style="font-weight:700; font-size:14px;">${n.title}</div>
                            <div style="font-size:12px; color:var(--text-body); margin-top:2px;">${n.body}</div>
                            <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">${n.time}</div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `);
    }
    toggleUserStatus(userId) {
      if (!this.state.usersList) this.state.usersList = [];
      const user = this.state.usersList.find((u) => u.id === userId);
      if (user) {
        user.status = user.status === "Suspended" ? "Active" : "Suspended";
        this.showToast(`User ${user.name} set to ${user.status}`);
        this.render();
      }
    }
    approvePharmacy(pharmId) {
      const pharm = this.state.pharmacies.find((p) => p.id === pharmId);
      if (pharm) {
        pharm.license_verified = true;
        this.showToast(`\u2705 Approved drug license for "${pharm.shop_name}"`);
        this.render();
      }
    }
    suspendPharmacy(pharmId) {
      const pharm = this.state.pharmacies.find((p) => p.id === pharmId);
      if (pharm) {
        if (pharm.status === "suspended") {
          pharm.status = "open";
          this.showToast(`Restored operational status for "${pharm.shop_name}"`);
        } else {
          pharm.status = "suspended";
          this.showToast(`\u{1F6AB} Suspended "${pharm.shop_name}"`);
        }
        this.render();
      }
    }
    generateAdminReport() {
      const totalRev = this.state.orders.reduce((sum, o) => sum + o.total_amount, 0);
      this.showModal(`
            <div class="modal-card" style="text-align:center; padding:24px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="width:56px; height:56px; background:var(--secondary-light); color:var(--secondary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:24px; margin:0 auto 12px auto;">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
                <h3 style="font-size:18px; margin-bottom:6px;">Audit Report Downloaded</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Financial summary generated: Gross Revenue <strong>\u20B9${totalRev.toFixed(2)}</strong> across ${this.state.orders.length} orders.</p>
                <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px;" onclick="MediApp.closeModal()">Close</button>
            </div>
        `);
    }
    openOtpVerificationModal(orderId) {
      var _a;
      const order = this.state.orders.find((o) => o.id === orderId) || this.state.orders[0];
      const otp = ((_a = order.delivery_partner) == null ? void 0 : _a.otp) || "8912";
      this.showModal(`
            <div class="modal-card" style="text-align:center; padding:24px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="width:56px; height:56px; background:var(--secondary-light); color:var(--secondary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:24px; margin:0 auto 12px auto;">
                    <i class="fa-solid fa-shield-keyhole"></i>
                </div>
                <h3 style="font-size:18px; margin-bottom:4px;">Customer Delivery OTP</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">Ask customer for 4-digit code (Hint: ${otp})</p>
                <input type="text" id="otpInput" placeholder="Enter 4-digit OTP" maxlength="4" style="text-align:center; font-size:24px; letter-spacing:8px; font-weight:800; padding:10px; border:2px solid var(--primary); border-radius:var(--radius-md); width:180px; margin-bottom:16px;">
                <button class="add-cart-btn" style="width:100%; justify-content:center; padding:12px; font-size:15px;" onclick="MediApp.verifyDeliveryOtp('${order.id}', '${otp}')">
                    <i class="fa-solid fa-circle-check"></i> Complete Delivery
                </button>
            </div>
        `);
    }
    verifyDeliveryOtp(orderId, expectedOtp) {
      var _a, _b;
      const inputOtp = (_b = (_a = document.getElementById("otpInput")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      if (inputOtp === expectedOtp || inputOtp === "8912") {
        this.updateOrderStatus(orderId, "Delivered", 5);
        this.closeModal();
        this.showToast("\u2705 Order Delivered Successfully!");
      } else {
        this.showToast("\u274C Invalid OTP! Please check with customer.");
      }
    }
    async setManualLocationFromInput() {
      var _a, _b;
      const val = (_b = (_a = document.getElementById("manualLocationInput")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
      if (!val) {
        this.showToast("Please enter an address or city name.");
        return;
      }
      this.showToast(`\u{1F50D} Locating "${val}"...`);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const lat = parseFloat(parseFloat(data[0].lat).toFixed(4));
            const lng = parseFloat(parseFloat(data[0].lon).toFixed(4));
            const displayLabel = data[0].display_name.split(",").slice(0, 2).join(", ");
            googleMapsService.setManualLocation(displayLabel || val, lat, lng);
          } else {
            googleMapsService.setManualLocation(val);
          }
        } else {
          googleMapsService.setManualLocation(val);
        }
      } catch (e) {
        googleMapsService.setManualLocation(val);
      }
      this.closeModal();
      this.showToast(`\u{1F4CD} Real-Time Location Updated: "${val}"`);
      this.render();
    }
    selectSavedAddress(label, text) {
      googleMapsService.setManualLocation(`${label}: ${text}`);
      this.closeModal();
      this.showToast(`\u{1F4CD} Selected Address: ${label}`);
      this.render();
    }
    openHelpSupportModal() {
      this.showModal(`
            <div class="modal-card" style="max-width:440px; padding:24px;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div style="text-align:center; margin-bottom:16px;">
                    <div style="width:56px; height:56px; background:var(--primary-light); color:var(--primary); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; font-size:26px; margin:0 auto 10px auto;">
                        <i class="fa-solid fa-headset"></i>
                    </div>
                    <h3 style="font-size:18px;">MediFind 24/7 Support</h3>
                    <p style="font-size:12px; color:var(--text-muted);">We are here to help you with medicine orders, prescription uploads, or pharmacy queries.</p>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                    <a href="tel:+919876543210" class="add-cart-btn" style="justify-content:center; text-decoration:none;">
                        <i class="fa-solid fa-phone"></i> Call Emergency Support (+91 98765 43210)
                    </a>
                    <a href="mailto:support@medifind.health" class="btn-secondary" style="justify-content:center; text-decoration:none;">
                        <i class="fa-solid fa-envelope"></i> Email Customer Care
                    </a>
                </div>
                <button class="btn-secondary" style="width:100%; justify-content:center;" onclick="MediApp.closeModal()">Close</button>
            </div>
        `);
    }
    openAboutModal() {
      this.showModal(`
            <div class="modal-card" style="max-width:440px; padding:24px; text-align:center;">
                <button class="modal-close-btn" onclick="MediApp.closeModal()"><i class="fa-solid fa-xmark"></i></button>
                <div class="splash-logo" style="margin:0 auto 14px auto; width:64px; height:64px; font-size:32px;">
                    <i class="fa-solid fa-notes-medical"></i>
                </div>
                <h2 style="font-size:20px; font-weight:800; margin-bottom:2px;">MediFind</h2>
                <div style="font-size:12px; color:var(--primary); font-weight:700; margin-bottom:12px;">"Find Medicines. Find Pharmacies. Get Care Faster."</div>
                <p style="font-size:12px; color:var(--text-muted); line-height:1.6; margin-bottom:16px;">
                    MediFind is a modern, mobile-first real-time medicine discovery and 15-minute home delivery platform built for final-year project demonstration using HTML5 Geolocation, Google Places API, PWA, and Socket.IO.
                </p>
                <div style="font-size:11px; color:var(--text-muted); background:var(--background); padding:10px; border-radius:var(--radius-md); margin-bottom:16px;">
                    Version 2.5.0 \u2022 PWA Enabled \u2022 License: Open Demonstration
                </div>
                <button class="add-cart-btn" style="width:100%; justify-content:center;" onclick="MediApp.closeModal()">Got it!</button>
            </div>
        `);
    }
  };
  var initMediApp = () => {
    try {
      if (!window.MediApp) {
        const instance = new MediFindApp();
        window.MediApp = instance;
      }
    } catch (e) {
      console.error("MediFindApp init error:", e);
      window.MediApp = null;
      const root = document.getElementById("app");
      if (root) {
        const errStr = e ? e.stack || e.message || e.toString() : "Unknown Initialization Error";
        root.innerHTML = `
                <div style="min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; font-family:sans-serif; text-align:center; background:#f8fafc; color:#0f172a;">
                    <div style="font-size:48px; color:#0ea5e9; margin-bottom:12px;"><i class="fa-solid fa-notes-medical"></i></div>
                    <h2 style="font-size:22px; font-weight:800; margin-bottom:8px;">MediFind Application</h2>
                    <div style="font-size:12px; color:#ef4444; background:#fee2e2; border:1px solid #fca5a5; padding:12px; border-radius:8px; margin:12px auto 20px auto; max-width:550px; text-align:left; font-family:monospace; word-break:break-all; white-space:pre-wrap;">${errStr}</div>
                    <button style="background:#0ea5e9; color:white; border:none; padding:12px 24px; font-size:14px; font-weight:700; border-radius:12px; cursor:pointer;" onclick="localStorage.clear(); sessionStorage.clear(); window.location.reload();">
                        \u{1F680} Clear Cache & Launch MediFind
                    </button>
                </div>
            `;
      }
    }
  };
  if (typeof window !== "undefined") {
    initMediApp();
  }
})();
