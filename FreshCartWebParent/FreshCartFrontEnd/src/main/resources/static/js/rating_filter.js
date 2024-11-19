// Thêm hàm này để chạy khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Lấy rating từ URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const selectedRating = urlParams.get('rating');
    
    // Nếu có rating, đánh dấu radio button tương ứng
    if (selectedRating) {
        const ratingInput = document.querySelector(`.rating-filter[value="${selectedRating}"]`);
        if (ratingInput) {
            ratingInput.checked = true;
        }
    }
});

function filterByRating() {
    let url = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const ratingInput = document.querySelector('.rating-filter:checked');
    const rating = ratingInput ? ratingInput.value : null;
    const existingBrands = urlParams.get('brands');
    
    // Remove /page/{num} from URL if exists
    url = url.replace(/\/page\/\d+/, '');
    
    let params = new URLSearchParams();
    if (existingBrands) {
        params.set('brands', existingBrands);
    }
    if (rating) {
        params.set('rating', rating);
    }

    const queryString = params.toString();
    url = url + (queryString ? '?' + queryString : '');
    
    window.location.href = url;
}

// Cập nhật hàm clearRatingFilter để giữ lại brand filter
function clearRatingFilter() {
    const ratingInputs = document.querySelectorAll('.rating-filter');
    ratingInputs.forEach(input => input.checked = false);
    
    let url = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const existingBrands = urlParams.get('brands');
    
    if (url.includes('/page/')) {
        url = url.substring(0, url.lastIndexOf('/page/'));
    }
    
    url = url.replace(/\/$/, '') + '/page/1';
    
    if (existingBrands) {
        url += '?brands=' + existingBrands;
    }
    
    window.location.href = url;
}