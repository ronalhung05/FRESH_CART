var extraImagesCount = 0;

$(document).ready(function() {
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

function showExtraImageThumbnail(fileInput, index) {
	var file = fileInput.files[0];

	fileName = file.name;

	imageNameHiddenField = $("#imageName" + index);
	if (imageNameHiddenField.length) {
		imageNameHiddenField.val(fileName);
	}


	var reader = new FileReader();
	reader.onload = function(e) {
		$("#extraThumbnail" + index).attr("src", e.target.result);
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
					<a name="linkRemoveExtraImage" class="btn btn-outline-danger btn-sm"
						href="javascript:removeExtraImage(${index})" 
						title="Remove this image">
						<i class="bi bi-x-lg"></i>
					</a>
				</div>
				<div class="card-body text-center">
					<img id="extraThumbnail${index}" 
						alt="Extra image #${index + 1} preview"
						class="img-fluid rounded-3 mb-3" 
						src="${defaultImageThumbnailSrc}" />
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

// // Thêm CSS animation cho card mới
// const style = document.createElement('style');
// style.textContent = `
// 	.card {
// 		transition: all 0.3s ease;
// 	}

// 	.card:hover {
// 		transform: translateY(-5px);
// 		box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
// 	}

// 	.btn-outline-primary {
// 		transition: all 0.3s ease;
// 	}

// 	.btn-outline-primary:hover {
// 		background-color: #0aad0a;
// 		border-color: #0aad0a;
// 	}

// 	.img-fluid {
// 		max-height: 200px;
// 		object-fit: contain;
// 	}
// `;
// document.head.appendChild(style);