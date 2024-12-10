$(document).ready(function () {
    const MAX_FILE_SIZE = 102400; // Maximum file size: 2MB
    const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg"];

    const fieldsToValidate = [
        "#fileImage",
        "#SITE_NAME",
        "#COPYRIGHT",
        "#MAIL_HOST",
        "#MAIL_USERNAME",
        "#MAIL_PASSWORD",
        "#MAIL_FROM",
        "#MAIL_PORT",
        "#MAIL_SENDER_NAME",
        "#CUSTOMER_VERIFY_SUBJECT",
        "#customerVerificationContent",
        "#ORDER_CONFIRMATION_SUBJECT",
        "#orderConfirmationContent",
        "#PAYPAL_API_BASE_URL",
        "#PAYPAL_API_CLIENT_ID",
        "#PAYPAL_API_CLIENT_SECRET",
    ];

    fieldsToValidate.forEach(function (selector) {
        const input = $(selector);

        input.on("invalid", function (event) {
            event.preventDefault();

            const formGroup = input.closest('.form-group');
            const errorElement = formGroup.find('.invalid-feedback');

            if(selector === "#fileImage"){
                validateFileInput(input, errorElement);
            }
            if(selector === "#MAIL_PORT"){
                if(input[0].validity.patternMismatch){
                    showError(input, errorElement, messages.MIS_MATCH_NUMBER_PORT);
                }
            }
            if (input[0].validity.valueMissing) {
                showError(input, errorElement, messages.NOT_FULL_FIELD);
            } else if (input[0].validity.tooLong) {
                showError(input, errorElement, messages.FILL_TOO_LONG);
            }
        });

        input.on("input", function () {
            const formGroup = input.closest('.form-group');
            const errorElement = formGroup.find('.invalid-feedback');
            if (input[0].checkValidity()) {
                clearError(input, errorElement);
            }
        });
    });

    function validateFileInput(input, errorElement) {
        const file = input[0].files[0];
        if (!file) {
            clearError(input, errorElement);
            return true;
        }
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            showError(input, errorElement, messages.LOGO_UPLOAD_TYPE_ERROR);
            input.val('');
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            showError(input, errorElement, messages.LOGO_UPLOAD_SIZE_ERROR);
            input.val('');
            return false;
        }
        clearError(input, errorElement);
        return true;
    }

    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (e) {
            let isValid = true;

            fieldsToValidate.forEach(function (selector) {
                const input = $(selector);
                const formGroup = input.closest('.form-group');
                const errorElement = formGroup.find('.invalid-feedback');

                if (!input[0].checkValidity()) {
                    input.trigger("invalid"); // Gọi sự kiện invalid để hiển thị lỗi
                    isValid = false;
                } else {
                    clearError(input, errorElement);
                }
            });

            if (!isValid) {
                e.preventDefault(); // Ngăn submit nếu có lỗi
            }
        });
    }
});


function showError(input, errorElement, message) {
    input.addClass("is-invalid");
    errorElement.text(message);
    errorElement.hide().fadeIn();
}

function clearError(input, errorElement) {
    input.removeClass("is-invalid");
    errorElement.hide();
}
