dropdownBrands = $("select[name='brand']");
dropdownCategories = $("select[name='category']");

$(document).ready(function() {
	dropdownBrands.change(function() {
		dropdownCategories.empty();
		getCategories();
	});

	getCategoriesForNewForm();
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
		showErrorMessage("Error loading categories for selected brand");
	});
}

function checkUnique(form) {
	productId = $("#id").val();
	productName = $("#name").val();

	csrfValue = $("input[name='_csrf']").val();

	params = { id: productId, name: productName, _csrf: csrfValue };

	$.post(checkUniqueUrl, params, function(response) {
		if (response == "OK") {
			form.submit();
		} else if (response == "Duplicate") {
			showWarningMessage("There is another product having the name " + productName);
		} else {
			showErrorMessage("Unknown response from server");
		}
	}).fail(function() {
		showErrorMessage("Could not connect to the server");
	});

	return false;
}	