$(document).ready(function () {
    $(".buttonAdd2Cart").on("click", function (evt) {
        evt.preventDefault();
        const productId = $(this).attr("pid");
        addToCart(productId);
    });

    $("#buttonAdd2Cart").on("click", function (evt) {
        evt.preventDefault();
        addToCart(productId);
    });
});

function addToCart(productId) {
    let quantity = $("#quantity" + productId).val();
    
    quantity = parseInt(quantity);
    if (isNaN(quantity) || quantity < 1) {
        showWarningMessage("Please enter a valid quantity");
        return;
    }

    const url = contextPath + "cart/add/" + productId + "/" + quantity;

    $.ajax({
        type: "POST",
        url: url,
        beforeSend: function(xhr) {
            xhr.setRequestHeader(csrfHeaderName, csrfValue);
        }
    }).done(function(response) {
        if (response.includes("must login")) {
            showWarningMessage(response);
        } else if (response.includes("error")) {
            showErrorMessage(response);
        } else {
            const [updatedQuantity, totalItems] = response.split('_');
            showSuccessMessage(updatedQuantity + " item(s) of this product were added to your shopping cart.");
            updateCartBadge(totalItems);
        }
    }).fail(function() {
        showErrorMessage("Error while adding product to shopping cart.");
    });
}

function updateCartBadge(totalItems) {
    const badge = $(".position-absolute.top-0.start-100.translate-middle.badge");
    if (totalItems === "0") {
        badge.text("");
    } else {
        badge.text(totalItems);
    }
}
