package com.freshcart.shipping;

import org.springframework.data.repository.CrudRepository;

import com.freshcart.common.entity.Country;
import com.freshcart.common.entity.ShippingRate;

public interface ShippingRateRepository extends CrudRepository<ShippingRate, Integer> {

    public ShippingRate findByCountryAndState(Country country, String state);
}
