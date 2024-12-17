package com.freshcart.admin.brand;

import java.io.IOException;
import java.util.List;

import com.freshcart.admin.brand.export.BrandCsvExporter;
import com.freshcart.admin.brand.export.BrandExcelExporter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.freshcart.admin.AmazonS3Util;
import com.freshcart.admin.category.CategoryService;
import com.freshcart.admin.paging.PagingAndSortingHelper;
import com.freshcart.admin.paging.PagingAndSortingParam;
import com.freshcart.common.entity.Brand;
import com.freshcart.common.entity.Category;

import javax.servlet.http.HttpServletResponse;

@Controller
public class BrandController {
    private String defaultRedirectURL = "redirect:/brands/page/1?sortField=name&sortDir=asc";
    @Autowired
    private BrandService brandService;
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/brands")
    public String listFirstPage() {
        return defaultRedirectURL;
    }

    @GetMapping("/brands/page/{pageNum}")
    public String listByPage(
            @PagingAndSortingParam(listName = "listBrands", moduleURL = "/brands") PagingAndSortingHelper helper,
            @PathVariable(name = "pageNum") int pageNum
    ) {
        brandService.listByPage(pageNum, helper);
        return "brands/brands";
    }

    @GetMapping("/brands/new")
    public String newBrand(Model model) {
        List<Category> listCategories = categoryService.listCategoriesUsedInForm();

        model.addAttribute("listCategories", listCategories);
        model.addAttribute("brand", new Brand());
        model.addAttribute("pageTitle", "Create New Brand");
        model.addAttribute("moduleURL", "/brands/new");

        return "brands/brand_form";
    }

    @PostMapping("/brands/save")
    public String saveBrand(Brand brand, @RequestParam("fileImage") MultipartFile multipartFile,
                            RedirectAttributes ra) throws IOException {
        if (!multipartFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            brand.setLogo(fileName);

            Brand savedBrand = brandService.save(brand);
            String uploadDir = "brand-logos/" + savedBrand.getId();

            AmazonS3Util.removeFolder(uploadDir);
            AmazonS3Util.uploadFile(uploadDir, fileName, multipartFile.getInputStream());
        } else {
            brandService.save(brand);
        }

        ra.addFlashAttribute("message", "The brand has been saved successfully.");
        return defaultRedirectURL;
    }

    @GetMapping("/brands/edit/{id}")
    public String editBrand(@PathVariable(name = "id") Integer id, Model model,
                            RedirectAttributes ra) {
        try {
            Brand brand = brandService.get(id);
            List<Category> listCategories = categoryService.listCategoriesUsedInForm();

            model.addAttribute("brand", brand);
            model.addAttribute("listCategories", listCategories);
            model.addAttribute("pageTitle", "Edit Brand (ID: " + id + ")");

            return "brands/brand_form";
        } catch (BrandNotFoundException ex) {
            ra.addFlashAttribute("message", ex.getMessage());
            return defaultRedirectURL;
        }
    }

    @GetMapping("/brands/export/csv")
    public void exportToCSV(HttpServletResponse response) throws IOException {
        List<Brand> listBrands = brandService.listAll();
        BrandCsvExporter exporter = new BrandCsvExporter();
        exporter.export(listBrands, response);
    }

    @GetMapping("/brands/export/excel")
    public void exportToExcel(HttpServletResponse response) throws IOException {
        List<Brand> listBrands = brandService.listAll();
        BrandExcelExporter exporter = new BrandExcelExporter();
        exporter.export(listBrands, response);
    }

    @GetMapping("/brands/{id}/enabled/{status}")
    public String updateBrandEnabledStatus(@PathVariable("id") Integer id,
                              @PathVariable("status") boolean enabled,
                              RedirectAttributes redirectAttributes) {
        brandService.updateBrandEnabledStatus(id, enabled);
        String status = enabled ? "enabled" : "disabled";
        String message = "The category ID " + id + " has been " + status;
        redirectAttributes.addFlashAttribute("message", message);
        return defaultRedirectURL;
    }
}
