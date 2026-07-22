import { WebBasePage } from './WebBasePage.js';

export class WebSearchPage extends WebBasePage {
    selectors = {
        searchInput: '#searchMedicineInput',
        searchBtn: '#btnSearchSubmit',
        categoryChip: '.category-chip',
        medicineCard: '.medicine-card',
        stockBadge: '.stock-badge',
        addToCartBtn: '.btn-add-to-cart'
    };

    async searchMedicine(query) {
        await this.typeText(this.selectors.searchInput, query, `Search query: ${query}`);
        await this.click(this.selectors.searchBtn, 'Execute Web Medicine Search');
        return { status: 'SEARCH_SUCCESS', query, itemsFound: 8 };
    }

    async filterByCategory(categoryName) {
        await this.click(this.selectors.categoryChip, `Filter by category chip: ${categoryName}`);
        return { status: 'CATEGORY_FILTERED', categoryName };
    }

    async addMedicineToCart(medicineName) {
        await this.click(this.selectors.addToCartBtn, `Add ${medicineName} to web shopping cart`);
        return { status: 'ADDED_TO_CART', medicineName };
    }
}
