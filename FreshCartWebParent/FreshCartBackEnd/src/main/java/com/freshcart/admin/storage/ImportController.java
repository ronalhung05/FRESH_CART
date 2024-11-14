package com.freshcart.admin.storage;

import com.freshcart.admin.paging.PagingAndSortingHelper;
import com.freshcart.admin.paging.PagingAndSortingParam;
import com.freshcart.admin.product.ProductService;
import com.freshcart.admin.security.FreshCartUserDetails;
import com.freshcart.admin.storage.export.ImportCsvExporter;
import com.freshcart.admin.storage.export.ImportExcelExporter;
import com.freshcart.admin.user.UserService;
import com.freshcart.common.entity.User;
import com.freshcart.common.entity.product.Product;
import com.freshcart.common.entity.storage.Import;
import com.freshcart.common.exception.ImportNotFoundException;
import com.freshcart.common.exception.ProductNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Controller
public class ImportController {
    private String defaultRedirectURL = "redirect:/imports/page/1?sortField=id&sortDir=asc";
    @Autowired
    private ImportService importService;
    @Autowired
    private ProductService productService;
    @Autowired
    private UserService userService;

    @GetMapping("/imports")
    public String listFirstPage(Model model) {
        return defaultRedirectURL;
    }

    @GetMapping("/imports/page/{pageNum}")
    public String listByPage(
            @PagingAndSortingParam(listName = "listImports", moduleURL = "/imports") PagingAndSortingHelper helper,
            @PathVariable(name = "pageNum") int pageNum
    ) {
        importService.listByPage(pageNum, helper);
        return "storage/import";
    }

    @GetMapping("/imports/detail/{id}")
    public String viewImportDetails(@PathVariable("id") Integer id, Model model,
            RedirectAttributes ra){
        try{
            Import ip = importService.get(id);
            model.addAttribute("import",ip);

            return "storage/import_detail_modal";
        }catch (ImportNotFoundException e){
            ra.addFlashAttribute("message", e.getMessage());

            return defaultRedirectURL;
        }
    }

    @GetMapping("/imports/new")
    public String newImport(@AuthenticationPrincipal FreshCartUserDetails loggedUser, Model model){
        User user = userService.getByEmail(loggedUser.getUsername());
        Import ip = new Import();
        List<Product> listProducts = productService.listAll();

        model.addAttribute("import",ip);
        model.addAttribute("user",user);
        model.addAttribute("listProducts",listProducts);
        model.addAttribute("pageTitle", "Create New Import");

        return "storage/import_form";
    }

    @PostMapping("/imports/save")
    public String saveImport(Import ip,
             @RequestParam(name = "productIds", required = false) String[] detailProductIds,
             @RequestParam(name = "productAmounts", required = false) String[] detailAmounts,
             @RequestParam(name = "productCosts", required = false) String[] detailCosts,
             @AuthenticationPrincipal FreshCartUserDetails loggedUser,
             RedirectAttributes ra) throws ProductNotFoundException {

        importService.setImportDetails(detailProductIds, detailAmounts, detailCosts, ip);

        String userEmail = loggedUser.getUsername();

        importService.save(ip, userEmail);

        ra.addFlashAttribute("message", "The product has been saved successfully.");

        return defaultRedirectURL;
    }

    @GetMapping("/imports/export/csv")
    public void exportToCSV(HttpServletResponse response) throws IOException {
        List<Import> listImports = importService.listAll();
        ImportCsvExporter exporter = new ImportCsvExporter();
        exporter.export(listImports, response);
    }

    @GetMapping("/imports/export/excel")
    public void exportToExcel(HttpServletResponse response) throws IOException {
        List<Import> listImports = importService.listAll();
        ImportExcelExporter exporter = new ImportExcelExporter();
        exporter.export(listImports, response);
    }

}
