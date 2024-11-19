let loading = false;
let currentPage = 1;
let totalPages = 1;
let pageSize = 18;

const initPagination = () => {
    const currentPageEl = document.getElementById('currentPage');
    const totalPagesEl = document.getElementById('totalPages');
    const totalItemsEl = document.getElementById('totalItems');

    if (currentPageEl) currentPage = parseInt(currentPageEl.value);
    if (totalPagesEl) totalPages = parseInt(totalPagesEl.value);
    if (totalItemsEl) {
        addShowMoreButton();
    }
};

const addShowMoreButton = () => {
    const totalItems = parseInt(document.getElementById('totalItems').value);
    const displayedItems = currentPage * pageSize;
    
    if (displayedItems < totalItems) {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'text-center my-4';
        buttonContainer.id = 'showMoreContainer';
        
        const remainingItems = totalItems - displayedItems;
        
        const button = document.createElement('button');
        button.className = 'btn btn-primary';
        button.innerHTML = `Show More (${remainingItems} items remaining)`;
        button.onclick = loadMoreProducts;
        
        buttonContainer.appendChild(button);
        document.getElementById('productList').after(buttonContainer);
    }
};

const loadMoreProducts = () => {
    if (loading || currentPage >= totalPages) return;
    
    loading = true;
    currentPage++;
    
    const button = document.querySelector('#showMoreContainer button');
    button.disabled = true;
    button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...';

    // Build URL for AJAX request
    let url = new URL(window.location.href);
    url.searchParams.set('pageNum', currentPage);

    fetch(url, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.text())
    .then(html => {
        document.getElementById('productList').insertAdjacentHTML('beforeend', html);
        loading = false;
        
        if (currentPage >= totalPages) {
            document.getElementById('showMoreContainer').remove();
        } else {
            const totalItems = parseInt(document.getElementById('totalItems').value);
            const displayedItems = currentPage * pageSize;
            const remainingItems = totalItems - displayedItems;
            button.innerHTML = `Show More (${remainingItems} items remaining)`;
            button.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        button.disabled = false;
        button.innerHTML = 'Error loading more products. Click to try again.';
        loading = false;
    });
};

document.addEventListener('DOMContentLoaded', initPagination);