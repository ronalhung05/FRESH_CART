package com.freshcart.admin.report;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.freshcart.admin.order.OrderRepository;
import com.freshcart.admin.storage.ImportRepository;
import com.freshcart.common.entity.order.Order;

@Service
public class MasterOrderReportService extends AbstractReportService {
    @Autowired
    private OrderRepository repo;
    @Autowired
    private ImportRepository importRepo;

    protected List<ReportItem> getReportDataByDateRangeInternal(Date startTime, Date endTime, ReportType reportType) {
        List<Order> listOrders = repo.findByOrderTimeBetween(startTime, endTime);
        printRawData(listOrders);

        List<ReportItem> listReportItems = createReportData(startTime, endTime, reportType);

        System.out.println();

        calculateSalesForReportData(listOrders, listReportItems);

        //printReportData(listReportItems);

        return listReportItems;
    }

    private void calculateSalesForReportData(List<Order> listOrders, List<ReportItem> listReportItems) {
        for (Order order : listOrders) {
            String orderDateString = dateFormatter.format(order.getOrderTime());

            ReportItem reportItem = new ReportItem(orderDateString);

            float revenue = order.getTotal();
            float profit  = order.getSubtotal() - order.getProductCost();
            float shipping = order.getShippingCost();

            int itemIndex = listReportItems.indexOf(reportItem);

            if (itemIndex >= 0) {
                reportItem = listReportItems.get(itemIndex);
                reportItem.addRevenue(revenue);
                reportItem.addProfit(profit);
                reportItem.increaseOrdersCount();
                reportItem.addShipping(shipping);
            }
        }
    }

    private void printReportData(List<ReportItem> listReportItems) {
        listReportItems.forEach(item -> {
            System.out.printf("%s, %10.2f, %10.2f, %d \n", item.getIdentifier(), item.getRevenue(),
                    item.getProfit(), item.getOrdersCount());
        });

    }

    private List<ReportItem> createReportData(Date startTime, Date endTime, ReportType reportType) {
        List<ReportItem> listReportItems = new ArrayList<>();

        Calendar startDate = Calendar.getInstance();
        startDate.setTime(startTime);

        Calendar endDate = Calendar.getInstance();
        endDate.setTime(endTime);

        Date currentDate = startDate.getTime();
        String dateString = dateFormatter.format(currentDate);

        listReportItems.add(new ReportItem(dateString));

        do {
            if (reportType.equals(ReportType.DAY)) {
                startDate.add(Calendar.DAY_OF_MONTH, 1);
            } else if (reportType.equals(ReportType.MONTH)) {
                startDate.add(Calendar.MONTH, 1);
            }

            currentDate = startDate.getTime();
            dateString = dateFormatter.format(currentDate);

            listReportItems.add(new ReportItem(dateString));

        } while (startDate.before(endDate));

        return listReportItems;
    }

    private void printRawData(List<Order> listOrders) {
        listOrders.forEach(order -> {
            System.out.printf("%-3d | %s | %10.2f | %10.2f \n",
                    order.getId(), order.getOrderTime(), order.getTotal(), order.getProductCost());
        });
    }

    public float getCurrentMonthRevenue() {
        // Lấy ngày đầu và cuối của tháng hiện tại
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1); // Ngày đầu tháng
        Date startTime = calendar.getTime();
        
        calendar.add(Calendar.MONTH, 1);
        calendar.add(Calendar.DAY_OF_MONTH, -1); // Ngày cuối tháng
        Date endTime = calendar.getTime();
        
        // Lấy danh sách đơn hàng trong tháng
        List<Order> orders = repo.findByOrderTimeBetween(startTime, endTime);
        
        // Tính tổng doanh thu
        float totalRevenue = 0;
        for (Order order : orders) {
            totalRevenue += order.getTotal();
        }
        
        return totalRevenue;
    }

    public int getCurrentMonthOrders() {
        // Lấy ngày đầu và cuối của tháng hiện tại
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1); // Ngày đầu tháng
        Date startTime = calendar.getTime();
        
        calendar.add(Calendar.MONTH, 1);
        calendar.add(Calendar.DAY_OF_MONTH, -1); // Ngày cuối tháng
        Date endTime = calendar.getTime();
        
        // Đếm số lượng đơn hàng trong tháng
        List<Order> orders = repo.findByOrderTimeBetween(startTime, endTime);
        return orders.size();
    }

    public float getTotalImportCostForCurrentMonth() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        Date startTime = calendar.getTime();

        calendar.add(Calendar.MONTH, 1);
        calendar.add(Calendar.DAY_OF_MONTH, -1);
        Date endTime = calendar.getTime();

        Float totalImportCost = importRepo.getTotalImportCostForCurrentMonth(startTime, endTime);
        return totalImportCost != null ? totalImportCost : 0;
    }

}
