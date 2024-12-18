package com.freshcart.admin.product;

public class ProductDTO {
    private String name;
    private String imagePath;
    private float price;
    private float cost;
    private int in_stock;

    public ProductDTO(String name, String imagePath, float price, float cost, int in_stock) {
        this.name = name;
        this.imagePath = imagePath;
        this.price = price;
        this.cost = cost;
        this.in_stock = in_stock;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public float getCost() {
        return cost;
    }

    public void setCost(float cost) {
        this.cost = cost;
    }

    public int getInStock() { return in_stock;}

    public void setInStock(int in_stock) { this.in_stock = in_stock;}

}
