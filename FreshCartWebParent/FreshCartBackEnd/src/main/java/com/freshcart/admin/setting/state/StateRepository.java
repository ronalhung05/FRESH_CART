package com.freshcart.admin.setting.state;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.freshcart.common.entity.Country;
import com.freshcart.common.entity.State;

public interface StateRepository extends CrudRepository<State, Integer> {

    public List<State> findByCountryOrderByNameAsc(Country country);
}
