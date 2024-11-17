function showToastMessage(title, message, type) {
    // Configure default options for simple-notify
    const defaultOptions = {
        status: type,
        text: message,
        position: 'top-right',
        effect: 'fade',
        speed: 300,
        customClass: '',
        customIcon: '',
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 5000,
        gap: 20,
        distance: 20,
        type: 1,
        loading: false
    };

    // Create new notification
    new Notify(defaultOptions);
}

function showErrorMessage(message) {
    showToastMessage("Error", message, "error");
}

function showWarningMessage(message) {
    showToastMessage("Warning", message, "warning");
}

function showSuccessMessage(message) {
    showToastMessage("Success", message, "success");
}
