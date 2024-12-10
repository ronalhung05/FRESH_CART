var extraImagesCount = 0;
var MAX_FILE_SIZE = 1024 * 1024; // 1MB

$(document).ready(function() {
	$("#fileImage").change(function() {
		if (!checkFileSize(this)) {
			return;
		}
		showMainImageThumbnail(this);
		$("#clearMainImage").show();
	});

	$("#clearMainImage").click(function() {
		clearMainImage();
	});

	$("input[name='extraImage']").each(function(index) {
		extraImagesCount++;

		$(this).change(function() {
			if (!checkFileSize(this)) {
				return;
			}
			showExtraImageThumbnail(this, index);
		});
	});

	$("a[name='linkRemoveExtraImage']").each(function(index) {
		$(this).click(function() {
			removeExtraImage(index);
		});
	});

});

function checkFileSize(fileInput) {
	if (!fileInput.files || fileInput.files.length === 0) return false;
	
	const file = fileInput.files[0];
	
	// Check file type
	if (!ALLOWED_EXTENSIONS.includes(file.type)) {
		showErrorMessage(messages.IMAGE_UPLOAD_TYPE_ERROR);
		fileInput.value = '';
		return false;
	}
	
	// Check file size
	if (file.size > MAX_FILE_SIZE) {
		 showErrorMessage(messages.IMAGE_UPLOAD_SIZE_ERROR.replace('{0}', MAX_FILE_SIZE_IN_MB));
		fileInput.value = '';
		return false;
	}
	
	return true;
}

function showExtraImageThumbnail(fileInput, index) {
	if (!checkFileSize(fileInput)) {
		return;
	}
	
	var file = fileInput.files[0];
	fileName = file.name;
	
	imageNameHiddenField = $("#imageName" + index);
	if (imageNameHiddenField.length) {
		imageNameHiddenField.val(fileName);
	}

	var reader = new FileReader();
	reader.onload = function(e) {
		$("#extraThumbnail" + index).attr("src", e.target.result);
		$("#btnClearExtra" + index).show();
	};

	reader.readAsDataURL(file);

	if (index >= extraImagesCount - 1) {
		addNextExtraImageSection(index + 1);
	}
}

function addNextExtraImageSection(index) {
	htmlExtraImage = `
		<div class="col-md-4 mb-4" id="divExtraImage${index}">
			<div class="card h-100 rounded-3 shadow-sm">
				<div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
					<div>
						<h6 class="mb-0">Extra Image #${index + 1}</h6>
					</div>
					${index > 0 ? `
					<div>
						<button class="btn btn-outline-danger btn-sm"
								onclick="removeExtraImage(${index})" 
								title="Delete this image">
							<i class="bi bi-trash"></i>
						</button>
					</div>
					` : ''}
				</div>
				<div class="card-body text-center">
					<div class="position-relative mb-3">
						<img id="extraThumbnail${index}" 
							alt="Extra image #${index + 1} preview"
							class="img-fluid rounded-3" 
							src="${defaultImageThumbnailSrc}" />
						<button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2" 
								id="btnClearExtra${index}"
								onclick="clearExtraImage(${index})"
								title="Clear image"
								style="display: none;">
							<i class="bi bi-x-lg"></i>
						</button>
					</div>
					<div class="d-grid">
						<label class="btn btn-outline-primary">
							<i class="bi bi-upload me-2"></i>Choose File
							<input type="file" name="extraImage" hidden
								onchange="showExtraImageThumbnail(this, ${index})"
								accept="image/png, image/jpeg" />
						</label>
					</div>
				</div>
			</div>
			<input type="hidden" name="imageIDs" id="imageId${index}" />
			<input type="hidden" name="imageNames" id="imageName${index}" />
		</div>
	`;

	$("#divProductImages").append(htmlExtraImage);
	extraImagesCount++;
}

function removeExtraImage(index) {
	$("#divExtraImage" + index).remove();
}

function showMainImageThumbnail(fileInput) {
	if (!checkFileSize(fileInput)) {
		return;
	}
	
	var file = fileInput.files[0];
	
	if (file) {
		var reader = new FileReader();
		reader.onload = function(e) {
			$("#mainThumbnail").attr("src", e.target.result);
		};
		reader.readAsDataURL(file);
		
		$("#mainImage").val(file.name);
		$("#clearMainImage").show();
	} else {
		$("#mainThumbnail").attr("src", defaultImageThumbnailSrc);
		$("#mainImage").val('');
		$("#clearMainImage").hide();
	}
}

function clearMainImage() {
	$("#fileImage").val('');
	$("#mainImage").val('');
	$("#mainThumbnail").attr("src", defaultImageThumbnailSrc);
	$("#clearMainImage").hide();
}

function clearExtraImage(index) {
	$(`#divExtraImage${index} input[type="file"]`).val('');
	$(`#extraThumbnail${index}`).attr("src", defaultImageThumbnailSrc);
	$(`#imageName${index}`).val('');
	$(`#btnClearExtra${index}`).hide();
}

// Add form validation for main image
const productForm = document.querySelector('form');
if (productForm) {
    productForm.addEventListener('submit', function(e) {
        const mainImageInput = document.getElementById('fileImage');
        const mainImageHidden = document.getElementById('mainImage');
        
        if (!mainImageInput.files.length && !mainImageHidden.value) {
            e.preventDefault();
            showErrorMessage(messages.IMAGE_MAIN_REQUIRED);
            document.getElementById('images-tab').click();
        }
    });
}
