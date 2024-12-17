package com.freshcart.product;

import com.freshcart.common.entity.Brand;
import com.freshcart.common.entity.Brand_;
import com.freshcart.common.entity.product.Product;
import com.freshcart.common.entity.product.Product_;
import com.freshcart.common.exception.ProductNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.Join;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProductService {
    public static final int PRODUCTS_PER_PAGE = 10;
    public static final int SEARCH_RESULTS_PER_PAGE = 10;

    @Autowired
    private ProductRepository repo;

    public Page<Product> listByCategory(int pageNum, Integer categoryId,
                                        List<String> brandNames, Integer rating,
                                        int pageSize) {
        Specification<Product> spec = Specification.where(null);

        //1
        spec = spec.and(ProductSpecification.isBrandAndCategoryEnabled());

        spec = spec.and((root, query, cb) ->
                cb.isTrue(root.get(Product_.enabled)));

        if (categoryId != null) {
            spec = spec.and((root, query, cb) -> {
                String categoryIdMatch = "-" + String.valueOf(categoryId) + "-";
                return cb.like(root.get(Product_.category).get("allParentIDs"),
                        "%" + categoryIdMatch + "%");
            });
        }

        if (brandNames != null && !brandNames.isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                Join<Product, Brand> brandJoin = root.join(Product_.brand);
                return brandJoin.get(Brand_.name).in(brandNames);
            });
        }

        if (rating != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get(Product_.averageRating), rating));
        }

        Pageable pageable = PageRequest.of(pageNum - 1, pageSize);
        return repo.findAll(spec, pageable);
    }

    public Product getProduct(String alias) throws ProductNotFoundException {
        Product product = repo.findByAlias(alias);
        if (product == null || !product.isEnabled()
                || !product.getBrand().isEnabled()
                || !product.getCategory().isEnabled()) {
            throw new ProductNotFoundException("Product not found or unavailable.");
        }
        return product;
    }


    public Product getProduct(Integer id) throws ProductNotFoundException {
        try {
            Product product = repo.findById(id).get();
            if (!product.isEnabled()
                    || !product.getBrand().isEnabled()
                    || !product.getCategory().isEnabled()) {
                throw new ProductNotFoundException("Product not found or unavailable.");
            }
            return product;
        } catch (NoSuchElementException ex) {
            throw new ProductNotFoundException("Could not find any product with ID " + id);
        }
    }


    public Page<Product> search(String keyword, int pageNum) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return Page.empty();
        }

        Pageable pageable = PageRequest.of(pageNum - 1, SEARCH_RESULTS_PER_PAGE);
        Specification<Product> spec = Specification.where(ProductSpecification.searchProduct(keyword))
                .and(ProductSpecification.isBrandAndCategoryEnabled());
        return repo.findAll(spec, pageable);
    }


    public Page<Product> listByPage(Specification<Product> spec, Pageable pageable, Integer categoryId) {
        if (pageable.getSort().equals(Sort.by("id"))) {
            String categoryIDMatch = "-" + String.valueOf(categoryId) + "-";
            return repo.findAllOrderByMostSold(categoryId, categoryIDMatch, pageable);
        }
        return repo.findAll(spec, pageable);
    }

    public List<Product> listNewProducts() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> page = repo.findNewProducts(pageable);
        List<Product> products = page.getContent();
        System.out.println("Number of new products: " + products.size());
        return products;
    }
    
    public List<Product> listSpecialOffers() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> page = repo.findSpecialOffers(pageable);
        return page.getContent();
    }

     public List<Product> listBestSellingProducts(int limit) {
         Sort sort = Sort.by("id").ascending();
         Pageable pageable = PageRequest.of(0, limit, sort);
         Page<Product> page = repo.findBestSellingProducts(pageable);
         return page.getContent();
     }
}
