import { BasePage } from './BasePage.js';

export class SearchPage extends BasePage {
    selectors = {
        searchInput: 'com.medifind.app:id/et_search_query',
        searchButton: 'com.medifind.app:id/btn_search',
        suggestionList: 'com.medifind.app:id/rv_suggestions',
        resultCard: 'com.medifind.app:id/card_medicine_item',
        noResultsView: 'com.medifind.app:id/tv_no_results'
    };

    async searchMedicine(query) {
        await this.sendKeys(this.selectors.searchInput, query);
        await this.click(this.selectors.searchButton);
    }
}
