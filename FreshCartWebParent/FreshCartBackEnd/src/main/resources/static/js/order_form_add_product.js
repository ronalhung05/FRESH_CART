var productDetailCount;

$(document).ready(function() {
	productDetailCount = $(".hiddenProductId").length;

	$("#linkAddProduct").on("click", function(e) {
		e.preventDefault();
		let url = contextPath + "orders/search_product";

		let modal = new bootstrap.Modal(document.getElementById('addProductModal'));

		$("#addProductModal").on("shown.bs.modal", function() {
			$(this).find("iframe").attr("src", url);
		});

		modal.show();
	});

});

$(document).on("blur", ".cost-input, .price-input, .ship-input, .tax-input", function () {
	const isValid = validatePositiveNumber($(this));
	if (isValid) {
		updateSubtotalWhenQuantityChanged($(this)); // Tính lại subtotal nếu hợp lệ
	}
});

$(document).on("blur", ".cost-input, .price-input, .ship-input, .tax-input", function () {
	validateInput(this, /^\d*\.?\d*$/, "Please enter numbers only!");
});

function validatePositiveNumber(input, fieldName) {
	const value = parseFloat(input.val()) || 0;

	if (value < 0) {
		showErrorMessage(`Cannot be negative. Please enter a positive number.`);
		input.focus();
	}

}

function validateInput(input, regex, errorMessage, maxLength = null, minLength = null) {
	const value = input.value;

	// Kiểm tra regex
	if (!regex.test(value)) {
		showErrorMessage(errorMessage);
		input.focus();
	}
	// Kiểm tra độ dài tối đa
	else if (maxLength !== null && value.length > maxLength) {
		input.value = value.slice(0, maxLength); // Cắt chuỗi đến maxLength
		showErrorMessage(`Maximum ${maxLength} characters allowed.`);
		input.focus();
	}
	// Kiểm tra độ dài tối thiểu
	else if (minLength !== null && value.length < minLength) {
		showErrorMessage(`Minimum ${minLength} characters required.`);
		input.focus();
	}
}

function addProduct(productId, productName) {
	getShippingCost(productId);
}

function getShippingCost(productId) {
	selectedCountry = $("#country option:selected");
	countryId = selectedCountry.val();

	state = $("#state").val();
	if (state.length == 0) {
		state = $("#city").val();
	}

	requestUrl = contextPath + "get_shipping_cost";
	params = { productId: productId, countryId: countryId, state: state };

	$.ajax({
		type: 'POST',
		url: requestUrl,
		beforeSend: function(xhr) {
			xhr.setRequestHeader(csrfHeaderName, csrfValue);
		},
		data: params
	}).done(function(shippingCost) {
		getProductInfo(productId, shippingCost);
	}).fail(function(err) {
		showWarningModal(err.responseJSON.message);
		shippingCost = 0.0;
		getProductInfo(productId, shippingCost);
	}).always(function() {
		let modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
		modal.hide();
	});
}

function getProductInfo(productId, shippingCost) {
	requestURL = contextPath + "products/get/" + productId;
	$.get(requestURL, function(productJson) {
		console.log(productJson);
		productName = productJson.name;
		mainImagePath = productJson.imagePath;
		productCost = $.number(productJson.cost, 2);
		productPrice = $.number(productJson.price, 2);
		inStock = productJson.inStock;

		htmlCode = generateProductCode(productId, productName, mainImagePath, productCost, productPrice, shippingCost, inStock);
		$("#productList tbody").append(htmlCode);

		updateOrderAmounts();

	}).fail(function(err) {
		showWarningModal(err.responseJSON.message);
	});
}

function generateProductCode(productId, productName, mainImagePath, productCost, productPrice, shippingCost, inStock) {
	nextCount = productDetailCount + 1;
	productDetailCount++;
	rowId = "row" + nextCount;
	quantityId = "quantity" + nextCount;
	priceId = "price" + nextCount;
	subtotalId = "subtotal" + nextCount;

	htmlCode = `
        <tr id="${rowId}">
            <input type="hidden" name="detailId" value="0" />
            <input type="hidden" name="productId" value="${productId}" class="hiddenProductId" />

            <td>
                <div class="d-flex flex-column align-items-center">
                    <img src="${mainImagePath}" alt="" class="icon-shape icon-xl mb-2">
					<h5 class="mb-0 text-center">${productName}</h5>
                </div>
		  	</td>
            <td>
                <input type="text" class="form-control text-center cost-input" name="productDetailCost"
                       value="${productCost}" rowNumber="${nextCount}"
                       min="0" step="any" readonly style="width: 100px"/>
            </td>
            <td>
                <div class="input-group input-spinner">
                    <input type="number" class="form-control text-center quantity-input" name="quantity"
                           id="${quantityId}" value="1"
                           max="${inStock}"
                           rowNumber="${nextCount}" min="1" step="1" required />
                </div>
            </td>
            <td>
                <input type="text" class="form-control text-center price-input" name="productPrice"
                       id="${priceId}"
                       rowNumber="${nextCount}" value="${productPrice}"
                       min="0" step="any" required style="width: 100px"/>
            </td>
            <td>
                <input type="text" class="form-control text-center subtotal-output" name="productSubtotal"
                       id="${subtotalId}" value="${productPrice}" readonly style="width: 100px"/>
            </td>
            <td>
                <input type="text" class="form-control text-center ship-input" name="productShipCost"
                       value="${shippingCost}"
                       min="0" step="any" required style="width: 100px"/>
            </td>
            <td>
                <a href="#" class="text-muted linkRemove" rowNumber="${nextCount}">
                    <i class="feather-icon icon-trash-2 text-danger"></i>
                </a>
            </td>
        </tr>
    `;

    return htmlCode;
}

function isProductAlreadyAdded(productId) {
	productExists = false;

	$(".hiddenProductId").each(function(e) {
		aProductId = $(this).val();

		if (aProductId == productId) {
			productExists = true;
			return;
		}
	});

	return productExists;
}

document.querySelectorAll('.quantity-input').forEach(input => {
	input.addEventListener('blur', function () { //blur :unfocus
		const min = parseInt(this.getAttribute('min'), 10) || 1;
		const max = parseInt(this.getAttribute('max'), 10) || Infinity;
		const currentValue = parseInt(this.value, 10) || 0;

		if (currentValue < min) {
			this.value = min;
			showErrorMessage(`Minimum quantity is ${min}.`);
			updateSubtotalWhenQuantityChanged($(this));
			this.focus();
		} else if (currentValue > max) {
			this.value = max;
			showErrorMessage(`Maximum quantity is ${max}.`);
			updateSubtotalWhenQuantityChanged($(this));
			this.focus();
		}
	});
});



