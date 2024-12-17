package com.freshcart.admin;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

import com.freshcart.admin.order.OrderService;
import com.freshcart.admin.setting.SettingService;
import com.freshcart.common.entity.order.Order;
import com.freshcart.common.entity.setting.Setting;

@Controller
public class MainController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private SettingService settingService;

    @GetMapping("")
    public String viewHomePage(Model model, HttpServletRequest request) {
        List<Order> top5RecentOrders = orderService.findTop5RecentOrders();
        model.addAttribute("recentOrders", top5RecentOrders);

        loadCurrencySettings(request);
        model.addAttribute("moduleURL", "/");
        return "index";
    }

    @GetMapping("/login")
    public String viewLoginPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            return "login";
        }

        return "redirect:/";
    }

    private void loadCurrencySettings(HttpServletRequest request) {
    List<Setting> currencySettings = settingService.getCurrencySettings();
    for (Setting setting : currencySettings) {
        request.setAttribute(setting.getKey(), setting.getValue());
    }
}


//    @ModelAttribute("moduleURL")
//    public String getModuleURL(HttpServletRequest request) {
//        // Lấy đường dẫn và bỏ context path
//        String path = request.getRequestURI().substring(request.getContextPath().length());
//        String moduleURL = "/";
//
//        System.out.println("Debug Info:");
//        System.out.println("Original URI: " + request.getRequestURI());
//        System.out.println("Context Path: " + request.getContextPath());
//        System.out.println("Processed Path: " + path);
//        System.out.println("Request Method: " + request.getMethod());
//
//        // Xử lý Users
//        if (path.startsWith("/users")) {
//            if (path.endsWith("/new")) {
//                moduleURL = "/users/new";
//                System.out.println("Matched /users/new pattern");
//            } else {
//                moduleURL = "/users";
//                System.out.println("Matched /users pattern");
//            }
//        }
//        // Xử lý Categories
//        else if (path.startsWith("/categories")) {
//            if (path.endsWith("/new")) {
//                moduleURL = "/categories/new";
//            } else {
//                moduleURL = "/categories";
//            }
//        }
//        // Xử lý Brands
//        else if (path.startsWith("/brands")) {
//            if (path.endsWith("/new")) {
//                moduleURL = "/brands/new";
//            } else {
//                moduleURL = "/brands";
//            }
//        }
//        // Xử lý Products
//        else if (path.startsWith("/products")) {
//            if (path.endsWith("/new")) {
//                moduleURL = "/products/new";
//            } else {
//                moduleURL = "/products";
//            }
//        }
//        // Xử lý các menu đơn
//        else if (path.startsWith("/customers")) {
//            moduleURL = "/customers";
//        } else if (path.startsWith("/shipping_rates")) {
//            moduleURL = "/shipping_rates";
//        } else if (path.startsWith("/orders")) {
//            moduleURL = "/orders";
//        } else if (path.startsWith("/reports")) {
//            moduleURL = "/reports";
//        } else if (path.startsWith("/reviews")) {
//            moduleURL = "/reviews";
//        } else if (path.startsWith("/settings")) {
//            moduleURL = "/settings";
//        } else if (path.equals("/")) {
//            moduleURL = "/";
//        }
//
//        System.out.println("Final ModuleURL: " + moduleURL);
//        return moduleURL;
//    }
}
