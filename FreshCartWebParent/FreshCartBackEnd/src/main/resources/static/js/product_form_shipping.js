$(document).ready(function() {
    // Add validation for shipping dimensions with both input and blur events
    $("#length").on("input", function() {
        validatePositiveNumber($(this), "shipping_length");
    }).on("blur", function() {
        validatePositiveNumber($(this), "shipping_length");
    });

    $("#width").on("input", function() {
        validatePositiveNumber($(this), "shipping_width");
    }).on("blur", function() {
        validatePositiveNumber($(this), "shipping_width");
    });

    $("#height").on("input", function() {
        validatePositiveNumber($(this), "shipping_height");
    }).on("blur", function() {
        validatePositiveNumber($(this), "shipping_height");
    });

    $("#weight").on("input", function() {
        validatePositiveNumber($(this), "shipping_weight");
    }).on("blur", function() {
        validatePositiveNumber($(this), "shipping_weight");
    });
});

function validatePositiveNumber(input, fieldName) {
    const value = input.val().trim();
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.find('.invalid-feedback');
    
    if (!value) {
        input.addClass("is-invalid");
        errorElement.text(messages[`${fieldName.toUpperCase()}_REQUIRED`]);
        errorElement.hide().fadeIn();
        return false;
    }
    
    const numValue = parseFloat(value) || 0;
    if (numValue < 0) {
        input.addClass("is-invalid");
        errorElement.text(messages.NEGATIVE_NUMBER_ERROR);
        errorElement.hide().fadeIn();
        return false;
    } else {
        input.removeClass("is-invalid");
        errorElement.hide();
        return true;
    }
}

function validateShipping() {
    let isValid = true;
    
    // Validate length
    const lengthInput = $("#length");
    if (!validatePositiveNumber(lengthInput, "shipping_length")) {
        isValid = false;
    }
    
    // Validate width
    const widthInput = $("#width");
    if (!validatePositiveNumber(widthInput, "shipping_width")) {
        isValid = false;
    }
    
    // Validate height
    const heightInput = $("#height");
    if (!validatePositiveNumber(heightInput, "shipping_height")) {
        isValid = false;
    }
    
    // Validate weight
    const weightInput = $("#weight");
    if (!validatePositiveNumber(weightInput, "shipping_weight")) {
        isValid = false;
    }
    
    if (!isValid) {
        document.getElementById('shipping-tab').click();
    }
    
    return isValid;
} 