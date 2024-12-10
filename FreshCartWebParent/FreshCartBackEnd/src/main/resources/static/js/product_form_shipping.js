$(document).ready(function() {
    // Add validation for all shipping inputs
    $("#length").on("input", function() {
        validateShippingField($(this), "length");
    });

    $("#width").on("input", function() {
        validateShippingField($(this), "width");
    });

    $("#height").on("input", function() {
        validateShippingField($(this), "height");
    });

    $("#weight").on("input", function() {
        validateShippingField($(this), "weight");
    });
});

function validateShippingField(input, fieldName) {
    const value = parseFloat(input.val()) || 0;
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.find('.invalid-feedback');
    
    if (value <= 0) {
        input.addClass("is-invalid");
        errorElement.text(messages[`SHIPPING_${fieldName.toUpperCase()}_ERROR`]);
        errorElement.show();
        return false;
    } else {
        input.removeClass("is-invalid");
        errorElement.hide();
        return true;
    }
}

function validateShipping() {
    const lengthValid = validateShippingField($("#length"), "length");
    const widthValid = validateShippingField($("#width"), "width");
    const heightValid = validateShippingField($("#height"), "height");
    const weightValid = validateShippingField($("#weight"), "weight");
    
    if (!lengthValid || !widthValid || !heightValid || !weightValid) {
        document.getElementById('shipping-tab').click();
        return false;
    }
    return true;
} 