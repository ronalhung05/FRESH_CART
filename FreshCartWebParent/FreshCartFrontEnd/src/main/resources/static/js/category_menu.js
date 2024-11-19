document.addEventListener('DOMContentLoaded', function() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            const collapseList = this.closest('.nav-item').querySelector('ul.collapse');
            
            if (collapseList) {
                if (collapseList.classList.contains('show')) {
                    collapseList.classList.remove('show');
                    icon.classList.remove('bi-chevron-up');
                    icon.classList.add('bi-chevron-down');
                } else {
                    collapseList.classList.add('show');
                    icon.classList.remove('bi-chevron-down');
                    icon.classList.add('bi-chevron-up');
                }
            }
        });
    });
});