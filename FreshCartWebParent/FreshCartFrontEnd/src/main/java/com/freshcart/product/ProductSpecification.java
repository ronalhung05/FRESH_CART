package com.freshcart.product;

import com.freshcart.common.entity.Brand;
import com.freshcart.common.entity.Brand_;
import com.freshcart.common.entity.Category;
import com.freshcart.common.entity.product.Product;
import com.freshcart.common.entity.product.Product_;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> hasCategory(Category category) {
        return (root, query, cb) -> {
            if (category == null) {
                return null;
            }

            // Nếu là category con (không có subcategories)
            if (category.getChildren() == null || category.getChildren().isEmpty()) {
                return cb.equal(root.get(Product_.category), category);
            }

            // Nếu là category cha (có subcategories)
            String categoryIdMatch = "-" + String.valueOf(category.getId()) + "-";
            return cb.like(root.get(Product_.category).get("allParentIDs"),
                    "%" + categoryIdMatch + "%");
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

            if (minPrice == null) {
                return cb.or(
                        cb.le(root.get(Product_.price), maxPrice),
                        cb.and(
                                cb.gt(root.get(Product_.discountPercent), 0),
                                cb.le(discountedPrice, maxPrice)
                        )
                );
            }

            if (maxPrice == null) {
                return cb.or(
                        cb.ge(root.get(Product_.price), minPrice),
                        cb.and(
                                cb.gt(root.get(Product_.discountPercent), 0),
                                cb.ge(discountedPrice, minPrice)
                        )
                );
            }

            return cb.or(
                    cb.between(root.get(Product_.price), minPrice, maxPrice),
                    cb.and(
                            cb.gt(root.get(Product_.discountPercent), 0),
                            cb.and(
                                    cb.ge(discountedPrice, minPrice),
                                    cb.le(discountedPrice, maxPrice)
                            )
                    )
            );
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

            float minPrice, maxPrice;
            switch (priceRange) {
                case "UNDER_50":
                    return cb.or(
                            cb.lt(root.get(Product_.price), 50f),
                            cb.and(
                                    cb.gt(root.get(Product_.discountPercent), 0),
                                    cb.lt(discountedPrice, 50f)
                            )
                    );
                case "50_TO_100":
                    minPrice = 50f;
                    maxPrice = 100f;
                    break;
                case "100_TO_200":
                    minPrice = 100f;
                    maxPrice = 200f;
                    break;
                case "OVER_200":
                    return cb.or(
                            cb.gt(root.get(Product_.price), 200f),
                            cb.and(
                                    cb.gt(root.get(Product_.discountPercent), 0),
                                    cb.gt(discountedPrice, 200f)
                            )
                    );
                default:
                    return null;
            }

            return cb.or(
                    cb.between(root.get(Product_.price), minPrice, maxPrice),
                    cb.and(
                            cb.gt(root.get(Product_.discountPercent), 0),
                            cb.and(
                                    cb.ge(discountedPrice, minPrice),
                                    cb.le(discountedPrice, maxPrice)
                            )
                    )
            );
        };
    }

    public static Sort getSort(String sortOption) {
        switch (sortOption) {
            case "HIGH_TO_LOW":
                return Sort.by(Sort.Direction.DESC, "finalPrice");
            case "MOST_SOLD":
                return Sort.by(Sort.Direction.DESC, "soldCount");
            case "HIGH_RATING":
                return Sort.by(Sort.Direction.DESC, "averageRating");
            case "LOW_TO_HIGH":
            default:
                return Sort.by(Sort.Direction.ASC, "finalPrice");
        }
    }
}