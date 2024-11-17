package com.freshcart.common.entity.storage;

import com.freshcart.common.entity.IdBasedEntity;
import com.freshcart.common.entity.product.Product;

import javax.persistence.*;

@Entity
@Table(name = "import_details")
public class ImportDetail extends IdBasedEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "import_id", nullable = false)
    private Import importField;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "cost", nullable = false)
    private Float cost;

    public Import getImportField() {
        return importField;
    }

    public void setImportField(Import importField) {
        this.importField = importField;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Float getCost() {
        return cost;
    }

    public void setCost(Float cost) {
        this.cost = cost;
    }

    public ImportDetail() {
    }

    public ImportDetail(Product product, Integer quantity, Float cost, Import ip) {
        super();
        this.product = product;
        this.quantity = quantity;
        this.cost = cost;
        this.importField = ip;
    }
    @Override
    public String toString() {
        return "ImportDetail{" +
                "id=" + importField.getId() +
                ", product=" + product +
                ", quantity=" + quantity +
                ", cost=" + cost + "}";
    }
}