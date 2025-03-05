// Sales Report Common
var MILLISECONDS_A_DAY = 24 * 60 * 60 * 1000;

function setupButtonEventHandlers(reportType, callbackFunction) {
	$(".button-sales-by" + reportType).on("click", function() {
		$(".button-sales-by" + reportType).each(function(e) {
			$(this).removeClass('btn-primary').addClass('btn-light');
		});

		$(this).removeClass('btn-light').addClass('btn-primary');

		period = $(this).attr("period");
		if (period) {
			callbackFunction(period);
			$("#divCustomDateRange" + reportType).addClass("d-none");
		} else {
			$("#divCustomDateRange" + reportType).removeClass("d-none");
		}
	});

	initCustomDateRange(reportType);

	$("#buttonViewReportByDateRange" + reportType).on("click", function(e) {
		validateDateRange(reportType, callbackFunction);
	});
}

function validateDateRange(reportType, callbackFunction) {
	startDateField = document.getElementById('startDate' + reportType);
	days = calculateDays(reportType);

	startDateField.setCustomValidity("");

	if (days >= 7 && days <= 30) {
		callbackFunction("custom");
	} else {
		startDateField.setCustomValidity("Dates must be in the range of 7..30 days");
		startDateField.reportValidity();
	}
}

function calculateDays(reportType) {
	startDateField = document.getElementById('startDate' + reportType);
	endDateField = document.getElementById('endDate' + reportType);

	startDate = startDateField.valueAsDate;
	endDate = endDateField.valueAsDate;

	differenceInMilliseconds = endDate - startDate;
	return differenceInMilliseconds / MILLISECONDS_A_DAY;
}

function initCustomDateRange(reportType) {
	startDateField = document.getElementById('startDate' + reportType);
	endDateField = document.getElementById('endDate' + reportType);

	toDate = new Date();
	endDateField.valueAsDate = toDate;

	fromDate = new Date();
	fromDate.setDate(toDate.getDate() - 30);
	startDateField.valueAsDate = fromDate;
}

function formatCurrency(amount) {
	formattedAmount = $.number(amount, decimalDigits, decimalPointType, thousandsPointType);
	return prefixCurrencySymbol + formattedAmount + suffixCurrencySymbol;
}

function getChartTitle(period) {
	if (period == "last_7_days") return "Sales in Last 7 Days";
	if (period == "last_28_days") return "Sales in Last 28 Days";
	if (period == "last_6_months") return "Sales in Last 6 Months";
	if (period == "last_year") return "Sales in Last Year";
	if (period == "custom") return "Custom Date Range";

	return "";
}

function getDenominator(period, reportType) {
	if (period == "last_7_days") return 7;
	if (period == "last_28_days") return 28;
	if (period == "last_6_months") return 6;
	if (period == "last_year") return 12;
	if (period == "custom") return calculateDays(reportType);

	return 7;
}

function setSalesAmount(period, reportType, labelTotalItems) {
	$("#textTotalRevenue" + reportType).text(formatCurrency(totalRevenue));
	$("#textTotalProfit" + reportType).text(formatCurrency(totalProfit));
	$("#textTotalShippingCost" + reportType).text(formatCurrency(totalShippingCost));
	$("#labelTotalItems" + reportType).text(labelTotalItems);
	$("#textTotalItems" + reportType).text(totalItems);
}

function formatChartData(data, columnStart, columnEnd) {
	var formatter = new google.visualization.NumberFormat({
		prefix: prefixCurrencySymbol,
		suffix: suffixCurrencySymbol,
		decimalSymbol: decimalPointType,
		groupingSymbol: thousandsPointType,
		fractionDigits: decimalDigits
	});

	for (var i = columnStart; i <= columnEnd; i++) {
		formatter.format(data, i);
	}
}

$(document).on("click", ".download-chart", function() {
	var reportType = $(this).data("reporttype"); // Xác định loại báo cáo
	var chartId = "chart_sales_by" + reportType; // Lấy ID của biểu đồ trong tab hiện tại

	var chartElement = document.getElementById(chartId); // Lấy phần tử biểu đồ

	if (chartElement) {
		html2canvas(chartElement).then(canvas => {
			var link = document.createElement("a");
			link.download = "sales_report_" + reportType + ".png"; // Tên file tải về
			link.href = canvas.toDataURL("image/png");
			link.click();
		});
	} else {
		showWarningMessage("Not Found any Chart!");
	}
});

$(document).on("click", ".export-data", function () {
	var reportType = $(this).data("reporttype"); // Loại báo cáo
	if (reportType === "_product") {
		exportTableDataAsCSV();
	}
});

function exportTableDataAsCSV() {
	if (!data) {
		showWarningMessage("No Information!");
		return;
	}

	var csvContent = "data:text/csv;charset=utf-8,";

	// Lấy tiêu đề cột từ DataTable
	var columnCount = data.getNumberOfColumns();
	var columns = [];
	for (var col = 0; col < columnCount; col++) {
		columns.push(data.getColumnLabel(col));
	}
	csvContent += columns.join(",") + "\n";

	// Lấy dữ liệu từ DataTable
	var rowCount = data.getNumberOfRows();
	for (var row = 0; row < rowCount; row++) {
		var rowData = [];
		for (var col = 0; col < columnCount; col++) {
			var value = data.getValue(row, col);

			// Áp dụng định dạng tiền tệ cho các cột cụ thể
			if (columns[col].toLowerCase().includes("revenue") ||
				columns[col].toLowerCase().includes("profit") ||
				columns[col].toLowerCase().includes("cost")) {
				value = formatCurrency(value); // Định dạng tiền tệ
			}

			rowData.push(value);
		}
		csvContent += rowData.join(",") + "\n";
	}

	// Tạo file và tải xuống
	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "sales_report_products.csv");
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}