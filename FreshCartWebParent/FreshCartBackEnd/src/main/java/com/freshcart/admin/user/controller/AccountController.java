package com.freshcart.admin.user.controller;

import java.io.IOException;

import com.freshcart.admin.MessageServiceAdmin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.freshcart.admin.FileUploadUtil;
import com.freshcart.admin.security.FreshCartUserDetails;
import com.freshcart.admin.user.UserService;
import com.freshcart.common.entity.User;

@Controller
public class AccountController {

    @Autowired
    private UserService service;

    @Autowired
    private MessageServiceAdmin messageService;

    @GetMapping("/account")
    public String viewDetails(@AuthenticationPrincipal FreshCartUserDetails loggedUser,
                              Model model) {
        String email = loggedUser.getUsername();
        User user = service.getByEmail(email);
        model.addAttribute("user", user);

        return "users/account_form";

    }

    @PostMapping("/account/update")
    public String saveDetails(User user, RedirectAttributes redirectAttributes,
                              @AuthenticationPrincipal FreshCartUserDetails loggedUser,
                              @RequestParam("image") MultipartFile multipartFile) throws IOException {

        if (!multipartFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            user.setPhotos(fileName);
            User savedUser = service.updateAccount(user);

            String uploadDir = "user-photos/" + savedUser.getId();

            FileUploadUtil.cleanDir(uploadDir);
            FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);

        } else {
            if (user.getPhotos().isEmpty()) user.setPhotos(null);
            service.updateAccount(user);
        }

        loggedUser.setFirstName(user.getFirstName());
        loggedUser.setLastName(user.getLastName());

        redirectAttributes.addFlashAttribute("message", messageService.getMessage("ACCOUNT_UPDATE_SUCCESS"));

        return "redirect:/account";
    }
}
