package com.freshcart.product;

import com.freshcart.common.entity.Brand;
import com.freshcart.common.entity.Brand_;
import com.freshcart.common.entity.Category;
import com.freshcart.common.entity.order.Order;
import com.freshcart.common.entity.order.OrderDetail;
import com.freshcart.common.entity.order.OrderDetail_;
import com.freshcart.common.entity.order.OrderStatus;
import com.freshcart.common.entity.product.Product;
import com.freshcart.common.entity.product.Product_;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;

import java.util.List;

public class ProductSpecification {
    public static Specification<Product> isBrandAndCategoryEnabled() {
        return (root, query, cb) -> {
            Join<Product, Brand> brandJoin = root.join(Product_.brand);
            return cb.and(
                    cb.isTrue(brandJoin.get("enabled")),
                    cb.isTrue(root.get(Product_.category).get("enabled"))
            );
        };
    }

    public static Specification<Product> hasCategory(Category category) {
        return (root, query, cb) -> {
            if (category == null) {
                return null;
            }

            Join<Product, Brand> brandJoin = root.join(Product_.brand);
            Predicate brandEnabled = cb.isTrue(brandJoin.get("enabled"));

            // Nếu là category con (không có subcategories)
            if (category.getChildren() == null || category.getChildren().isEmpty()) {
                return cb.and(
                    brandEnabled,
                    cb.equal(root.get(Product_.category), category)
                );
            }

            // Nếu là category cha (có subcategories)
            String categoryIdMatch = "-" + String.valueOf(category.getId()) + "-";
            return cb.and(
                brandEnabled,
                cb.like(root.get(Product_.category).get("allParentIDs"),
                        "%" + categoryIdMatch + "%")
            );
        };
    }

    public static Specification<Product> hasBrands(List<String> brandNames) {
        return (root, query, cb) -> {
            if (brandNames == null || brandNames.isEmpty()) {
                return null;
            }
            Join<Product, Brand> brandJoin = root.join(Product_.brand);
            return brandJoin.get(Brand_.name).in(brandNames);
        };
    }

    public static Specification<Product> hasRating(Integer rating) {
        return (root, query, cb) -> {
            if (rating == null) {
                return null;
            }
            return cb.equal(root.get(Product_.averageRating), rating);
        };
    }

    // Lọc theo khoảng giá tùy chỉnh
    public static Specification<Product> hasPriceBetween(Float minPrice, Float maxPrice) {
        return (root, query, cb) -> {
            if (minPrice == null && maxPrice == null) {
                return null;
            }

            // Tính giá sau khuyến mãi: price - (price * discountPercent / 100)
            var discountedPrice = cb.diff(
                    root.get(Product_.price),
                    cb.prod(
                            root.get(Product_.price),
                            cb.quot(
                                    root.get(Product_.discountPercent),
                                    100.0
                            )
                    )
            );

            // Lấy giá cuối cùng (finalPrice)
            var finalPrice = cb.<Number>selectCase()
                    .when(cb.gt(root.get(Product_.discountPercent), 0), discountedPrice)
                    .otherwise(root.get(Product_.price));

            // Áp dụng điều kiện lọc
            if (minPrice == null) {
                return cb.le(finalPrice.as(Float.class), cb.literal(maxPrice));
            } else if (maxPrice == null) {
                return cb.ge(finalPrice.as(Float.class), cb.literal(minPrice));
            } else {
                return cb.between(finalPrice.as(Float.class), cb.literal(minPrice), cb.literal(maxPrice));
            }
        };
    }

    // Lọc theo khoảng giá định sẵn
    public static Specification<Product> hasPriceRange(String priceRange) {
        return (root, query, cb) -> {
            if (priceRange == null) {
                return null;
            }

            // Tính giá sau khuyến mãi
            var discountedPrice = cb.diff(
                    root.get(Product_.price),
                    cb.prod(
                            root.get(Product_.price),
                            cb.quot(
                                    root.get(Product_.discountPercent),
                                    100.0
                            )
                    )
            );

            // Lấy giá cuối cùng (finalPrice)
            var finalPrice = cb.<Number>selectCase()
                    .when(cb.gt(root.get(Product_.discountPercent), 0), discountedPrice)
                    .otherwise(root.get(Product_.price));

            // Áp dụng điều kiện lọc theo khoảng giá
            switch (priceRange) {
                case "UNDER_50":
                    return cb.lt(finalPrice.as(Float.class), cb.literal(50f));
                case "50_TO_100":
                    return cb.between(finalPrice.as(Float.class), cb.literal(50f), cb.literal(100f));
                case "100_TO_200":
                    return cb.between(finalPrice.as(Float.class), cb.literal(100f), cb.literal(200f));
                case "OVER_200":
                    return cb.gt(finalPrice.as(Float.class), cb.literal(200f));
                default:
                    return null;
            }
        };
    }

    public static Sort getSort(String sortOption) {
        switch (sortOption) {
            case "HIGH_TO_LOW":
                return Sort.by(Sort.Direction.DESC, "finalPrice");
            case "MOST_SOLD":
                return Sort.by("id");
            case "HIGH_RATING":
                return Sort.by(Sort.Direction.DESC, "averageRating");
            case "LOW_TO_HIGH":
            default:
                return Sort.by(Sort.Direction.ASC, "finalPrice");
        }
    }

    public static Specification<Product> searchProduct(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.trim().isEmpty()) {
                return cb.conjunction();
            }

            String searchTerm = "%" + keyword.trim().toLowerCase() + "%";

            return cb.and(
                cb.isTrue(root.get(Product_.enabled)),
                cb.like(cb.lower(root.get(Product_.name)), searchTerm)
            );
        };
    }

    public static Specification<Product> hasBrandsAndCategory(List<String> brandNames, Category category) {
        return (root, query, cb) -> {
            if ((brandNames == null || brandNames.isEmpty()) && category == null) {
                return null;
            }

            Join<Product, Brand> brandJoin = root.join(Product_.brand);
            Predicate brandEnabled = cb.isTrue(brandJoin.get("enabled"));

            if (category == null) {
                return cb.and(brandEnabled, brandJoin.get(Brand_.name).in(brandNames));
            }

            Predicate categoryPredicate;
            if (category.getChildren() == null || category.getChildren().isEmpty()) {
                categoryPredicate = cb.equal(root.get(Product_.category), category);
            } else {
                String categoryIdMatch = "-" + category.getId() + "-";
                categoryPredicate = cb.like(root.get(Product_.category).get("allParentIDs"),
                        "%" + categoryIdMatch + "%");
            }

            if (brandNames == null || brandNames.isEmpty()) {
                return cb.and(brandEnabled, categoryPredicate);
            }

            return cb.and(
                brandEnabled,
                categoryPredicate,
                brandJoin.get(Brand_.name).in(brandNames)
            );
        };
    }
    
    
}
