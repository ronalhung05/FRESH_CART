package com.freshcart.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.freshcart.common.entity.product.Product;

public interface ProductRepository extends JpaRepository<Product, Integer>, 
                                         JpaSpecificationExecutor<Product> {

    @Query("SELECT p FROM Product p WHERE p.enabled = true "
            + "AND (p.category.id = ?1 OR p.category.allParentIDs LIKE %?2%)"
            + " ORDER BY p.name ASC")
    public Page<Product> listByCategory(Integer categoryId, String categoryIDMatch, Pageable pageable);

    public Product findByAlias(String alias);

    @Query("Update Product p SET p.averageRating = COALESCE((SELECT AVG(r.rating) FROM Review r WHERE r.product.id = ?1), 0),"
            + " p.reviewCount = (SELECT COUNT(r.id) FROM Review r WHERE r.product.id =?1) "
            + "WHERE p.id = ?1")
    @Modifying
    public void updateReviewCountAndAverageRating(Integer productId);

    // Lấy sản phẩm mới nhất
    @Query("SELECT p FROM Product p JOIN p.brand b JOIN p.category c " +
            "WHERE p.enabled = true AND b.enabled = true AND c.enabled = true " +
            "ORDER BY p.createdTime DESC")
    Page<Product> findNewProducts(Pageable pageable);

    // Lấy sản phẩm khuyến mãi
    @Query("SELECT p FROM Product p JOIN p.brand b JOIN p.category c " +
            "WHERE p.enabled = true AND b.enabled = true AND c.enabled = true " +
            "AND p.discountPercent > 0 ORDER BY p.discountPercent DESC")
    Page<Product> findSpecialOffers(Pageable pageable);

    // Find Best Selling Products
    @Query("SELECT p FROM Product p JOIN p.brand b JOIN p.category c " +
            "JOIN OrderDetail od ON p.id = od.product.id " +
            "JOIN Order o ON od.order.id = o.id " +
            "WHERE p.enabled = true AND b.enabled = true AND c.enabled = true " +
            "AND o.status = 'DELIVERED' " +
            "GROUP BY p.id " +
            "ORDER BY SUM(od.quantity) DESC")
    Page<Product> findBestSellingProducts(Pageable pageable);

    @Query("SELECT p FROM Product p " +
           "LEFT JOIN OrderDetail od ON p.id = od.product.id " +
           "LEFT JOIN od.order o " +
           "WHERE p.enabled = true " +
           "AND (p.category.id = ?1 OR p.category.allParentIDs LIKE %?2%) " +
           "GROUP BY p " +
           "ORDER BY COALESCE(SUM(CASE WHEN o.status = 'DELIVERED' THEN od.quantity ELSE 0 END), 0) DESC")
    Page<Product> findAllOrderByMostSold(Integer categoryId, String categoryIDMatch, Pageable pageable);

}
