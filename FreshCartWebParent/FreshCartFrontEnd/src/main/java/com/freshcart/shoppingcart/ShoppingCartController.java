package com.freshcart.shoppingcart;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.freshcart.ControllerHelper;
import com.freshcart.address.AddressService;
import com.freshcart.category.CategoryService;
import com.freshcart.common.entity.Address;
import com.freshcart.common.entity.CartItem;
import com.freshcart.common.entity.Category;
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
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/cart")
    public String viewCart(Model model, HttpServletRequest request) {
        Customer customer = controllerHelper.getAuthenticatedCustomer(request);
        List<CartItem> cartItems = cartService.listCartItems(customer);
        List<Category> listCategories = categoryService.listHierarchicalCategories();
        

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
        model.addAttribute("listCategories", listCategories);
        return "cart/shopping_cart";
    }

    @GetMapping("/cart/get-quantity/{productId}")
    public ResponseEntity<Integer> getQuantityInCart(@PathVariable("productId") Integer productId,
                                               HttpServletRequest request) {
        Customer customer = controllerHelper.getAuthenticatedCustomer(request);
        if (customer == null) {
            return ResponseEntity.ok(0);
        }
        
        CartItem item = cartService.findCartItem(productId, customer);
        return ResponseEntity.ok(item != null ? item.getQuantity() : 0);
    }
}
