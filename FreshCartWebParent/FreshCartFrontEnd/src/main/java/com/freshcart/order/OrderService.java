package com.freshcart.order;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.freshcart.checkout.CheckoutInfo;
import com.freshcart.common.entity.Address;
import com.freshcart.common.entity.CartItem;
import com.freshcart.common.entity.Customer;
import com.freshcart.common.entity.order.Order;
import com.freshcart.common.entity.order.OrderDetail;
import com.freshcart.common.entity.order.OrderStatus;
import com.freshcart.common.entity.order.OrderTrack;
import com.freshcart.common.entity.order.PaymentMethod;
import com.freshcart.common.entity.product.Product;
import com.freshcart.common.exception.OrderNotFoundException;


@Service
public class OrderService {
    public static final int ORDERS_PER_PAGE = 5;

    @Autowired
    private OrderRepository repo;

    public Order createOrder(Customer customer, Address address, List<CartItem> cartItems,
                             PaymentMethod paymentMethod, CheckoutInfo checkoutInfo) {
        Order newOrder = new Order();
        newOrder.setOrderTime(new Date());

        if (paymentMethod.equals(PaymentMethod.PAYPAL)) {
            newOrder.setStatus(OrderStatus.PAID);
        } else {
            newOrder.setStatus(OrderStatus.NEW);
        }

        newOrder.setCustomer(customer);
        newOrder.setProductCost(checkoutInfo.getProductCost());
        newOrder.setSubtotal(checkoutInfo.getProductTotal());
        newOrder.setShippingCost(checkoutInfo.getShippingCostTotal());
        newOrder.setTax(0.0f);
        newOrder.setTotal(checkoutInfo.getPaymentTotal());
        newOrder.setPaymentMethod(paymentMethod);
        newOrder.setDeliverDays(checkoutInfo.getDeliverDays());
        newOrder.setDeliverDate(checkoutInfo.getDeliverDate());

        if (address == null) {
            newOrder.copyAddressFromCustomer();
        } else {
            newOrder.copyShippingAddress(address);
        }

        Set<OrderDetail> orderDetails = newOrder.getOrderDetails();

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(newOrder);
            orderDetail.setProduct(product);
            orderDetail.setQuantity(cartItem.getQuantity());
            orderDetail.setUnitPrice(product.getDiscountPrice());
            orderDetail.setProductCost(product.getCost() * cartItem.getQuantity());
            orderDetail.setSubtotal(cartItem.getSubtotal());
            orderDetail.setShippingCost(cartItem.getShippingCost());

            orderDetails.add(orderDetail);
        }

        List<OrderTrack> tracks = new ArrayList<>();

        OrderTrack newTrack = new OrderTrack();
        newTrack.setOrder(newOrder);
        newTrack.setStatus(OrderStatus.NEW);
        newTrack.setNotes(OrderStatus.NEW.defaultDescription());
        newTrack.setUpdatedTime(new Date());
        tracks.add(newTrack);

        if (paymentMethod.equals(PaymentMethod.PAYPAL)) {
            OrderTrack paidTrack = new OrderTrack();
            paidTrack.setOrder(newOrder);
            paidTrack.setStatus(OrderStatus.PAID);
            paidTrack.setNotes(OrderStatus.PAID.defaultDescription());
            paidTrack.setUpdatedTime(new Date());
            tracks.add(paidTrack);
        }

        newOrder.setOrderTracks(tracks);

        return repo.save(newOrder);
    }

    public Page<Order> listForCustomerByPage(Customer customer, int pageNum,
                                             String sortField, String sortDir, String keyword) {
        Sort sort = Sort.by(sortField);
        sort = sortDir.equals("asc") ? sort.ascending() : sort.descending();

        Pageable pageable = PageRequest.of(pageNum - 1, ORDERS_PER_PAGE, sort);

        if (keyword != null) {
            return repo.findAll(keyword, customer.getId(), pageable);
        }

        return repo.findAll(customer.getId(), pageable);
    }

    public Order getOrder(Integer id, Customer customer) {
        return repo.findByIdAndCustomer(id, customer);
    }

    public void setOrderReturnRequested(OrderReturnRequest request, Customer customer)
            throws OrderNotFoundException {
        Order order = repo.findByIdAndCustomer(request.getOrderId(), customer);
        if (order == null) {
            throw new OrderNotFoundException("Order ID " + request.getOrderId() + " not found");
        }

        if (order.isReturnRequested()) return;

        OrderTrack track = new OrderTrack();
        track.setOrder(order);
        track.setUpdatedTime(new Date());
        track.setStatus(OrderStatus.RETURN_REQUESTED);

        String notes = "Reason: " + request.getReason();
        if (!"".equals(request.getNote())) {
            notes += ". " + request.getNote();
        }

        track.setNotes(notes);

        order.getOrderTracks().add(track);
        order.setStatus(OrderStatus.RETURN_REQUESTED);

        repo.save(order);
    }

}
