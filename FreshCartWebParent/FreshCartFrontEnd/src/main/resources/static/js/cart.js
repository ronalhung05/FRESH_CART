// Sử dụng các biến từ window object
$(document).ready(function() {
    // Thêm hàm này vào đầu document.ready
    updateCartBadgeOnLoad();
    
    // Event handlers cho cart
    $(".buttonAdd2Cart").on("click", function (evt) {
        evt.preventDefault();
        const productId = $(this).attr("pid");
        if (productId) {
            addToCart(productId);
        } else {
            showErrorMessage("Error: Could not determine product ID");
        }
    });

    $("#buttonAdd2Cart").on("click", function (evt) {
        evt.preventDefault();
        const productId = $(this).attr("pid");
        addToCart(productId);
    });

    // Xử lý các nút tăng/giảm số lượng trong giỏ hàng và product detail
    $(".input-group").on("click", ".button-minus", function(evt) {
        evt.preventDefault();
        const quantityField = $(this).closest('.input-group').find('.quantity-field');
        let currentValue = parseInt(quantityField.val());
        let minValue = parseInt(quantityField.attr('min')) || 1;
        
        if (currentValue > minValue) {
            currentValue--;
            quantityField.val(currentValue);
            
            if (window.location.pathname.includes("/cart")) {
                const productId = quantityField.attr("id").replace("quantity", "");
                updateQuantity(productId, currentValue);
            }
        } else {
            showWarningMessage('Minimum quantity is ' + minValue);
        }
    });

    $(".input-group").on("click", ".button-plus", function(evt) {
        evt.preventDefault();
        const quantityField = $(this).closest('.input-group').find('.quantity-field');
        let currentValue = parseInt(quantityField.val());
        let inStock = parseInt(quantityField.data('instock'));
        
        if (currentValue < inStock) {
            currentValue++;
            quantityField.val(currentValue);
            
            if (window.location.pathname.includes("/cart")) {
                const productId = quantityField.attr("id").replace("quantity", "");
                updateQuantity(productId, currentValue);
            }
        } else {
            showWarningMessage('Maximum quantity available is ' + inStock);
        }
    });

    // Ngăn người dùng nhập giá trị không hợp lệ
    $(".quantity-field").on('input', function() {
        let value = parseInt($(this).val());
        let minValue = parseInt($(this).attr('min')) || 1;
        let inStock = parseInt($(this).data('instock'));
        const productId = $(this).attr("id").replace("quantity", "");
        
        if (isNaN(value) || value < minValue) {
            $(this).val(minValue);
            value = minValue;
            showWarningMessage('Minimum quantity is ' + minValue);
        } else if (value > inStock) {
            $(this).val(inStock);
            value = inStock;
            showWarningMessage('Maximum quantity available is ' + inStock);
        }

        if (window.location.pathname.includes("/cart")) {
            updateQuantity(productId, value);
        }
    });

    $(".linkRemove").on("click", function(evt) {
        evt.preventDefault();
        removeProduct($(this));
    });
});

function addToCart(productId) {
    let quantity = $("#quantity" + productId).val();
    // Nếu không có quantity field (ở trang danh sách sản phẩm), mặc định là 1
    if (!quantity) {
        quantity = 1;
    }
    
    // Lấy inStock từ quantity field hoặc từ nút Add to Cart
    let inStock = $("#quantity" + productId).data('instock');
    if (!inStock) {
        const addButton = $(".buttonAdd2Cart[pid='" + productId + "']");
        if (addButton.length) {
            inStock = addButton.data('instock');
        }
    }
    
    // Kiểm tra số lượng hiện có trong giỏ hàng
    $.ajax({
        type: "GET",
        url: contextPath + "cart/get-quantity/" + productId,
        beforeSend: function(xhr) {
            xhr.setRequestHeader(csrfHeaderName, csrfValue);
        },
        success: function(response) {
            let cartQuantity = parseInt(response) || 0;
            if ((cartQuantity + parseInt(quantity)) > inStock) {
                showWarningMessage("Cannot add more items. Maximum quantity available is " + inStock);
                return;
            }
            
            // Nếu số lượng hợp lệ thì thêm vào giỏ hàng
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
    });
}

function updateCartBadge(totalItems) {
    const badge = $(".cart-badge");
    if (!totalItems || totalItems === "0") {
        badge.text("");
        badge.hide();
    } else {
        badge.text(totalItems);
        badge.show();
    }
}

function updateQuantity(productId, quantity) {
    const url = window.contextPath + "cart/update/" + productId + "/" + quantity;

    $.ajax({
        type: "POST",
        url: url,
        beforeSend: function(xhr) {
            xhr.setRequestHeader(window.csrfHeaderName, window.csrfValue);
        }
    }).done(function(response) {
        // Cập nhật subtotal
        $("#subtotal" + productId).text(formatCurrency(response));
        $("#subtotal" + productId).fadeOut(100).fadeIn(100);
        
        // Cập nhật tổng tiền
        updateTotal();
        
        showSuccessMessage("Product quantity updated successfully");
    }).fail(function() {
        showErrorMessage("Error while updating product quantity.");
    });
}

function updateSubtotal(productId, subtotal) {
    $("#subtotal" + productId).text(formatCurrency(subtotal));
}

function removeProduct(link) {
    url = link.attr("href");
    
    $.ajax({
        url: url,
        type: 'DELETE',
        beforeSend: function(xhr) {
            xhr.setRequestHeader(window.csrfHeaderName, window.csrfValue);
        }
    }).done(function(response) {
        let productId = url.split('/').pop();
        $("#row" + productId).remove();
        updateOrderSummary();
        
        // Lấy số lượng sản phẩm hiện tại và giảm đi 1
        let currentProducts = parseInt($(".cart-badge").text());
        if (currentProducts > 0) {
            currentProducts--;
        }
        updateCartBadge(currentProducts);
        
        showSuccessMessage("Product has been removed from your shopping cart.");
        
        if ($(".row.align-items-center").length === 0) {
            $("#sectionEmptyCartMessage").removeClass("d-none");
            updateCartBadge(0); // Set badge về 0 khi giỏ hàng trống
        }
    }).fail(function() {
        showErrorMessage("Error while removing product.");
    });
}

function updateOrderSummary() {
    let total = 0;
    
    // Lấy tất cả các subtotal và tính tổng
    $(".subtotal").each(function(index, element) {
        let itemSubtotal = clearCurrencyFormat($(element).text());
        total += parseFloat(itemSubtotal);
    });
    
    // Nếu không còn sản phẩm nào, set total = 0
    if ($(".subtotal").length === 0) {
        total = 0;
    }
    
    // Format số theo định dạng tiền tệ
    let formattedTotal = formatCurrency(total);
    
    // Cập nhật tất cả các vị trí hiển thị tổng tiền
    $(".estimatedTotal").text(formattedTotal);
    $("#checkout-amount").text(formattedTotal);
}

function updateTotal() {
    total = 0.0;
    productCount = 0;
    
    $(".subtotal").each(function(index, element) {
        productCount++;
        total += parseFloat(clearCurrencyFormat($(element).text()));
    });
    
    if (productCount < 1) {
        $("#sectionEmptyCartMessage").removeClass("d-none");
        $("#sectionTotal").addClass("d-none");
    } else {
        $("#sectionTotal").removeClass("d-none");
        $("#sectionEmptyCartMessage").addClass("d-none");
    }
    
    $(".estimatedTotal").text(formatCurrency(total));
    $("#checkout-amount").text(formatCurrency(total));
}

function clearCurrencyFormat(numberString) {
    if (!numberString) return "0";
    let result = numberString.toString().replaceAll(window.thousandsPointType === 'COMMA' ? ',' : '.', "");
    return result.replaceAll(window.decimalPointType === 'COMMA' ? ',' : '.', ".");
}

function formatCurrency(amount) {
    try {
        if (typeof amount === 'string') {
            amount = parseFloat(amount.replace(',', '.'));
        }
        if (isNaN(amount)) {
            console.log("Invalid amount:", amount);
            return '0';
        }
        return $.number(amount, 
            window.decimalDigits, 
            window.decimalPointType === 'COMMA' ? ',' : '.', 
            window.thousandsPointType === 'COMMA' ? ',' : '.'
        );
    } catch (e) {
        console.log("Error formatting currency:", e);
        return '0';
    }
}

// Thêm hàm mới để kiểm tra số lượng
function checkQuantity(productId, requestedQuantity, inStock) {
    // Lấy số lượng hiện có trong giỏ hàng (nếu có)
    let currentQuantity = 0;
    if (window.location.pathname.includes("/cart")) {
        currentQuantity = parseInt($("#quantity" + productId).val()) || 0;
    } else {
        // Gọi API để lấy số lượng trong giỏ hàng
        $.ajax({
            type: "GET",
            url: window.contextPath + "cart/get-quantity/" + productId,
            async: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader(window.csrfHeaderName, window.csrfValue);
            }
        }).done(function(response) {
            currentQuantity = parseInt(response) || 0;
        });
    }

    const totalQuantity = currentQuantity + requestedQuantity;
    return totalQuantity <= inStock;
}

// Thêm hàm mới này
function updateCartBadgeOnLoad() {
    $.ajax({
        type: "GET",
        url: contextPath + "cart/count",
        beforeSend: function(xhr) {
            xhr.setRequestHeader(csrfHeaderName, csrfValue);
        }
    }).done(function(response) {
        updateCartBadge(response);
    }).fail(function() {
        console.log("Error while getting cart items count");
    });
} 