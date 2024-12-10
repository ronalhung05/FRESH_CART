package com.freshcart.admin.product;

import java.io.IOException;
import java.util.List;

import com.freshcart.admin.MessageServiceAdmin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.freshcart.admin.FileUploadUtil;
import com.freshcart.admin.brand.BrandService;
import com.freshcart.admin.category.CategoryService;
import com.freshcart.admin.paging.PagingAndSortingHelper;
import com.freshcart.admin.paging.PagingAndSortingParam;
import com.freshcart.admin.security.FreshCartUserDetails;
import com.freshcart.common.entity.Brand;
import com.freshcart.common.entity.Category;
import com.freshcart.common.entity.product.Product;
import com.freshcart.common.exception.ProductNotFoundException;

@Controller
public class ProductController {
    private String defaultRedirectURL = "redirect:/products/page/1?sortField=name&sortDir=asc&categoryId=0";
    @Autowired
    private ProductService productService;
    @Autowired
    private BrandService brandService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private MessageServiceAdmin messageService;

    @GetMapping("/products")
    public String listFirstPage(Model model) {
        return defaultRedirectURL;
    }

    @GetMapping("/products/page/{pageNum}")
    public String listByPage(
            @PagingAndSortingParam(listName = "listProducts", moduleURL = "/products") PagingAndSortingHelper helper,
            @PathVariable(name = "pageNum") int pageNum, Model model,
            Integer categoryId
    ) {

        productService.listByPage(pageNum, helper, categoryId);

        List<Category> listCategories = categoryService.listCategoriesUsedInForm();

        if (categoryId != null) model.addAttribute("categoryId", categoryId);
        model.addAttribute("listCategories", listCategories);

        return "products/products";
    }

    @GetMapping("/products/new")
    public String newProduct(Model model) {
        List<Brand> listBrands = brandService.listAll();

        Product product = new Product();
        product.setEnabled(true);
        product.setInStock(0);

        model.addAttribute("product", product);
        model.addAttribute("listBrands", listBrands);
        model.addAttribute("pageTitle", "Add New Product");
        model.addAttribute("numberOfExistingExtraImages", 0);
        model.addAttribute("moduleURL", "/products/new");

        return "products/product_form";
    }

    @PostMapping("/products/save")
    public String saveProduct(Product product, RedirectAttributes ra,
                              @RequestParam(value = "fileImage", required = false) MultipartFile mainImageMultipart,
                              @RequestParam(value = "extraImage", required = false) MultipartFile[] extraImageMultiparts,
                              @RequestParam(name = "detailIDs", required = false) String[] detailIDs,
                              @RequestParam(name = "detailNames", required = false) String[] detailNames,
                              @RequestParam(name = "detailValues", required = false) String[] detailValues,
                              @RequestParam(name = "imageIDs", required = false) String[] imageIDs,
                              @RequestParam(name = "imageNames", required = false) String[] imageNames,
                              @AuthenticationPrincipal FreshCartUserDetails loggedUser
    ) throws IOException {

        if (!loggedUser.hasRole("Admin") && !loggedUser.hasRole("Editor")) {
            if (loggedUser.hasRole("Salesperson")) {
                productService.saveProductPrice(product);
                ra.addFlashAttribute("message", "The product has been saved successfully.");
                return defaultRedirectURL;
            }
        }

        ProductSaveHelper.setMainImageName(mainImageMultipart, product);
        ProductSaveHelper.setExistingExtraImageNames(imageIDs, imageNames, product);
        ProductSaveHelper.setNewExtraImageNames(extraImageMultiparts, product);
        ProductSaveHelper.setProductDetails(detailIDs, detailNames, detailValues, product);

        Product savedProduct = productService.save(product);

        ProductSaveHelper.saveUploadedImages(mainImageMultipart, extraImageMultiparts, savedProduct);

        ProductSaveHelper.deleteExtraImagesWeredRemovedOnForm(product);

        ra.addFlashAttribute("message", messageService.getMessage("SUCCESS_PRODUCT"));
//        ra.addFlashAttribute("message", "The product has been saved successfully.");

        return defaultRedirectURL;
    }


    @GetMapping("/products/{id}/enabled/{status}")
    public String updateProductEnabledStatus(@PathVariable("id") Integer id,
                                             @PathVariable("status") boolean enabled, RedirectAttributes redirectAttributes) {
        productService.updateProductEnabledStatus(id, enabled);
        String status = enabled ? "enabled" : "disabled";
        String message = "The Product ID " + id + " has been " + status;
        redirectAttributes.addFlashAttribute("message", message);

        return defaultRedirectURL;
    }

//    @GetMapping("/products/delete/{id}")
//    public String deleteProduct(@PathVariable(name = "id") Integer id,
//                                Model model, RedirectAttributes redirectAttributes) {
//        try {
//            productService.delete(id);
//            String productExtraImagesDir = "../product-images/" + id + "/extras";
//            String productImagesDir = "../product-images/" + id;
//
//            FileUploadUtil.removeDir(productExtraImagesDir);
//            FileUploadUtil.removeDir(productImagesDir);
//
//            redirectAttributes.addFlashAttribute("message",
//                    "The product ID " + id + " has been deleted successfully");
//        } catch (ProductNotFoundException ex) {
//            redirectAttributes.addFlashAttribute("message", ex.getMessage());
//        }
//
//        return defaultRedirectURL;
//    }

    @GetMapping("/products/edit/{id}")
    public String editProduct(@PathVariable("id") Integer id, Model model,
                              RedirectAttributes ra, @AuthenticationPrincipal FreshCartUserDetails loggedUser) {
        try {
            Product product = productService.get(id);
            List<Brand> listBrands = brandService.listAll();
            Integer numberOfExistingExtraImages = product.getImages().size();

            boolean isReadOnlyForSalesperson = false;

            if (!loggedUser.hasRole("Admin") && !loggedUser.hasRole("Editor")) {
                if (loggedUser.hasRole("Salesperson")) {
                    isReadOnlyForSalesperson = true;
                }
            }

            model.addAttribute("isReadOnlyForSalesperson", isReadOnlyForSalesperson);
            model.addAttribute("product", product);
            model.addAttribute("listBrands", listBrands);
            model.addAttribute("pageTitle", "Edit Product (ID: " + id + ")");
            model.addAttribute("numberOfExistingExtraImages", numberOfExistingExtraImages);

            return "products/product_form";

        } catch (ProductNotFoundException e) {
            ra.addFlashAttribute("message", e.getMessage());

            return defaultRedirectURL;
        }
    }

    @GetMapping("/products/detail/{id}")
    public String viewProductDetails(@PathVariable("id") Integer id, Model model,
                                     RedirectAttributes ra) {
        try {
            Product product = productService.get(id);
            model.addAttribute("product", product);

            return "products/product_detail_modal";

        } catch (ProductNotFoundException e) {
            ra.addFlashAttribute("message", e.getMessage());

            return defaultRedirectURL;
        }
    }
}
