import { BasePage } from './BasePage.js';

export class FiltersPage extends BasePage {
    selectors = {
        filterIcon: 'com.medifind.app:id/btn_filter_icon',
        radiusSlider: 'com.medifind.app:id/slider_radius',
        inStockCheckbox: 'com.medifind.app:id/cb_in_stock_only',
        priceRangeMin: 'com.medifind.app:id/et_min_price',
        priceRangeMax: 'com.medifind.app:id/et_max_price',
        applyFilterBtn: 'com.medifind.app:id/btn_apply_filters'
    };

    async applyFilters(minPrice, maxPrice, inStockOnly = true) {
        await this.click(this.selectors.filterIcon);
        await this.sendKeys(this.selectors.priceRangeMin, minPrice);
        await this.sendKeys(this.selectors.priceRangeMax, maxPrice);
        await this.click(this.selectors.applyFilterBtn);
    }
}
