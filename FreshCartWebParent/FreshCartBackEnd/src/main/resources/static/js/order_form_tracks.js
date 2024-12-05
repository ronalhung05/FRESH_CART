var trackRecordCount;

$(document).ready(function() {
	trackRecordCount = $(".hiddenTrackId").length;

	$("#trackList").on("click", ".linkRemoveTrack", function(e) {
		e.preventDefault();
		deleteTrack($(this));
		updateTrackCountNumbers();
		updateOverviewStatus();
	});

	$("#track").on("click", "#linkAddTrack", function(e) {
		e.preventDefault();
		addNewTrackRecord();
		updateTrackStatusOptions();
	});

	$("#trackList").on("change", ".dropDownStatus", function(e) {
		const dropdown = $(this);
		updateTrackStatusOptions();
		updateTrackNotesBasedOnStatus(dropdown); // Gọi hàm cập nhật notes khi status thay đổi
	});

	$("#trackList").on("change", "input[name='trackDate'], select[name='trackStatus']", function() {
		updateOverviewStatus();
	});

	updateTrackStatusOptions();
});

function updateTrackNotesBasedOnStatus(dropdown) {
	const selectedOption = dropdown.find("option:selected");
	const defaultDescription = selectedOption.attr("defaultDescription"); // Lấy giá trị của thuộc tính defaultDescription
	const rowNumber = dropdown.attr("rowNumber");

	if (defaultDescription) {
		$(`#trackNote${rowNumber}`).val(defaultDescription); // Cập nhật textarea tương ứng với mô tả
	}
}

function updateTrackStatusOptions() {
	let selectedStatuses = [];

	// Lấy tất cả các giá trị đã chọn từ các dropdown
	$(".dropDownStatus").each(function() {
		const selectedValue = $(this).val();
		if (selectedValue) {
			selectedStatuses.push(selectedValue);
		}
	});

	// Cập nhật danh sách dropdown để loại bỏ các giá trị đã chọn
	$(".dropDownStatus").each(function() {
		const currentDropdown = $(this);
		const currentValue = currentDropdown.val();

		// Xóa tất cả các tùy chọn
		currentDropdown.find("option").each(function() {
			$(this).show(); // Hiển thị tất cả tùy chọn trước khi lọc
			if ($(this).val() !== currentValue && selectedStatuses.includes($(this).val())) {
				$(this).hide(); // Ẩn các tùy chọn đã được chọn
			}
		});
	});
}

function updateOverviewStatus() {
	let latestDate = null;
	let latestStatus = null;

	// Log toàn bộ dữ liệu dòng
	console.log("Updating overview status. Current rows:");
	$("#trackList tbody tr").each(function() {
		let currentDate = new Date($(this).find("input[name='trackDate']").val());
		let currentStatus = $(this).find("select[name='trackStatus']").val();

		// Log dữ liệu từng dòng
		console.log("Row data:", {
			currentDate: currentDate,
			currentStatus: currentStatus
		});

		if (!latestDate || currentDate > latestDate) {
			latestDate = currentDate;
			latestStatus = currentStatus;
		}
	});

	console.log("Latest status:", { latestDate, latestStatus });

	if (latestStatus) {
		$("#overviewStatus").val(latestStatus);
	} else {
		$("#overviewStatus").val("NEW");
	}
}


function deleteTrack(link) {
	var rowNumber = link.attr('rowNumber');
	$("#rowTrack" + rowNumber).remove();
	$("#emptyLine" + rowNumber).remove();
}

function updateTrackCountNumbers() {
	$(".divCountTrack").each(function (index, element) {
		element.innerHTML = "" + (index + 1);
	});
}

function addNewTrackRecord() {
	var htmlCode = generateTrackRowCode();
	$("#trackList tbody").append(htmlCode);
}

function generateTrackRowCode() {
	var nextCount = trackRecordCount + 1;
	trackRecordCount++;
	var rowId = "rowTrack" + nextCount;
	var trackNoteId = "trackNote" + nextCount;
	var currentDateTime = formatCurrentDateTime();

	htmlCode = `
		<tr id="${rowId}">
			<input type="hidden" name="trackId" value="0" class="hiddenTrackId" />
			<td>
				<input type="datetime-local" name="trackDate" value="${currentDateTime}" class="form-control" required style="width: 100%;" />
			</td>
			<td>
				<select name="trackStatus" class="form-control dropDownStatus" required rowNumber="${nextCount}">
					<option value="CANCELLED" defaultDescription="Order has been cancelled">CANCELLED</option>
					<option value="PROCESSING" defaultDescription="Order is being processed">PROCESSING</option>
					<option value="PACKAGED" defaultDescription="Order has been packaged">PACKAGED</option>
					<option value="PICKED" defaultDescription="Order has been picked">PICKED</option>
					<option value="SHIPPING" defaultDescription="Order is in shipping">SHIPPING</option>
					<option value="DELIVERED" defaultDescription="Order has been delivered">DELIVERED</option>
					<option value="RETURN_REQUESTED" defaultDescription="Return has been requested">RETURN_REQUESTED</option>
					<option value="RETURNED" defaultDescription="Order has been returned">RETURNED</option>
					<option value="PAID" defaultDescription="Customer has paid this order">PAID</option>
					<option value="REFUNDED" defaultDescription="Order has been refunded">REFUNDED</option>
				</select>
			</td>
			<td>
				<textarea rows="2" class="form-control" name="trackNotes" id="${trackNoteId}" required"></textarea>
			</td>
			<td>
				<a class="text-danger linkRemoveTrack" href="" rowNumber="${nextCount}">
					<i class="feather-icon icon-trash-2"></i>
				</a>
			</td>
		</tr>
	`;

	return htmlCode;
}

function formatCurrentDateTime() {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();

	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;
	if (hour < 10) hour = "0" + hour;
	if (minute < 10) minute = "0" + minute;
	if (second < 10) second = "0" + second;

	return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second;
}





