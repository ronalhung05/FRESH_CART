package com.freshcart;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.freshcart.common.entity.Customer;
import com.freshcart.customer.CustomerService;

@Component
public class ControllerHelper {
    @Autowired
    private CustomerService customerService;

    public Customer getAuthenticatedCustomer(HttpServletRequest request) {
        String email = Utility.getEmailOfAuthenticatedCustomer(request);
        return customerService.getCustomerByEmail(email);
    }
}
