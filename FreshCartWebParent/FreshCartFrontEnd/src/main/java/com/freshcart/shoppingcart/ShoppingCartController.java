package com.freshcart.shoppingcart;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.freshcart.ControllerHelper;
import com.freshcart.address.AddressService;
import com.freshcart.common.entity.Address;
import com.freshcart.common.entity.CartItem;
import com.freshcart.common.entity.Customer;
import com.freshcart.common.entity.ShippingRate;
import com.freshcart.shipping.ShippingRateService;

@Controller
public class ShoppingCartController {
    @Autowired
    private ControllerHelper controllerHelper;
    @Autowired
    private ShoppingCartService cartService;
    @Autowired
    private AddressService addressService;
    @Autowired
    private ShippingRateService shipService;

    @GetMapping("/cart")
    public String viewCart(Model model, HttpServletRequest request) {
        Customer customer = controllerHelper.getAuthenticatedCustomer(request);
        List<CartItem> cartItems = cartService.listCartItems(customer);

        Integer numberOfProducts = cartService.getNumberOfProducts(customer);
        request.getSession().setAttribute("totalCartItems", numberOfProducts);

        float estimatedTotal = 0.0F;

        for (CartItem item : cartItems) {
            estimatedTotal += item.getSubtotal();
        }

        Address defaultAddress = addressService.getDefaultAddress(customer);
        ShippingRate shippingRate = null;
        boolean usePrimaryAddressAsDefault = false;

        if (defaultAddress != null) {
            shippingRate = shipService.getShippingRateForAddress(defaultAddress);
        } else {
            usePrimaryAddressAsDefault = true;
            shippingRate = shipService.getShippingRateForCustomer(customer);
        }

        model.addAttribute("usePrimaryAddressAsDefault", usePrimaryAddressAsDefault);
        model.addAttribute("shippingSupported", shippingRate != null);
        model.addAttribute("cartItems", cartItems);
        model.addAttribute("estimatedTotal", estimatedTotal);

        return "cart/shopping_cart";
    }
}
