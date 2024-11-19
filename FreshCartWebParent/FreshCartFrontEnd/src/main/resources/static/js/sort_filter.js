document.addEventListener('DOMContentLoaded', function() {
    const sortSelect = document.getElementById("sortSelect");
    
    // Đọc giá trị sort từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const sortValue = urlParams.get('sort');
    
    // Nếu có giá trị sort trong URL, select option tương ứng
    if (sortValue) {
        sortSelect.value = sortValue;
    }
    
    // Thêm sự kiện cho select
    sortSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        const selectedOption = this.options[this.selectedIndex];
        const originalText = selectedOption.text;
        
        // Cập nhật URL với tham số sort và giữ các tham số khác
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('sort', selectedValue);
        
        // Chuyển hướng đến URL mới
        window.location.href = currentUrl.toString();
    });
    
    // Cập nhật hiển thị "Sort by:" cho option được chọn
    function updateSelectedText() {
        const selectedOption = sortSelect.options[sortSelect.selectedIndex];
        if (!selectedOption.text.startsWith('Sort by:')) {
            selectedOption.text = 'Sort by: ' + selectedOption.text;
        }
    }
    
    // Khởi tạo text ban đầu
    updateSelectedText();
});