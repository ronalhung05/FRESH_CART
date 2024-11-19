function filterByBrand() {
    let url = window.location.pathname;
    const brandCheckboxes = document.querySelectorAll('.brand-filter:checked');
    const brandNames = Array.from(brandCheckboxes).map(cb => cb.getAttribute('data-brand-name'));
    const urlParams = new URLSearchParams(window.location.search);
    const rating = urlParams.get('rating');
    
    // Remove /page/{num} from URL if exists
    url = url.replace(/\/page\/\d+/, '');
    
    let params = new URLSearchParams();
    if (brandNames.length > 0) {
        params.set('brands', brandNames.join(','));
    }
    if (rating) {
        params.set('rating', rating);
    }

    const queryString = params.toString();
    url = url + (queryString ? '?' + queryString : '');
    
    window.location.href = url;
} 
