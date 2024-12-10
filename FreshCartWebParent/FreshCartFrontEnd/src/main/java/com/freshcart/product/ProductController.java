package com.freshcart.product;

import com.freshcart.ControllerHelper;
import com.freshcart.brand.BrandService;
import com.freshcart.category.CategoryService;
import com.freshcart.common.entity.Brand;
import com.freshcart.common.entity.Category;
import com.freshcart.common.entity.Customer;
import com.freshcart.common.entity.Review;
import com.freshcart.common.entity.product.Product;
import com.freshcart.common.exception.CategoryNotFoundException;
import com.freshcart.common.exception.ProductNotFoundException;
import com.freshcart.review.ReviewService;
import com.freshcart.review.vote.ReviewVoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Controller
public class ProductController {
    @Autowired
    private ProductService productService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private ReviewService reviewService;
    @Autowired
    private ReviewVoteService voteService;
    @Autowired
    private ControllerHelper controllerHelper;
    @Autowired
    private BrandService brandService;

    private static final int PRODUCTS_PER_PAGE = 18; // Cố định số sản phẩm mỗi trang

    @GetMapping("/category/{category_alias}")
    public String viewCategory(@PathVariable("category_alias") String alias,
                             @RequestParam(defaultValue = "1") int pageNum,
                             @RequestParam(required = false) String brands,
                             @RequestParam(required = false) Integer rating,
                             @RequestParam(required = false) Float minPrice,
                             @RequestParam(required = false) Float maxPrice,
                             @RequestParam(required = false) String priceRange,
                             @RequestParam(defaultValue = "LOW_TO_HIGH") String sort,
                             Model model,
                             HttpServletRequest request) {
        try {
            alias = normalizeUrl(alias);
            Category category = categoryService.getCategory(alias);
            List<Category> listParents = categoryService.getCategoryParents(category);
            List<Brand> listBrands = brandService.listAll();
            List<Category> listCategories = categoryService.listHierarchicalCategories();

            // Xử lý category hierarchy
            if (listParents.size() > 0) {
                model.addAttribute("mainCategory", listParents.get(0));
                if (listParents.size() > 1) {
                    model.addAttribute("subCategory", listParents.get(1));
                }
            }

            // Xử lý filters
            List<String> brandNames = brands != null ?
                    Arrays.asList(brands.split(",")) : new ArrayList<>();

            Specification<Product> spec = ProductSpecification.hasCategory(category);

            if (!brandNames.isEmpty()) {
                spec = spec.and(ProductSpecification.hasBrands(brandNames));
            }

            if (rating != null) {
                spec = spec.and(ProductSpecification.hasRating(rating));
            }

            if (priceRange != null) {
                spec = spec.and(ProductSpecification.hasPriceRange(priceRange));
            } else if (minPrice != null || maxPrice != null) {
                spec = spec.and(ProductSpecification.hasPriceBetween(minPrice, maxPrice));
            }

            // Xử lý phân trang và sắp xếp
            Sort sortOption = ProductSpecification.getSort(sort);
            Pageable pageable = PageRequest.of(pageNum - 1, PRODUCTS_PER_PAGE, sortOption);
            Page<Product> pageProducts = productService.listByPage(spec, pageable, category.getId());

            // Add attributes to model
            model.addAttribute("totalPages", pageProducts.getTotalPages());
            model.addAttribute("totalItems", pageProducts.getTotalElements());
            model.addAttribute("currentPage", pageNum);
            model.addAttribute("listProducts", pageProducts.getContent());
            model.addAttribute("listBrands", listBrands);
            model.addAttribute("category", category);
            model.addAttribute("listCategoryParents", listParents);
            model.addAttribute("selectedBrands", brandNames);
            model.addAttribute("pageTitle", category.getName());
            model.addAttribute("currentSort", sort);
            model.addAttribute("listCategories", listCategories);

            if (request.getHeader("X-Requested-With") != null) {
                return "product/product_fragment :: productList";
            }

            return "product/products_by_category";
        } catch (CategoryNotFoundException e) {
            return "error/404";
        }
    }

    @GetMapping("/p/{product_alias}")
    public String viewProductDetail(@PathVariable("product_alias") String alias, Model model,
                                    HttpServletRequest request) {

        try {
            Product product = productService.getProduct(alias);
            List<Category> listCategoryParents = categoryService.getCategoryParents(product.getCategory());
            Page<Review> listReviews = reviewService.list3MostVotedReviewsByProduct(product);
            List<Category> listCategories = categoryService.listHierarchicalCategories();

            Customer customer = controllerHelper.getAuthenticatedCustomer(request);

            if (customer != null) {
                boolean customerReviewed = reviewService.didCustomerReviewProduct(customer, product.getId());
                voteService.markReviewsVotedForProductByCustomer(listReviews.getContent(), product.getId(), customer.getId());

                if (customerReviewed) {
                    model.addAttribute("customerReviewed", customerReviewed);
                } else {
                    boolean customerCanReview = reviewService.canCustomerReviewProduct(customer, product.getId());
                    model.addAttribute("customerCanReview", customerCanReview);
                }
            }

            model.addAttribute("listCategoryParents", listCategoryParents);
            model.addAttribute("product", product);
            model.addAttribute("listReviews", listReviews);
            model.addAttribute("pageTitle", product.getShortName());
            model.addAttribute("listCategories", listCategories);
            
            return "product/product_detail";
        } catch (ProductNotFoundException e) {
            return "error/404";
        }
    }

    @GetMapping("/search")
    public String searchFirstPage(@RequestParam(required = false) String keyword, Model model) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return "redirect:/";
        }
        return searchByPage(keyword, 1, model);
    }

    @GetMapping("/search/page/{pageNum}")
    public String searchByPage(@RequestParam(required = false) String keyword,
                               @PathVariable("pageNum") int pageNum,
                               Model model) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return "redirect:/";
        }

        try {
            keyword = keyword.trim();
            Page<Product> pageProducts = productService.search(keyword, pageNum);
            List<Product> listProducts = pageProducts.getContent();
            List<Category> listCategories = categoryService.listHierarchicalCategories();

            model.addAttribute("currentPage", pageNum);
            model.addAttribute("totalPages", pageProducts.getTotalPages());
            model.addAttribute("totalItems", pageProducts.getTotalElements());
            model.addAttribute("pageTitle", keyword + " - Search Result");
            model.addAttribute("keyword", keyword);
            model.addAttribute("searchKeyword", keyword);
            model.addAttribute("listProducts", listProducts);
            model.addAttribute("listCategories", listCategories);
            
            return "product/search_result";
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("message", "An error occurred while searching");
            return "product/search_result";
        }
    }
    
    @GetMapping("/new-products")
    public String viewNewProducts(Model model) {
        List<Product> listProducts = productService.listNewProducts();
        List<Category> listCategories = categoryService.listHierarchicalCategories();
        model.addAttribute("listProducts", listProducts);
        model.addAttribute("listCategories", listCategories);
        return "product/new_products";
    }

    @GetMapping("/promotions")
    public String viewPromotions(Model model) {
        List<Product> listProducts = productService.listSpecialOffers();
        List<Category> listCategories = categoryService.listHierarchicalCategories();
        model.addAttribute("listProducts", listProducts);
        model.addAttribute("listCategories", listCategories);
        return "product/promotions";
    }

    @GetMapping("/best-sellers") 
    public String viewBestSellers(Model model) {
        List<Product> listProducts = productService.listBestSellingProducts(34);
        List<Category> listCategories = categoryService.listHierarchicalCategories();
        model.addAttribute("listProducts", listProducts);
        model.addAttribute("listCategories", listCategories);
        return "product/best_sellers";
    }


    private String normalizeUrl(String url) {
        if (url == null) return null;
        return url.replaceAll("//+", "/")
                .replaceAll("^/+|/+$", "")
                .replaceAll("[^a-zA-Z0-9-_/]", "");
    }
}
