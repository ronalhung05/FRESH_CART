package com.freshcart.common.entity.order;

import javax.persistence.*;

import com.freshcart.common.entity.Category;
import com.freshcart.common.entity.IdBasedEntity;
import com.freshcart.common.entity.product.Product;

@Entity
@Table(name = "order_details")
public class OrderDetail extends IdBasedEntity {
    @Column(nullable = false)
    private int quantity;
    @Column(nullable = false)
    private float productCost;
    @Column(nullable = false)
    private float shippingCost;
    @Column(nullable = false)
    private float unitPrice;
    @Column(nullable = false)
    private float subtotal;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    public OrderDetail() {
    }

    public OrderDetail(String categoryName, int quantity, float productCost, float shippingCost, float subtotal) {
        this.product = new Product();
        this.product.setCategory(new Category(categoryName));
        this.quantity = quantity;
        this.productCost = productCost;
        this.shippingCost = shippingCost;
        this.subtotal = subtotal;
    }

    public OrderDetail(int quantity, String productName, float productCost, float shippingCost, float subtotal) {
        this.product = new Product(productName);
        this.quantity = quantity;
        this.productCost = productCost;
        this.shippingCost = shippingCost;
        this.subtotal = subtotal;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public float getProductCost() {
        return productCost;
    }

    public void setProductCost(float productCost) {
        this.productCost = productCost;
    }

    public float getShippingCost() {
        return shippingCost;
    }

    public void setShippingCost(float shippingCost) {
        this.shippingCost = shippingCost;
    }

    public float getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(float unitPrice) {
        this.unitPrice = unitPrice;
    }

    public float getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(float subtotal) {
        this.subtotal = subtotal;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }
}
