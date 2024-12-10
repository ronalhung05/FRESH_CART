$(document).ready(function() {
	$("#buttonCancel").on("click", function() {
		window.location = moduleURL;
	});

	$("#fileImage").change(function() {
		if (!checkFileSize(this)) {
			return;
		}

		showImageThumbnail(this);
	});

	// Generic password toggle function
	$(".password-toggler").click(function() {
		// Find the closest password input field
		var passwordField = $(this).closest('.password-field').find('input[type="password"], input[type="text"]');
		var icon = $(this);
		
		// Toggle password visibility
		if (passwordField.attr('type') === 'password') {
			passwordField.attr('type', 'text');
			icon.removeClass('bi-eye-slash').addClass('bi-eye');
		} else {
			passwordField.attr('type', 'password');
			icon.removeClass('bi-eye').addClass('bi-eye-slash');
		}
	});
});

function showImageThumbnail(fileInput) {
	var file = fileInput.files[0];
	var reader = new FileReader();
	reader.onload = function(e) {
		$("#thumbnail").attr("src", e.target.result);
	};

	reader.readAsDataURL(file);
}

function checkFileSize(fileInput) {
	fileSize = fileInput.files[0].size;

	if (fileSize > MAX_FILE_SIZE) {
		fileInput.setCustomValidity("You must choose an image less than " + MAX_FILE_SIZE + " bytes!");
		fileInput.reportValidity();

		return false;
	} else {
		fileInput.setCustomValidity("");

		return true;
	}
}

function showModalDialog(title, message) {
	$("#modalTitle").text(title);
	$("#modalBody").text(message);
	$("#modalDialog").modal();
}
