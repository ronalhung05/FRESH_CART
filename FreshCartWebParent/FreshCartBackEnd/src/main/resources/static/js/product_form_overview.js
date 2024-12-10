dropdownBrands = $("select[name='brand']");
dropdownCategories = $("select[name='category']");

$(document).ready(function() {
	dropdownBrands.change(function() {
		dropdownCategories.empty();
		getCategories();
	});

	getCategoriesForNewForm();

	// Price validation
	$("#cost").on("input", function() {
		const isValid = validatePositiveNumber($(this), "cost");
		if (isValid) validatePrice();
	}).on("blur", function() {
		const isValid = validatePositiveNumber($(this), "cost");
		if (isValid) validatePrice();
	});

	$("#price").on("input", function() {
		const isValid = validatePositiveNumber($(this), "price");
		if (isValid) validatePrice();
	}).on("blur", function() {
		const isValid = validatePositiveNumber($(this), "price");
		if (isValid) validatePrice();
	});

	$("#discountPercent").on("input", function() {
		validatePositiveNumber($(this), "discount");
	}).on("blur", function() {
		validatePositiveNumber($(this), "discount");
	});

	// Add product name validation
	$("#name").on("input", function() {
		validateProductName($(this));
	}).on("blur", function() {
		validateProductName($(this));
	});

	// Add validation on form submit
	$("form").on("submit", function(e) {
		if (!validateForm()) {
			e.preventDefault();
			return false;
		}
	});

	// Add realtime validation for all required fields
	$(".validate-field").on("input blur", function() {
		if ($(this).attr("id") === "name") {
			validateProductName($(this));
		} else {
			validatePositiveNumber($(this), $(this).attr("id"));
		}
	});
});

function getCategoriesForNewForm() {
	catIdField = $("#categoryId");
	editMode = false;

	if (catIdField.length) {
		 editMode = true;
	}

	if (!editMode) {
		dropdownCategories.empty();
		getCategories();
	}
}

function getCategories() {
	brandId = dropdownBrands.val();
	if (!brandId) return;

	url = brandModuleURL + "/" + brandId + "/categories";

	$.get(url, function(responseJson) {
		$.each(responseJson, function(index, category) {
			$("<option>").val(category.id).text(category.name).appendTo(dropdownCategories);
		});
	}).fail(function() {
		showErrorMessage(messages.CATEGORY_LOAD_ERROR);
	});
}

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

function validatePrice() {
	const cost = parseFloat($("#cost").val()) || 0;
	const price = parseFloat($("#price").val()) || 0;
	const priceInput = $("#price");
	
	if (price < cost) {
		priceInput.addClass("is-invalid");
		if (!priceInput.next(".invalid-feedback").length) {
			priceInput.after(`<div class="invalid-feedback">${messages.PRICE_LESS_THAN_COST}</div>`);
		} else {
			priceInput.next(".invalid-feedback").text(messages.PRICE_LESS_THAN_COST);
		}
		return false;
	} else {
		priceInput.removeClass("is-invalid");
		priceInput.next(".invalid-feedback").remove();
		return true;
	}
}

function validateProductName(input) {
	const value = input.val().trim();
	const formGroup = input.closest('.form-group');
	const errorElement = formGroup.find('.invalid-feedback');
	
	if (!value) {
		input.addClass("is-invalid");
		errorElement.text(messages.PRODUCT_NAME_REQUIRED);
		errorElement.hide().fadeIn();
		return false;
	} else if (value.length < 3) {
		input.addClass("is-invalid");
		errorElement.text(messages.PRODUCT_NAME_LENGTH_ERROR);
		errorElement.hide().fadeIn();
		return false;
	} else if (value.length > 256) {
		input.addClass("is-invalid");
		errorElement.text(messages.PRODUCT_NAME_LENGTH_ERROR);
		errorElement.hide().fadeIn();
		return false;
	} else {
		input.removeClass("is-invalid");
		errorElement.hide();
		return true;
	}
}

function validateForm() {
	let isValid = true;
	
	// Validate product name
	const nameInput = $("#name");
	if (!validateProductName(nameInput)) {
		isValid = false;
	}
	
	// Validate cost
	const costInput = $("#cost");
	if (!validatePositiveNumber(costInput, "cost")) {
		isValid = false;
	}
	
	// Validate price
	const priceInput = $("#price");
	if (!validatePositiveNumber(priceInput, "price")) {
		isValid = false;
	}
	
	// Validate discount
	const discountInput = $("#discountPercent");
	if (!validatePositiveNumber(discountInput, "discount")) {
		isValid = false;
	}
	
	// Validate price is greater than cost
	if (!validatePrice()) {
		isValid = false;
	}
	
	return isValid;
}

function checkUnique(form) {
	if (!validateForm()) {
		return false;
	}
	
	productId = $("#id").val();
	productName = $("#name").val();
	
	csrfValue = $("input[name='_csrf']").val();
	
	params = {id: productId, name: productName, _csrf: csrfValue};
	
	$.post(checkUniqueUrl, params, function(response) {
		if (response == "OK") {
			form.submit();
		} else if (response == "Duplicate") {
			showWarningMessage(messages.DUPLICATE_PRODUCT_NAME);
		} else {
			showErrorMessage(messages.SERVER_ERROR);
		}
	}).fail(function() {
		showErrorMessage(messages.CONNECTION_ERROR);
	});
	
	return false;
}	