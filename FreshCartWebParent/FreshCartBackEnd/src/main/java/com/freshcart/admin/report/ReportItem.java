package com.freshcart.admin.report;

import java.util.Objects;

public class ReportItem {
    private String identifier;
    private float revenue;
    private float profit;
    private int ordersCount;
    private int productsCount;

    public ReportItem() {
    }

    public ReportItem(String identifier) {
        this.identifier = identifier;
    }

    public ReportItem(String identifier, float revenue, float profit) {
        this.identifier = identifier;
        this.revenue = revenue;
        this.profit = profit;
    }

    public ReportItem(String identifier, float revenue, float profit, int productsCount) {
        super();
        this.identifier = identifier;
        this.revenue = revenue;
        this.profit = profit;
        this.productsCount = productsCount;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public float getRevenue() {
        return revenue;
    }

    public void setRevenue(float revenue) {
        this.revenue = revenue;
    }

    public float getProfit() {
        return profit;
    }

    public void setProfit(float profit) {
        this.profit = profit;
    }

    public int getOrdersCount() {
        return ordersCount;
    }

    public void setOrdersCount(int ordersCount) {
        this.ordersCount = ordersCount;
    }

    @Override
    public int hashCode() {
        return Objects.hash(identifier);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null) return false;
        if (getClass() != obj.getClass()) return false;
        ReportItem other = (ReportItem) obj;
        return Objects.equals(identifier, other.identifier);
    }

    public void addRevenue(float amount) {
        this.revenue += amount;

    }

    public void addProfit(float amount) {
        this.profit += amount;
    }

    public void increaseOrdersCount() {
        this.ordersCount++;
    }

    public int getProductsCount() {
        return productsCount;
    }

    public void setProductsCount(int productsCount) {
        this.productsCount = productsCount;
    }

    public void increaseProductsCount(int count) {
        this.productsCount += count;
    }

}
