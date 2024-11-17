package com.freshcart.admin.user.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import com.freshcart.admin.MessageServiceAdmin;
import com.freshcart.admin.security.FreshCartUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
import com.freshcart.admin.paging.PagingAndSortingHelper;
import com.freshcart.admin.paging.PagingAndSortingParam;
import com.freshcart.admin.user.UserNotFoundException;
import com.freshcart.admin.user.UserService;
import com.freshcart.admin.user.export.UserCsvExporter;
import com.freshcart.admin.user.export.UserExcelExporter;
import com.freshcart.admin.user.export.UserPdfExporter;
import com.freshcart.common.entity.Role;
import com.freshcart.common.entity.User;

@Controller
public class UserController {
    private String defaultRedirectURL = "redirect:/users/page/1?sortField=firstName&sortDir=asc";
    @Autowired
    private UserService service;

    @Autowired
    private MessageServiceAdmin messageService;

    @GetMapping("/users")
    public String listFirstPage() {
        return defaultRedirectURL;
    }

    @GetMapping("/users/page/{pageNum}")
    public String listByPage(
            @PagingAndSortingParam(listName = "listUsers", moduleURL = "/users") PagingAndSortingHelper helper,
            @PathVariable(name = "pageNum") int pageNum,
            @AuthenticationPrincipal FreshCartUserDetails loggedUser,
            Model model) {
        model.addAttribute("loggedUser", loggedUser.getUsername());
        service.listByPage(pageNum, helper);
        return "users/users";
    }

    @GetMapping("/users/new")
    public String newUser(Model model) {
        List<Role> listRoles = service.listRoles();

        User user = new User();
        user.setEnabled(true);

        model.addAttribute("user", user);
        model.addAttribute("listRoles", listRoles);
        model.addAttribute("pageTitle", "Create New User");

        return "users/user_form";
    }

    @PostMapping("/users/save")
    public String saveUser(User user, RedirectAttributes redirectAttributes,
                           @RequestParam("image") MultipartFile multipartFile) throws IOException {

        if (!multipartFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            user.setPhotos(fileName);
            User savedUser = service.save(user);

            String uploadDir = "user-photos/" + savedUser.getId();

            AmazonS3Util.removeFolder(uploadDir);
            AmazonS3Util.uploadFile(uploadDir, fileName, multipartFile.getInputStream());
        } else {
            if (user.getPhotos().isEmpty()) user.setPhotos(null);
            service.save(user);
        }
        redirectAttributes.addFlashAttribute("message", messageService.getMessage("USER_SAVE_SUCCESS"));
        return getRedirectURLtoAffectedUser(user);
    }

    private String getRedirectURLtoAffectedUser(User user) {
        String firstPartOfEmail = user.getEmail().split("@")[0];
        return "redirect:/users/page/1?sortField=id&sortDir=asc&keyword=" + firstPartOfEmail;
    }

    @GetMapping("/users/edit/{id}")
    public String editUser(@PathVariable(name = "id") Integer id,
                           Model model,
                           @AuthenticationPrincipal FreshCartUserDetails loggedUser,
                           RedirectAttributes redirectAttributes){
        try {
            User user = service.get(id);
            String loggedUsername = loggedUser.getUsername();
            if(loggedUsername.equals(user.getEmail())){
                return defaultRedirectURL;
            }
            List<Role> listRoles = service.listRoles();

            model.addAttribute("user", user);
            model.addAttribute("pageTitle", "Edit User (ID: " + id + ")");
            model.addAttribute("listRoles", listRoles);

            return "users/user_form";
        } catch (UserNotFoundException ex) {
            redirectAttributes.addFlashAttribute("message", ex.getMessage());
            return defaultRedirectURL;
        }
    }

    @GetMapping("/users/delete/{id}")
    public String deleteUser(@PathVariable(name = "id") Integer id,
                             Model model, @AuthenticationPrincipal FreshCartUserDetails loggedUser,
                             RedirectAttributes redirectAttributes) {
        try {
            String editedUser = service.get(id).getEmail();
            String loggedUsername = loggedUser.getUsername();
            if(loggedUsername.equals(editedUser)){
                return defaultRedirectURL;
            }
            service.delete(id);
            String userPhotosDir = "user-photos/" + id;
            AmazonS3Util.removeFolder(userPhotosDir);

            redirectAttributes.addFlashAttribute("message",
                    messageService.getMessage("USER_DELETE_SUCCESS") + " (ID: " + id + ")");
        } catch (UserNotFoundException ex) {
            redirectAttributes.addFlashAttribute("message", ex.getMessage());
        }

        return defaultRedirectURL;
    }

    @GetMapping("/users/{id}/enabled/{status}")
    public String updateUserEnabledStatus(@PathVariable("id") Integer id, @AuthenticationPrincipal FreshCartUserDetails loggedUser,
                                          @PathVariable("status") boolean enabled, RedirectAttributes redirectAttributes) throws UserNotFoundException {
        String editedUser = service.get(id).getEmail();
        String loggedUsername = loggedUser.getUsername();
        if(loggedUsername.equals(editedUser)){
            return defaultRedirectURL;
        }
        service.updateUserEnabledStatus(id, enabled);
        String message = messageService.getMessage("USER_ENABLE_SUCCESS") + " (ID: " + id + ")";
        if (!enabled) {
            message = messageService.getMessage("USER_DISABLE_SUCCESS") + " (ID: " + id + ")";
        }
        redirectAttributes.addFlashAttribute("message", message);

        return defaultRedirectURL;
    }

    @GetMapping("/users/export/csv")
    public void exportToCSV(HttpServletResponse response) throws IOException {
        List<User> listUsers = service.listAll();
        UserCsvExporter exporter = new UserCsvExporter();
        exporter.export(listUsers, response);
    }

    @GetMapping("/users/export/excel")
    public void exportToExcel(HttpServletResponse response) throws IOException {
        List<User> listUsers = service.listAll();

        UserExcelExporter exporter = new UserExcelExporter();
        exporter.export(listUsers, response);
    }

    @GetMapping("/users/export/pdf")
    public void exportToPDF(HttpServletResponse response) throws IOException {
        List<User> listUsers = service.listAll();

        UserPdfExporter exporter = new UserPdfExporter();
        exporter.export(listUsers, response);
    }
}
