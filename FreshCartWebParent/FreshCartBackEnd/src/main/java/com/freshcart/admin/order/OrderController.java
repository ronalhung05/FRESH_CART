package com.freshcart.admin.order;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import com.freshcart.common.exception.ProductNotFoundException;
import com.freshcart.common.exception.ProductOutOfStockException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.freshcart.admin.paging.PagingAndSortingHelper;
import com.freshcart.admin.paging.PagingAndSortingParam;
import com.freshcart.admin.security.FreshCartUserDetails;
import com.freshcart.admin.setting.SettingService;
import com.freshcart.admin.product.ProductService;
import com.freshcart.common.entity.Country;
import com.freshcart.common.entity.order.Order;
import com.freshcart.common.entity.order.OrderDetail;
import com.freshcart.common.entity.order.OrderStatus;
import com.freshcart.common.entity.order.OrderTrack;
import com.freshcart.common.entity.product.Product;
import com.freshcart.common.entity.setting.Setting;
import com.freshcart.common.exception.OrderNotFoundException;

@Controller
public class OrderController {
    private String defaultRedirectURL = "redirect:/orders/page/1?sortField=orderTime&sortDir=desc";

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private SettingService settingService;

    @GetMapping("/orders")
    public String listFirstPage() {
        return defaultRedirectURL;
    }

    @GetMapping("/orders/page/{pageNum}")
    public String listByPage(
            @PagingAndSortingParam(listName = "listOrders", moduleURL = "/orders") PagingAndSortingHelper helper,
            @PathVariable(name = "pageNum") int pageNum,
            HttpServletRequest request,
            @AuthenticationPrincipal FreshCartUserDetails loggedUser) {

        orderService.listByPage(pageNum, helper);
        loadCurrencySetting(request);

        if (!loggedUser.hasRole("Admin") && !loggedUser.hasRole("Salesperson") && loggedUser.hasRole("Shipper")) {
            return "orders/orders_shipper";
        }

        return "orders/orders";
    }

    private void loadCurrencySetting(HttpServletRequest request) {
        List<Setting> currencySettings = settingService.getCurrencySettings();

        for (Setting setting : currencySettings) {
            request.setAttribute(setting.getKey(), setting.getValue());
        }
    }

    @GetMapping("/orders/detail/{id}")
    public String viewOrderDetails(@PathVariable("id") Integer id, Model model,
                                   RedirectAttributes ra, HttpServletRequest request,
                                   @AuthenticationPrincipal FreshCartUserDetails loggedUser) {
        try {
            Order order = orderService.get(id);
            loadCurrencySetting(request);

            boolean isVisibleForAdminOrSalesperson = false;

            if (loggedUser.hasRole("Admin") || loggedUser.hasRole("Salesperson")) {
                isVisibleForAdminOrSalesperson = true;
            }

            model.addAttribute("isVisibleForAdminOrSalesperson", isVisibleForAdminOrSalesperson);
            model.addAttribute("order", order);

            return "orders/order_details_modal";
        } catch (OrderNotFoundException ex) {
            ra.addFlashAttribute("message", ex.getMessage());
            return defaultRedirectURL;
        }

    }

    @GetMapping("/orders/delete/{id}")
    public String deleteOrder(@PathVariable("id") Integer id, Model model, RedirectAttributes ra) {
        try {
            orderService.delete(id);
            ra.addFlashAttribute("message", "The order ID " + id + " has been deleted.");
        } catch (OrderNotFoundException ex) {
            ra.addFlashAttribute("message", ex.getMessage());
        }

        return defaultRedirectURL;
    }

    @GetMapping("/orders/edit/{id}")
    public String editOrder(@PathVariable("id") Integer id, Model model, RedirectAttributes ra,
                            HttpServletRequest request) {
        try {
            Order order = orderService.get(id);

            List<Country> listCountries = orderService.listAllCountries();

            model.addAttribute("pageTitle", "Edit Order (ID: " + id + ")");
            model.addAttribute("order", order);
            model.addAttribute("listCountries", listCountries);

            return "orders/order_form";

        } catch (OrderNotFoundException ex) {
            ra.addFlashAttribute("message", ex.getMessage());
            return defaultRedirectURL;
        }

    }

    @PostMapping("/order/save")
    public String saveOrder(Order order, HttpServletRequest request, Model model, RedirectAttributes ra) throws ProductNotFoundException {
        String countryName = request.getParameter("countryName");
        order.setCountry(countryName);

        // Kiểm tra tồn kho sản phẩm trước khi lưu
        Map<Integer, String> stockErrors = checkProductStock(order, request);

        if (stockErrors != null && !stockErrors.isEmpty()) {
            // Chuyển lỗi tồn kho thành chuỗi JSON hoặc danh sách
            ra.addFlashAttribute("stockErrors", stockErrors);
            ra.addFlashAttribute("message", "There are stock errors in the order.");

            return "redirect:/orders/edit/" + order.getId(); // Redirect về trang chỉnh sửa
        }

        // Nếu không có lỗi tồn kho, tiếp tục lưu đơn hàng
        updateProductDetails(order, request);
        updateOrderTracks(order, request);

        orderService.save(order);
        ra.addFlashAttribute("message", "The order ID " + order.getId() + " has been updated successfully");

        return defaultRedirectURL;
    }


    private Map<Integer, String> checkProductStock(Order order, HttpServletRequest request) throws ProductNotFoundException {
        String[] productIds = request.getParameterValues("productId");
        String[] quantities = request.getParameterValues("quantity");
        Map<Integer, String> stockErrors = new HashMap<>();

        for (int i = 0; i < productIds.length; i++) {
            Integer productId = Integer.parseInt(productIds[i]);
            int requestedQuantity = Integer.parseInt(quantities[i]);

            Product product = productService.get(productId);

            int existingOrderQuantity = orderService.getExistingOrderQuantity(order.getId(), productId);

            if (product.getInStock() + existingOrderQuantity < requestedQuantity) {
                stockErrors.put(productId, "Số lượng yêu cầu vượt quá tồn kho cho sản phẩm: " + product.getName());
            }
        }

        return stockErrors.isEmpty() ? null : stockErrors; // Trả về null nếu không có lỗi tồn kho
    }


    private void updateOrderTracks(Order order, HttpServletRequest request) {
        String[] trackIds = request.getParameterValues("trackId");
        String[] trackStatuses = request.getParameterValues("trackStatus");
        String[] trackDates = request.getParameterValues("trackDate");
        String[] trackNotes = request.getParameterValues("trackNotes");

        List<OrderTrack> orderTracks = order.getOrderTracks();
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss");

        for (int i = 0; i < trackIds.length; i++) {
            OrderTrack trackRecord = new OrderTrack();

            Integer trackId = Integer.parseInt(trackIds[i]);
            if (trackId > 0) {
                trackRecord.setId(trackId);
            }

            trackRecord.setOrder(order);
            trackRecord.setStatus(OrderStatus.valueOf(trackStatuses[i]));
            trackRecord.setNotes(trackNotes[i]);

            try {
                trackRecord.setUpdatedTime(dateFormatter.parse(trackDates[i]));
            } catch (ParseException e) {
                e.printStackTrace();
            }

            orderTracks.add(trackRecord);
        }
    }



    private void updateProductDetails(Order order, HttpServletRequest request) {
        String[] productIds = request.getParameterValues("productId");
        String[] quantities = request.getParameterValues("quantity");
        String[] detailIds = request.getParameterValues("detailId");
        String[] productPrices = request.getParameterValues("productPrice");
        String[] productDetailCosts = request.getParameterValues("productDetailCost");
        String[] productSubtotals = request.getParameterValues("productSubtotal");
        String[] productShipCosts = request.getParameterValues("productShipCost");

        Set<OrderDetail> orderDetails = order.getOrderDetails();

        for (int i = 0; i < detailIds.length; i++) {
            System.out.println("Detail ID: " + detailIds[i]);
            System.out.println("\t Product ID: " + productIds[i]);
            System.out.println("\t Cost: " + productDetailCosts[i]);
            System.out.println("\t Quantity: " + quantities[i]);
            System.out.println("\t Subtotal: " + productSubtotals[i]);
            System.out.println("\t Ship cost: " + productShipCosts[i]);

            OrderDetail orderDetail = new OrderDetail();
            Integer detailId = Integer.parseInt(detailIds[i]);
            if (detailId > 0) {
                orderDetail.setId(detailId);
            }

            orderDetail.setOrder(order);
            orderDetail.setProduct(new Product(Integer.parseInt(productIds[i])));
            orderDetail.setProductCost(Float.parseFloat(productDetailCosts[i]) * Integer.parseInt(quantities[i]));
            orderDetail.setSubtotal(Float.parseFloat(productSubtotals[i]));
            orderDetail.setShippingCost(Float.parseFloat(productShipCosts[i]));
            orderDetail.setQuantity(Integer.parseInt(quantities[i]));
            orderDetail.setUnitPrice(Float.parseFloat(productPrices[i]));

            orderDetails.add(orderDetail);

        }

    }

}
