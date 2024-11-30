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
	});

	$("#trackList").on("change", ".dropDownStatus", function(e) {
		var dropDownList = $(this);
		var rowNumber = dropDownList.attr("rowNumber");
		var selectedOption = $("option:selected", dropDownList);
		var defaultNote = selectedOption.attr("defaultDescription");
		if (defaultNote) {
			$("#trackNote" + rowNumber).text(defaultNote);
		}
	});

	$("#trackList").on("change", "input[name='trackDate'], select[name='trackStatus']", function() {
		updateOverviewStatus();
	});


});

function updateOverviewStatus() {
	let latestDate = null;
	let latestStatus = null;

	$("#trackList tbody tr").each(function() {
		let currentDate = new Date($(this).find("input[name='trackDate']").val());
		let currentStatus = $(this).find("select[name='trackStatus']").val();

		if (!latestDate || currentDate > latestDate) {
			latestDate = currentDate;
			latestStatus = currentStatus;
		}
	});

	if (!latestStatus) {
		$("#overviewStatus").val("NEW"); //New readonly
	} else {
		$("#overviewStatus").val(latestStatus);
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

	// Thu thập các trạng thái đã được sử dụng
	var usedStatuses = [];
	$("#trackList tbody tr").each(function () {
		var status = $(this).find("select[name='trackStatus']").val();
		if (status) {
			usedStatuses.push(status);
		}
	});

	// Tạo danh sách các trạng thái chưa sử dụng
	var allStatuses = [
		{ value: "CANCELLED", description: "Order has been cancelled" },
		{ value: "PROCESSING", description: "Order is being processed" },
		{ value: "PACKAGED", description: "Order has been packaged" },
		{ value: "PICKED", description: "Order has been picked" },
		{ value: "SHIPPING", description: "Order is in shipping" },
		{ value: "DELIVERED", description: "Order has been delivered" },
		{ value: "RETURN_REQUESTED", description: "Return has been requested" },
		{ value: "RETURNED", description: "Order has been returned" },
		{ value: "PAID", description: "Customer has paid this order" },
		{ value: "REFUNDED", description: "Order has been refunded" }
	];

	var availableStatuses = allStatuses.filter(function (status) {
		return !usedStatuses.includes(status.value);
	});

	// Tạo HTML cho dropdown
	var statusOptionsHtml = availableStatuses.map(function (status) {
		return `<option value="${status.value}" defaultDescription="${status.description}">${status.value}</option>`;
	}).join("");

	var htmlCode = `
        <tr id="${rowId}">
            <input type="hidden" name="trackId" value="0" class="hiddenTrackId" />
            <td>
                <input type="datetime-local" name="trackDate" value="${currentDateTime}" class="form-control" required style="width: 100%;" />
            </td>
            <td>
                <select name="trackStatus" class="form-control dropDownStatus" required style="max-width: 300px" rowNumber="${nextCount}">
                    ${statusOptionsHtml}
                </select>
            </td>
            <td>
                <textarea rows="1" class="form-control" name="trackNotes" id="${trackNoteId}" required style="width: 100%;"></textarea>
            </td>
            <td>
                <a class="fas fa-trash icon-dark linkRemoveTrack" href="" rowNumber="${nextCount}" title="Delete"></a> Delete
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
