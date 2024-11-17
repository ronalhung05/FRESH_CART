document.addEventListener('DOMContentLoaded', function() {
    const sortSelect = document.getElementById('sortSelect');
    
    sortSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('sort', selectedValue);
        
        // Cập nhật text hiển thị
        const selectedOption = this.options[this.selectedIndex];
        selectedOption.text = 'Sort by: ' + selectedOption.text.replace('Sort by: ', '');
        
        window.location.href = currentUrl.toString();
    });
    
    // Thêm "Sort by:" cho option được chọn khi trang load
    const selectedOption = sortSelect.options[sortSelect.selectedIndex];
    if (!selectedOption.text.startsWith('Sort by:')) {
        selectedOption.text = 'Sort by: ' + selectedOption.text;
    }
});