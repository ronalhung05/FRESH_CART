document.addEventListener('DOMContentLoaded', function() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        const icon = item.querySelector('i');
        if (icon) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const subMenu = this.nextElementSibling;
                
                if (subMenu && subMenu.classList.contains('collapse')) {
                    // Toggle collapse
                    if (subMenu.classList.contains('show')) {
                        subMenu.classList.remove('show');
                        icon.classList.remove('bi-chevron-up');
                        icon.classList.add('bi-chevron-down');
                    } else {
                        subMenu.classList.add('show');
                        icon.classList.remove('bi-chevron-down');
                        icon.classList.add('bi-chevron-up');
                    }
                } else {
                    // Navigate to category page if no submenu
                    window.location.href = this.href;
                }
            });
        }
    });
});