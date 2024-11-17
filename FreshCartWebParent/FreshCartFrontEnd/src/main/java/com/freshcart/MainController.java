package com.freshcart;

import com.freshcart.category.CategoryService;
import com.freshcart.common.entity.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class MainController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("")
    public String viewHomePage(Model model) {
        List<Category> listCategories = categoryService.listHierarchicalCategories();
        model.addAttribute("listCategories", listCategories);

        return "index";
    }

    @GetMapping("/login")
    public String viewLoginPage() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            return "login";
        }

        return "redirect:/";
    }
}
