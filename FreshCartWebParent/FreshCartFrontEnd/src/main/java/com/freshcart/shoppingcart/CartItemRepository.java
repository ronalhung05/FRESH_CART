package com.freshcart.shoppingcart;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.freshcart.common.entity.CartItem;
import com.freshcart.common.entity.Customer;
import com.freshcart.common.entity.product.Product;

@Repository
public interface CartItemRepository extends CrudRepository<CartItem, Integer> {
    @Query("SELECT c FROM CartItem c WHERE c.customer = :customer AND c.product.enabled = true AND " +
            "c.product.category.enabled = true AND c.product.brand.enabled = true")
    public List<CartItem> findByCustomer(Customer customer);

    public CartItem findByCustomerAndProduct(Customer customer, Product product);

    @Modifying
    @Query("UPDATE CartItem c SET c.quantity = ?1 WHERE c.customer.id = ?2 AND c.product.id = ?3")
    public void updateQuantity(Integer quantity, Integer customerId, Integer productId);

    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.customer.id = ?1 AND c.product.id = ?2")
    public void deleteByCustomerAndProduct(Integer customerId, Integer productId);

    @Modifying
    @Query("DELETE CartItem c WHERE c.customer.id = ?1")
    public void deleteByCustomer(Integer customerId);

    @Query("SELECT c FROM CartItem c WHERE c.customer.id = ?1 AND c.product.id = ?2")
    public CartItem findByCustomerAndProduct(Integer customerId, Integer productId);
}
