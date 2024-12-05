// Constants
const MAX_FILE_SIZE = 102400;

document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo các biến từ Thymeleaf
    const moduleURL = contextPath + "settings";
    const currentTab = currentTabValue || 'general'; // currentTabValue được set từ Thymeleaf

    // Kích hoạt tab hiện tại
    activateCurrentTab(currentTab);

    // Hiển thị message nếu có
    showMessageIfExists(message);

    // Xử lý dropdown settings
    handleSettingsDropdown();
});

function activateCurrentTab(currentTab) {
    // Thử cả hai cách để kích hoạt tab
    const tabButton = document.querySelector(`button[data-bs-target="#${currentTab}"]`);
    const tabElement = document.getElementById(`${currentTab}-tab`);
    
    if (tabButton) {
        const tab = new bootstrap.Tab(tabButton);
        tab.show();
    } else if (tabElement) {
        const tab = new bootstrap.Tab(tabElement);
        tab.show();
    }
}

function showMessageIfExists(message) {
    if (message && message.trim() !== "") {
        showSuccessMessage(message);
    }
}

function handleSettingsDropdown() {
    const navSettings = document.getElementById('navSettings');
    if (!navSettings) return;

    // Ngăn dropdown đóng khi click bên trong
    navSettings.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Giữ dropdown mở khi đang ở trang settings
    if (window.location.href.includes('/settings')) {
        navSettings.classList.add('show');
        const navLink = navSettings.parentElement.querySelector('.nav-link');
        if (navLink) {
            navLink.classList.remove('collapsed');
            navLink.classList.add('show');
        }
    }
} 