package com.freshcart.admin.report;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReportRestController {
    @Autowired
    private MasterOrderReportService masterOrderReportService;
    @Autowired
    private OrderDetailReportService orderDetailReportService;

    @GetMapping("/reports/sales_by_date/{period}")
    public List<ReportItem> getReportDataByDatePeriod(@PathVariable("period") String period) {
        System.out.println("Report period: " + period);

        switch (period) {
            case "last_7_days":
                return masterOrderReportService.getReportDataLast7Days(ReportType.DAY);

            case "last_28_days":
                return masterOrderReportService.getReportDataLast28Days(ReportType.DAY);

            case "last_6_months":
                return masterOrderReportService.getReportDataLast6Months(ReportType.MONTH);

            case "last_year":
                return masterOrderReportService.getReportDataLastYear(ReportType.MONTH);

            default:
                return masterOrderReportService.getReportDataLast7Days(ReportType.DAY);
        }

    }

    @GetMapping("/reports/sales_by_date/{startDate}/{endDate}")
    public List<ReportItem> getReportDataByDatePeriod(@PathVariable("startDate") String startDate,
                                                      @PathVariable("endDate") String endDate) throws ParseException {
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
        Date startTime = dateFormatter.parse(startDate);
        Date endTime = dateFormatter.parse(endDate);

        return masterOrderReportService.getReportDataByDateRange(startTime, endTime, ReportType.DAY);
    }

    @GetMapping("/reports/{groupBy}/{startDate}/{endDate}")
    public List<ReportItem> getReportDataByCategoryOrProductDateRange(@PathVariable("groupBy") String groupBy,
                                                                      @PathVariable("startDate") String startDate,
                                                                      @PathVariable("endDate") String endDate) throws ParseException {
        ReportType reportType = ReportType.valueOf(groupBy.toUpperCase());
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
        Date startTime = dateFormatter.parse(startDate);
        Date endTime = dateFormatter.parse(endDate);

        return orderDetailReportService.getReportDataByDateRange(startTime, endTime, reportType);
    }

    @GetMapping("/reports/{groupBy}/{period}")
    public List<ReportItem> getReportDataByCategoryOrProduct(@PathVariable("groupBy") String groupBy,
                                                             @PathVariable("period") String period) {
        ReportType reportType = ReportType.valueOf(groupBy.toUpperCase());

        switch (period) {
            case "last_7_days":
                return orderDetailReportService.getReportDataLast7Days(reportType);

            case "last_28_days":
                return orderDetailReportService.getReportDataLast28Days(reportType);

            case "last_6_months":
                return orderDetailReportService.getReportDataLast6Months(reportType);

            case "last_year":
                return orderDetailReportService.getReportDataLastYear(reportType);

            default:
                return orderDetailReportService.getReportDataLast7Days(reportType);
        }
    }

    @GetMapping("/reports/revenue_by_year/{year}")
    public List<ReportItem> getReportDataByYear(@PathVariable("year") String year) {
        // Convert year string to Date range
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
        Date startTime;
        Date endTime;
        try {
            startTime = dateFormatter.parse(year + "-01-01");
            endTime = dateFormatter.parse(year + "-12-31");
            return masterOrderReportService.getReportDataByDateRange(startTime, endTime, ReportType.MONTH);
        } catch (ParseException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @GetMapping("/reports/current_month_revenue")
    public float getCurrentMonthRevenue() {
        // Logic để tính doanh thu của tháng hiện tại
        // Giả sử bạn có một service để tính toán
        return masterOrderReportService.getCurrentMonthRevenue();
    }

    @GetMapping("/reports/current_month_orders")
    public int getCurrentMonthOrders() {
        // Logic để tính số lượng đơn hàng của tháng hiện tại
        return masterOrderReportService.getCurrentMonthOrders();
    }

    @GetMapping("/reports/current_month_import_cost")
    public float getCurrentMonthImportCost() {
        return masterOrderReportService.getTotalImportCostForCurrentMonth();
    }
}
