package com.freshcart.address;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.freshcart.common.entity.Address;
import com.freshcart.common.entity.Customer;

@Service
@Transactional
public class AddressService {

    @Autowired
    private AddressRepository repo;

    public List<Address> listAddressBook(Customer customer) {
        return repo.findByCustomer(customer);
    }

    public void save(Address address) {
        repo.save(address);
    }

    public Address get(Integer addressId, Integer customerId) {
        return repo.findByIdAndCustomer(addressId, customerId);
    }

    public void delete(Integer addressId, Integer customerId) {
        repo.deleteByIdAndCustomer(addressId, customerId);
    }

    public void setDefaultAddress(Integer defaultAddressId, Integer customerId) {
        if (defaultAddressId > 0) {
            repo.setDefaultAddress(defaultAddressId);
        }

        repo.setNonDefaultForOthers(defaultAddressId, customerId);
    }

    public Address getDefaultAddress(Customer customer) {
        return repo.findDefaultByCustomer(customer.getId());
    }
}
