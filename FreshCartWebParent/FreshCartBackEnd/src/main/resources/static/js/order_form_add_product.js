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

$(document).on("input", ".cost-input, .price-input, .ship-input, .tax-input", function () {
	validateInput(this, /^\d*\.?\d*$/, "Please enter numbers only!");
});

$(document).on("input", ".firstName-input, .lastName-input", function () {
	validateInput(this, /^[a-zA-Z\s]*$/, "Please enter letters only!", 50);
});

$(document).on("input", ".phone-input", function () {
	validateInput(this, /^\d*\.?\d*$/, "Please enter numbers only!", 11);
});

function validateInput(input, regex, errorMessage, maxLength = null) {
	const value = input.value;

	if (!regex.test(value)) {
		input.value = value.slice(0, -1);
		showErrorMessage(input, errorMessage);
	} else if (maxLength !== null && value.length > maxLength) {
		input.value = value.slice(0, maxLength);
		showErrorMessage(input, `Maximum ${maxLength} characters allowed.`);
	} else {
		clearErrorMessage(input);
	}
}

function showErrorMessage(input, message) {
	let errorContainer = $(input).next(".error-message");

	if (errorContainer.length === 0) {
		errorContainer = $("<div class='error-message alert alert-danger p-1 mt-1'></div>")
			.hide()
			.insertAfter(input);
	}

	errorContainer.text(message).fadeIn(200);
}

function clearErrorMessage(input) {
	$(input).next(".error-message").fadeOut(200, function () {
		$(this).remove();
	});
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
		showWarningMessage(err.responseJSON.message);
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
		showWarningMessage(err.responseJSON.message);
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
                <div class="d-flex align-items-center">
                    <img src="${mainImagePath}" alt="" class="icon-shape icon-xl">
                    <div class="ms-3">
                        <h5 class="mb-0">${productName}</h5>
                    </div>
                </div>
            </td>
            <td>
                <input type="text" class="form-control w-auto cost-input" name="productDetailCost"
                       value="${productCost}" rowNumber="${nextCount}"
                       min="0" step="any" required />
            </td>
            <td>
                <div class="input-group input-spinner">
                    <input type="number" class="form-control w-auto quantity-input" name="quantity"
                           id="${quantityId}" value="1"
                           max="${inStock}"
                           rowNumber="${nextCount}" min="1" step="1" required />
                </div>
            </td>
            <td>
                <input type="text" class="form-control w-auto price-input" name="productPrice"
                       id="${priceId}"
                       rowNumber="${nextCount}" value="${productPrice}"
                       min="0" step="any" required/>
            </td>
            <td>
                <input type="text" class="form-control w-auto subtotal-output" name="productSubtotal"
                       id="${subtotalId}" value="${productPrice}" readonly />
            </td>
            <td>
                <input type="text" class="form-control w-auto ship-input" name="productShipCost"
                       value="${shippingCost}"
                       min="0" step="any" required/>
            </td>
            <td>
                <a href="#" class="text-muted linkRemove" rowNumber="${nextCount}">
                    <i class="feather-icon icon-trash-2"></i>
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

