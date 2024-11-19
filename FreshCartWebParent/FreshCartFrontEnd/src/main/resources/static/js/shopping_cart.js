decimalSeparator = decimalPointType == 'COMMA' ? ',' : '.';
thousandsSeparator = thousandsPointType == 'COMMA' ? ',' : '.';

$(document).ready(function() {
	$(".input-group").on("click", ".button-minus", function(evt) {
		evt.preventDefault();
		decreaseQuantity($(this));
	});

	$(".input-group").on("click", ".button-plus", function(evt) {
		evt.preventDefault();
		increaseQuantity($(this));
	});

	$(".linkRemove").on("click", function(evt) {
		evt.preventDefault();
		removeProduct($(this));
	});
});

function decreaseQuantity(button) {
	productId = button.attr("pid");
	quantityInput = $("#quantity" + productId);
	newQuantity = parseInt(quantityInput.val()) - 1;

	if (newQuantity > 0) {
		quantityInput.val(newQuantity);
		updateQuantity(productId, newQuantity);
	} else {
		showWarningModal('Minimum quantity is 1');
	}
}

function increaseQuantity(button) {
	productId = button.attr("pid");
	quantityInput = $("#quantity" + productId);
	newQuantity = parseInt(quantityInput.val()) + 1;

	quantityInput.val(newQuantity);
	updateQuantity(productId, newQuantity);
}

function updateQuantity(productId, quantity) {
	url = contextPath + "cart/update/" + productId + "/" + quantity;

	$.ajax({
		type: "POST",
		url: url,
		beforeSend: function(xhr) {
			xhr.setRequestHeader(csrfHeaderName, csrfValue);
		}
	}).done(function(subtotal) {
		$("#subtotal" + productId).text(formatCurrency(subtotal));
		$("#subtotal" + productId).fadeOut(100).fadeIn(100);
		
		let total = 0.0;
		$(".subtotal").each(function(index, element) {
			let itemSubtotal = clearCurrencyFormat($(element).text());
			total += parseFloat(itemSubtotal);
		});
		
		let formattedTotal = formatCurrency(total);
		$(".estimatedTotal").text(formattedTotal);
		$("#checkout-amount").text(formattedTotal);
		
		$(".d-flex.justify-content-between.mb-2 .fw-bold").each(function() {
			if ($(this).find('.estimatedTotal').length === 0) {
				$(this).text(CURRENCY_SYMBOL + formattedTotal);
			}
		});
		
		$(".estimatedTotal, #checkout-amount, .d-flex.justify-content-between.mb-2 .fw-bold").fadeOut(100).fadeIn(100);
	}).fail(function() {
		showErrorModal("Error while updating product quantity.");
	});
}

function recalculateTotal() {
	let total = 0.0;
	
	$(".subtotal").each(function(index, element) {
		let subtotal = clearCurrencyFormat($(element).text());
		total += parseFloat(subtotal);
	});
	
	let formattedTotal = formatCurrency(total);
	$(".estimatedTotal").text(formattedTotal);
	$("#checkout-amount").text(formattedTotal);
	$(".estimatedTotal, #checkout-amount").fadeOut(100).fadeIn(100);
}

function clearCurrencyFormat(numberString) {
	if (!numberString) return "0";
	let result = numberString.toString().replaceAll(thousandsSeparator, "");
	return result.replaceAll(decimalSeparator, ".");
}

function updateCartBadge(numberOfProducts) {
	const badge = $(".position-absolute.top-0.start-100.translate-middle.badge");
	if (numberOfProducts <= 0) {
		badge.text("");
	} else {
		badge.text(numberOfProducts);
	}
}

function removeProduct(link) {
	url = link.attr("href");
	
	$.ajax({
		url: url,
		type: 'DELETE',
		beforeSend: function(xhr) {
			xhr.setRequestHeader(csrfHeaderName, csrfValue);
		}
	}).done(function(response) {
		let productId = url.split('/').pop();
		$("#row" + productId).remove();
		updateOrderSummary();
		
		// Lấy số lượng sản phẩm hiện tại và giảm đi 1
		let currentProducts = parseInt($(".position-absolute.top-0.start-100.translate-middle.badge").text());
		if (currentProducts > 0) {
			currentProducts--;
		}
		updateCartBadge(currentProducts);
		
		showModalDialog("Shopping Cart", response);
		
		if ($(".row.align-items-center").length === 0) {
			$("#sectionEmptyCartMessage").removeClass("d-none");
			updateCartBadge(0); // Set badge về 0 khi giỏ hàng trống
		}
	}).fail(function() {
		showErrorModal("Error while removing product.");
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
	
	// Cập nhật các phần tử khác hiển thị tổng tiền
	$(".d-flex.justify-content-between.mb-2 .fw-bold").each(function() {
		if ($(this).find('.estimatedTotal').length === 0) {
			$(this).text(CURRENCY_SYMBOL + formattedTotal);
		}
	});
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
		return $.number(amount, decimalDigits, decimalSeparator, thousandsSeparator);
	} catch (e) {
		console.log("Error formatting currency:", e);
		return '0';
	}
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