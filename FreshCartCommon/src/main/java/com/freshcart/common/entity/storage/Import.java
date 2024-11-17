package com.freshcart.common.entity.storage;

import com.freshcart.common.entity.IdBasedEntity;
import com.freshcart.common.entity.User;
import com.freshcart.common.entity.product.Product;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "import")
public class Import extends IdBasedEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "transaction_time", nullable = false, updatable = false)
    private Date transactionTime;

    @Column(name = "sum_cost", nullable = false)
    private Float sumCost;

    @OneToMany(mappedBy = "importField", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImportDetail> details = new ArrayList<>();

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Date getTransactionTime() {
        return transactionTime;
    }

    public void setTransactionTime(Date transactionTime) {
        this.transactionTime = transactionTime;
    }

    public Float getSumCost() {
        return sumCost;
    }

    public void setSumCost(Float sumCost) {
        this.sumCost = sumCost;
    }

    public List<ImportDetail> getDetails() {
        return details;
    }

    public void setDetails(List<ImportDetail> details) {
        this.details = details;
    }

    public void addDetail(Product product, Integer quantity, Float cost){
        this.details.add(new ImportDetail(product, quantity, cost,this));
    }
    public Import() {
    }

    @Override
    public String toString() {
        return "Import{" +
                "id=" + id +
                ", userId=" + user.getId() +
                ", importDate=" + transactionTime +
                ", sumCost=" + sumCost + "}";
    }

}