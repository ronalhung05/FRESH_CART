var productDetailCount;

$(document).ready(function() {
	productDetailCount = $(".hiddenProductId").length;

	$("#products").on("click", "#linkAddProduct", function(e) {
		e.preventDefault();
		link = $(this);
		url = link.attr("href");

		$("#addProductModal").on("shown.bs.modal", function() {
			$(this).find("iframe").attr("src", url);
		});

		$("#addProductModal").modal();
	})
});

$(document).on("input", ".cost-input, .price-input, .ship-input, .tax-input", function () {
	validateInput(this, /^\d*\.?\d*$/, "Vui lòng chỉ nhập số!");
});

$(document).on("input", ".firstName-input, .lastName-input", function () {
	validateInput(this, /^[a-zA-Z\s]*$/, "Vui lòng chỉ nhập chữ!", 50);
});

$(document).on("input", ".phone-input", function () {
	validateInput(this, /^\d*\.?\d*$/, "Vui lòng chỉ nhập số!", 11);
});

// Hàm kiểm tra input với regex và thông báo lỗi
function validateInput(input, regex, errorMessage, maxLength = null) {
	const value = input.value;

	// Nếu giá trị không khớp với regex, hiển thị lỗi
	if (!regex.test(value)) {
		input.value = value.slice(0, -1); // Loại bỏ ký tự không hợp lệ
		showErrorMessage(input, errorMessage);
	} else if (maxLength !== null && value.length > maxLength) {
		// Nếu độ dài vượt quá giới hạn, cắt bớt ký tự thừa
		input.value = value.slice(0, maxLength);
		showErrorMessage(input, `Chỉ được nhập tối đa ${maxLength} ký tự.`);
	} else {
		clearErrorMessage(input);
	}
}

// Hiển thị thông báo lỗi
function showErrorMessage(input, message) {
	let errorContainer = $(input).next(".error-message");

	// Nếu chưa tồn tại, tạo phần tử hiển thị lỗi
	if (errorContainer.length === 0) {
		errorContainer = $("<div class='error-message alert alert-danger p-1 mt-1'></div>")
			.hide()
			.insertAfter(input);
	}

	errorContainer.text(message).fadeIn(200);
}

// Xóa thông báo lỗi
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
		showWarningModal(err.responseJSON.message);
		shippingCost = 0.0;
		getProductInfo(productId, shippingCost);
	}).always(function() {
		$("#addProductModal").modal("hide");
	});
}

function getProductInfo(productId, shippingCost) {
	requestURL = contextPath + "products/get/" + productId;
	$.get(requestURL, function(productJson) {
		console.log(productJson);
		productName = productJson.name;
		mainImagePath = contextPath.substring(0, contextPath.length - 1) + productJson.imagePath;
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
	mainImagePath = mainImagePath.replace("/FreshCartAdmin", "");

	htmlCode = `
        <tr id="${rowId}">
            <input type="hidden" name="detailId" value="0" />
            <input type="hidden" name="productId" value="${productId}" class="hiddenProductId" />

            <td class="product-column">
                <div class="product-container">
                    <img src="${mainImagePath}" class="img-fluid product-image" style="width: 60px; height: 60px;" />
                    <div class="ms-2">
                        <b class="product-name">${productName}</b>
                    </div>
                </div>
            </td>

            <td class="unit-cost-column">
                <input type="number" required class="form-control w-auto cost-input"
                       name="productDetailCost"
                       rowNumber="${nextCount}"
                       value="${productCost}"
                       step="0.01" />
            </td>

            <td class="quantity-column">
                <input type="number" required class="form-control w-auto quantity-input"
                       name="quantity"
                       id="${quantityId}"
                       rowNumber="${nextCount}"
                       value="1"
                       max="${inStock}"
                       min="1" />
            </td>

            <td class="price-column">
                <input type="number" required class="form-control w-auto price-input"
                       name="productPrice"
                       id="${priceId}"
                       rowNumber="${nextCount}"
                       value="${productPrice}"
                       step="0.01" />
            </td>

            <td class="total-column">
                <input type="text" readonly class="form-control w-auto subtotal-output"
                       name="productSubtotal"
                       id="${subtotalId}"
                       value="${(productPrice * 1).toFixed(2)}" />
            </td>

            <td class="shipping-cost-column">
                <input type="number" required class="form-control w-auto ship-input"
                       name="productShipCost"
                       value="${shippingCost}"
                       step="0.01" />
            </td>

            <td>
                <a href="#" class="fas fa-trash icon-dark linkRemove" rowNumber="${nextCount}">
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

