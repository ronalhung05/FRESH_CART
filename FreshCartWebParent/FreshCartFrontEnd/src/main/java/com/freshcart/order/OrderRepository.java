package com.freshcart.order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.freshcart.common.entity.Customer;
import com.freshcart.common.entity.order.Order;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderDetails od JOIN od.product p "
            + "WHERE o.customer.id = ?2 "
            + "AND (p.name LIKE %?1% OR o.status LIKE %?1%)")
    public Page<Order> findAll(String keyword, Integer customerId, Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.customer.id = ?1")
    public Page<Order> findAll(Integer customerId, Pageable pageable);

    public Order findByIdAndCustomer(Integer id, Customer customer);

    @Query("SELECT COALESCE(SUM(od.quantity), 0) FROM OrderDetail od WHERE od.order.id = :orderId AND od.product.id = :productId")
    int getProductQuantityInOrder(@Param("orderId") Integer orderId, @Param("productId") Integer productId);
}
