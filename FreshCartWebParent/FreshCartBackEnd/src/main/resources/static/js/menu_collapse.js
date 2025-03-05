document.addEventListener('DOMContentLoaded', function() {
    const hamBurger = document.querySelector(".toggle-btn");
    const sidebar = document.querySelector(".navbar-vertical");
    
    // Load saved state
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapse');
    }

    hamBurger.addEventListener("click", function () {
        sidebar.classList.toggle("collapse");
        
        // Save state
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapse'));
    });
});