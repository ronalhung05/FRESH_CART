function filterByPrice() {
    let url = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    
    // Lấy giá trị từ input hoặc radio buttons
    const priceRange = document.querySelector('input[name="price"]:checked')?.value;
    const minPrice = document.getElementById('priceFrom')?.value;
    const maxPrice = document.getElementById('priceTo')?.value;
    
    // Giữ lại các filter khác
    const existingBrands = urlParams.get('brands');
    const rating = urlParams.get('rating');
    
    let params = new URLSearchParams();
    if (existingBrands) {
        params.set('brands', existingBrands);
    }
    if (rating) {
        params.set('rating', rating);
    }
    
    // Thêm filter giá
    if (priceRange) {
        params.set('priceRange', priceRange);
    } else if (minPrice || maxPrice) {
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
    }
    
    const queryString = params.toString();
    url = url + (queryString ? '?' + queryString : '');
    
    window.location.href = url;
}

function clearPriceFilter() {
    // Xóa các lựa chọn giá
    document.querySelectorAll('input[name="price"]').forEach(input => input.checked = false);
    document.getElementById('priceFrom').value = '';
    document.getElementById('priceTo').value = '';
    
    // Reload trang với các filter khác (nếu có)
    filterByPrice();
}