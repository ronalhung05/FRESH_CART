$(document).ready(function() {
	bindRemoveDetailButtons();
});

function bindRemoveDetailButtons() {
	$("a[name='linkRemoveDetail']").each(function(index) {
		$(this).click(function() {
			removeDetailSectionByIndex(index);
		});
	});
}

function addNextDetailSection() {
	allDivDetails = $("[id^='divDetail']");
	divDetailsCount = allDivDetails.length;
	
	htmlDetailSection = `
		<div class="card mb-3" id="divDetail${divDetailsCount}">
			<div class="card-body">
				<div class="row align-items-center">
					<input type="hidden" name="detailIDs" value="0" />
					
					<div class="col-md-5">
						<label class="form-label">Name:</label>
						<input type="text" class="form-control" name="detailNames" 
							   maxlength="255" placeholder="Enter detail name" />
					</div>

					<div class="col-md-5">
						<label class="form-label">Value:</label>
						<input type="text" class="form-control" name="detailValues"
							   maxlength="255" placeholder="Enter detail value" />
					</div>

					<div class="col-md-2 text-end">
						<a class="btn btn-outline-danger" 
						   href="javascript:removeDetailSectionById('divDetail${divDetailsCount}')"
						   title="Remove this detail">
							<i class="bi bi-trash"></i>
						</a>
					</div>
				</div>
			</div>
		</div>
	`;
	
	// Thêm section mới trước nút "Add More Details"
	$(".text-center.mt-3").before(htmlDetailSection);
	
	// Focus vào trường name của detail mới
	$("input[name='detailNames']").last().focus();
}

function removeDetailSectionById(id) {
	$("#" + id).fadeOut(300, function() {
		$(this).remove();
		reindexDetails();
	});
}

function removeDetailSectionByIndex(index) {
	$("#divDetail" + index).fadeOut(300, function() {
		$(this).remove();
		reindexDetails();
	});
}

function reindexDetails() {
	// Đánh lại index cho các detail sections
	$("[id^='divDetail']").each(function(index) {
		$(this).attr('id', 'divDetail' + index);
	});
}