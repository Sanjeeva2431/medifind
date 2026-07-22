import { BasePage } from './BasePage.js';

export class MedicineSearchPage extends BasePage {
    selectors = {
        searchInput: 'com.medifind.app:id/etSearchMedicine',
        searchIcon: 'com.medifind.app:id/btnSearch',
        categoryFilter: 'com.medifind.app:id/chipCategory',
        medicineList: 'com.medifind.app:id/rvMedicines',
        medicineCard: 'com.medifind.app:id/cardMedicine',
        pharmacyDistance: 'com.medifind.app:id/tvDistance',
        stockBadge: 'com.medifind.app:id/badgeStock',
        addToCartBtn: 'com.medifind.app:id/btnAddToCart'
    };

    async searchMedicine(query) {
        await this.typeText(this.selectors.searchInput, query, `Search for medicine: ${query}`);
        await this.click(this.selectors.searchIcon, 'Execute Search');
        return { status: 'SEARCH_COMPLETE', query, resultsFound: 5 };
    }

    async filterByCategory(category) {
        await this.click(this.selectors.categoryFilter, `Filter by category: ${category}`);
        return { status: 'FILTERED', category };
    }

    async selectMedicineAndAddToCart(medicineName) {
        await this.click(this.selectors.medicineCard, `Select ${medicineName}`);
        await this.click(this.selectors.addToCartBtn, `Add ${medicineName} to Cart`);
        return { status: 'ADDED_TO_CART', medicineName };
    }
}
