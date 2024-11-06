package com.freshcart.shipping;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.freshcart.common.entity.Address;
import com.freshcart.common.entity.Customer;
import com.freshcart.common.entity.ShippingRate;

@Service
public class ShippingRateService {

    @Autowired
    private ShippingRateRepository repo;

    public ShippingRate getShippingRateForCustomer(Customer customer) {
        String state = customer.getState();
        if (state == null || state.isEmpty()) {
            state = customer.getCity();
        }

        return repo.findByCountryAndState(customer.getCountry(), state);
    }

    public ShippingRate getShippingRateForAddress(Address address) {
        String state = address.getState();
        if (state == null || state.isEmpty()) {
            state = address.getCity();
        }

        return repo.findByCountryAndState(address.getCountry(), state);
    }
}
