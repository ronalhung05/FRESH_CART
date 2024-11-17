// Sales Report by Date
var data;
var chartOptions;
var totalRevenue;
var totalProfit;
var totalShippingCost;
var totalItems;

$(document).ready(function() {
	setupButtonEventHandlers("_date", loadSalesReportByDate);
});

function loadSalesReportByDate(period) {
	if (period == "custom") {
		startDate = $("#startDate_date").val();
		endDate = $("#endDate_date").val();
		
		requestURL = contextPath + "reports/sales_by_date/" + startDate + "/" + endDate;
	} else {
		requestURL = contextPath + "reports/sales_by_date/" + period;		
	}
	
	$.get(requestURL, function(responseJSON) {
		prepareChartDataForSalesReportByDate(responseJSON);
		customizeChartForSalesReportByDate(period);
		formatChartData(data, 1, 2);
		drawChartForSalesReportByDate(period);
		setSalesAmount(period, '_date', "Total Orders");
	});
}

function prepareChartDataForSalesReportByDate(responseJSON) {
	data = new google.visualization.DataTable();
	data.addColumn('string', 'Date');
	data.addColumn('number', 'Revenue');
	data.addColumn('number', 'Profit');
	data.addColumn('number', 'Shipping Cost');
	data.addColumn('number', 'Orders');

	totalRevenue = 0.0;
	totalProfit = 0.0;
	totalShippingCost = 0.0;
	totalItems = 0;

	$.each(responseJSON, function(index, reportItem) {
		data.addRows([[reportItem.identifier, reportItem.revenue, reportItem.profit, reportItem.shippingCost, reportItem.ordersCount]]);
		totalRevenue += parseFloat(reportItem.revenue);
		totalProfit += parseFloat(reportItem.profit);
		totalShippingCost += parseFloat(reportItem.shippingCost);
		totalItems += parseInt(reportItem.ordersCount);
	});
}

function customizeChartForSalesReportByDate(period) {
	chartOptions = {
		title: getChartTitle(period),
		height: 360,
		legend: { position: 'top' },
		seriesType: 'bars',
		series: {
			0: { targetAxisIndex: 0, type: 'bars' },
			1: { targetAxisIndex: 0, type: 'bars' },
			2: { targetAxisIndex: 1, type: 'line' , visibleInLegend: false, color: 'transparent' },
			3: { targetAxisIndex: 1, type: 'line' }
		},
		vAxes: {
			0: { title: 'Sales Amount', format: 'currency' },
			1: { title: 'Number of Orders', viewWindow: { min: 0, max: 100 } } // Adjust max based on your data
		}
	};

}

function drawChartForSalesReportByDate() {
	var salesChart = new google.visualization.ComboChart(document.getElementById('chart_sales_by_date'));
	salesChart.draw(data, chartOptions);
}