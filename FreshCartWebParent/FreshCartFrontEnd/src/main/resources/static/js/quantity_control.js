$(document).ready(function () {
    // Xử lý nút giảm
    $(".input-group").on("click", ".button-minus", function (evt) {
        evt.preventDefault();
        console.log("Button plus clicked");
        let quantityField = $(this).siblings('.quantity-field');
        let currentValue = parseInt(quantityField.val());
        if (currentValue > parseInt(quantityField.attr('min'))) {
            quantityField.val(currentValue - 1);
        } else {
            showWarningMessage('Minimum quantity is ' + quantityField.attr('min'));
        }
    });

    // Xử lý nút tăng
    $(".input-group").on("click", ".button-plus", function (evt) {

        evt.preventDefault();
        console.log("Button plus clicked");
        let quantityField = $(this).siblings('.quantity-field');
        let currentValue = parseInt(quantityField.val());
        quantityField.val(currentValue + 1);
    });

    // Ngăn người dùng nhập giá trị không hợp lệ
    $(".quantity-field").on('input', function () {
        let value = parseInt($(this).val());
        let min = parseInt($(this).attr('min'));
        if (isNaN(value) || value < min) {
            $(this).val(min);
            showWarningMessage('Minimum quantity is ' + min);
        }
    });
});
