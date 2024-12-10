let currentFilters = {
    brands: [],
    rating: null,
    priceRange: null,
    minPrice: null,
    maxPrice: null,
    sort: 'LOW_TO_HIGH'
};

// Thêm các biến để lưu thông tin currency
let currencySymbol = '';
let currencySymbolPosition = '';

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Lấy thông tin currency từ server (thêm vào đầu hàm)
    currencySymbol = document.getElementById('currencySymbol')?.value || '$';
    currencySymbolPosition = document.getElementById('currencySymbolPosition')?.value || 'Before price';
    
    if (urlParams.has('brands')) {
        const brandNames = urlParams.get('brands').split(',');
        currentFilters.brands = brandNames;
        
        brandNames.forEach(brandName => {
            const checkbox = document.querySelector(`.brand-filter[data-brand-name="${brandName}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    document.querySelectorAll('.brand-filter').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            handleFilterChange('brand', this.value, this.checked);
        });
    });
    
    if (urlParams.has('rating')) {
        currentFilters.rating = urlParams.get('rating');
        const ratingInput = document.querySelector(`.rating-filter[value="${currentFilters.rating}"]`);
        if (ratingInput) ratingInput.checked = true;
    }
    
    if (urlParams.has('priceRange')) {
        currentFilters.priceRange = urlParams.get('priceRange');
        const priceInput = document.querySelector(`input[name="price"][value="${currentFilters.priceRange}"]`);
        if (priceInput) priceInput.checked = true;
    }
    
    if (urlParams.has('minPrice')) {
        currentFilters.minPrice = urlParams.get('minPrice');
        document.getElementById('priceFrom').value = currentFilters.minPrice;
    }
    if (urlParams.has('maxPrice')) {
        currentFilters.maxPrice = urlParams.get('maxPrice');
        document.getElementById('priceTo').value = currentFilters.maxPrice;
    }
    
    const sortSelect = document.getElementById('sortSelect');
    if (urlParams.has('sort')) {
        currentFilters.sort = urlParams.get('sort');
        sortSelect.value = currentFilters.sort;
    }
    
    updateSortSelectText();
    
    sortSelect.addEventListener('change', function() {
        handleFilterChange('sort', this.value);
        updateSortSelectText();
    });
    
    updateFilterTags();
    
    searchBrands();
});

function updateSortSelectText() {
    const sortSelect = document.getElementById('sortSelect');
    const selectedOption = sortSelect.options[sortSelect.selectedIndex];
    if (!selectedOption.text.startsWith('Sort by:')) {
        selectedOption.text = 'Sort by: ' + selectedOption.text;
    }
}

function handleFilterChange(filterType, value, checked = null) {

    switch(filterType) {
        case 'brand':
            const checkbox = document.querySelector(`.brand-filter[value="${value}"]`);
            const brandName = checkbox.getAttribute('data-brand-name');
            if (checked) {
                if (!currentFilters.brands.includes(brandName)) {
                    currentFilters.brands.push(brandName);
                }
            } else {
                currentFilters.brands = currentFilters.brands.filter(b => b !== brandName);
            }
            break;
            
        case 'rating':
            if (currentFilters.rating === value) {
                currentFilters.rating = null;
                document.querySelector(`.rating-filter[value="${value}"]`).checked = false;
            } else {
                currentFilters.rating = value;
            }
            break;
            
        case 'priceRange':
            if (currentFilters.priceRange === value) {
                currentFilters.priceRange = null;
                document.querySelector(`input[name="price"][value="${value}"]`).checked = false;
            } else {
                currentFilters.priceRange = value;
                currentFilters.minPrice = null;
                currentFilters.maxPrice = null;
                document.getElementById('priceFrom').value = '';
                document.getElementById('priceTo').value = '';
            }
            break;
            
        case 'customPrice':
            const minPrice = document.getElementById('priceFrom').value;
            const maxPrice = document.getElementById('priceTo').value;
            
            if (minPrice || maxPrice) {
                currentFilters.minPrice = minPrice;
                currentFilters.maxPrice = maxPrice;
                currentFilters.priceRange = null;
                document.querySelectorAll('input[name="price"]').forEach(input => {
                    input.checked = false;
                });
            }
            break;
            
        case 'sort':
            currentFilters.sort = value;
            break;
    }

    updateFilterTags();
    applyFilters();
}

function applyFilters() {
    let url = new URL(window.location.pathname, window.location.origin);
    let params = new URLSearchParams();

    if (currentFilters.brands.length > 0) {
        params.set('brands', currentFilters.brands.join(','));
    }
    if (currentFilters.rating) {
        params.set('rating', currentFilters.rating);
    }
    if (currentFilters.priceRange) {
        params.set('priceRange', currentFilters.priceRange);
    }
    if (currentFilters.minPrice) {
        params.set('minPrice', currentFilters.minPrice);
    }
    if (currentFilters.maxPrice) {
        params.set('maxPrice', currentFilters.maxPrice);
    }
    if (currentFilters.sort) {
        params.set('sort', currentFilters.sort);
    }

    params.set('page', '1');

    window.location.href = `${url.pathname}?${params.toString()}`;
}

function clearPriceFilter() {
    document.getElementById('priceFrom').value = '';
    document.getElementById('priceTo').value = '';
    
    document.querySelectorAll('input[name="price"]').forEach(input => {
        input.checked = false;
    });
    
    currentFilters.priceRange = null;
    currentFilters.minPrice = null;
    currentFilters.maxPrice = null;
    
    applyFilters();
}

function clearAllFilters() {

    currentFilters = {
        brands: [],
        rating: null,
        priceRange: null,
        minPrice: null,
        maxPrice: null,
        sort: 'LOW_TO_HIGH'
    };
    
    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    
    document.getElementById('priceFrom').value = '';
    document.getElementById('priceTo').value = '';
    
    document.getElementById('sortSelect').value = 'LOW_TO_HIGH';
    
    updateFilterTags();
    applyFilters();
}

function updateFilterTags() {
    const filterTagsContainer = document.getElementById('filterTags');
    const selectedFiltersContainer = document.getElementById('selectedFilters');
    filterTagsContainer.innerHTML = '';
    let hasFilters = false;

    currentFilters.brands.forEach(brandName => {
        hasFilters = true;
        const tag = createFilterTag(
            brandName,
            () => {
                const checkbox = document.querySelector(`.brand-filter[data-brand-name="${brandName}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                    handleFilterChange('brand', checkbox.value, false);
                }
            }
        );
        filterTagsContainer.appendChild(tag);
    });

    if (currentFilters.rating) {
        hasFilters = true;
        const ratingTag = document.createElement('div');
        ratingTag.className = 'filter-tag rating-tag';
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += `<i class="fas fa-star${i <= currentFilters.rating ? '' : ' text-muted'}"></i>`;
        }
        ratingTag.innerHTML = `
            ${starsHtml}
            <span class="close-btn" onclick="clearRatingFilter()">×</span>
        `;
        filterTagsContainer.appendChild(ratingTag);
    }

    if (currentFilters.priceRange) {
        hasFilters = true;
        let priceText = '';
        switch (currentFilters.priceRange) {
            case 'UNDER_50':
                priceText = `Under ${formatCurrency('50')}`;
                break;
            case '50_TO_100':
                priceText = `${formatCurrency('50')} - ${formatCurrency('100')}`;
                break;
            case '100_TO_200':
                priceText = `${formatCurrency('100')} - ${formatCurrency('200')}`;
                break;
            case 'OVER_200':
                priceText = `Over ${formatCurrency('200')}`;
                break;
        }
        const tag = createFilterTag(priceText, clearPriceFilter);
        filterTagsContainer.appendChild(tag);
    } else if (currentFilters.minPrice || currentFilters.maxPrice) {
        hasFilters = true;
        let priceText = '';
        if (currentFilters.minPrice && currentFilters.maxPrice) {
            priceText = `${formatCurrency(currentFilters.minPrice)} - ${formatCurrency(currentFilters.maxPrice)}`;
        } else if (currentFilters.minPrice) {
            priceText = `From ${formatCurrency(currentFilters.minPrice)}`;
        } else if (currentFilters.maxPrice) {
            priceText = `To ${formatCurrency(currentFilters.maxPrice)}`;
        }
        const tag = createFilterTag(priceText, clearPriceFilter);
        filterTagsContainer.appendChild(tag);
    }

    selectedFiltersContainer.style.display = hasFilters ? 'block' : 'none';
}

function createFilterTag(text, onRemove) {
    const tag = document.createElement('div');
    tag.className = 'filter-tag';
    tag.innerHTML = `
        ${text}
        <span class="close-btn" onclick="event.stopPropagation();">×</span>
    `;
    tag.querySelector('.close-btn').addEventListener('click', onRemove);
    return tag;
}

function clearRatingFilter() {
    if (currentFilters.rating) {
        const ratingInput = document.querySelector(`.rating-filter[value="${currentFilters.rating}"]`);
        if (ratingInput) {
            ratingInput.checked = false;
        }
    }
    
    currentFilters.rating = null;
    
    updateFilterTags();
    applyFilters();
}

function searchBrands() {
    const searchInput = document.querySelector('.brand-search');
    const brandItems = document.querySelectorAll('.brand-list .form-check');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            brandItems.forEach(item => {
                const brandLabel = item.querySelector('.form-check-label');
                const brandName = brandLabel.textContent.toLowerCase();
                
                if (brandName.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

function validatePriceInput(input) {
    // Chỉ cho phép số dương
    if (input.value < 0) {
        input.value = 0;
    }
}

function validateAndApplyPriceFilter() {
    const minPrice = document.getElementById('priceFrom');
    const maxPrice = document.getElementById('priceTo');
    const errorDiv = document.getElementById('priceError');
    
    // Reset error message
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    
    // Validate empty fields
    if (minPrice.value === '' && maxPrice.value === '') {
        errorDiv.textContent = 'Please enter at least one price value';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Convert to numbers for comparison
    const minVal = minPrice.value ? parseFloat(minPrice.value) : 0;
    const maxVal = maxPrice.value ? parseFloat(maxPrice.value) : Infinity;
    
    // Validate min price is less than max price
    if (minVal > maxVal) {
        errorDiv.textContent = 'Minimum price cannot be greater than maximum price';
        errorDiv.style.display = 'block';
        return;
    }
    
    // If all validations pass, apply the filter
    applyPriceFilter();
}

function applyPriceFilter() {
    const minPrice = document.getElementById('priceFrom').value;
    const maxPrice = document.getElementById('priceTo').value;
    
    if (minPrice || maxPrice) {
        currentFilters.minPrice = minPrice;
        currentFilters.maxPrice = maxPrice;
        currentFilters.priceRange = null;
        document.querySelectorAll('input[name="price"]').forEach(input => {
            input.checked = false;
        });
    }
    
    applyFilters();
}

// Thêm hàm mới để format currency
function formatCurrency(value) {
    if (!value) return '';
    return currencySymbolPosition === 'Before price' 
        ? `${currencySymbol}${value}`
        : `${value}${currencySymbol}`;
}