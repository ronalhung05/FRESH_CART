package com.freshcart.setting;

import org.springframework.data.repository.CrudRepository;

import com.freshcart.common.entity.Currency;

public interface CurrencyRepository extends CrudRepository<Currency, Integer> {

}
