package com.freshcart.admin.review;

import com.freshcart.admin.MessageServiceAdmin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.freshcart.admin.paging.PagingAndSortingHelper;
import com.freshcart.admin.paging.PagingAndSortingParam;
import com.freshcart.common.entity.Review;
import com.freshcart.common.exception.ReviewNotFoundException;

@Controller
public class ReviewController {
    private String defaultRedirectURL = "redirect:/reviews/page/1?sortField=reviewTime&sortDir=desc";

    @Autowired
    private ReviewService service;
    @Autowired
    private MessageServiceAdmin messageService;

    @GetMapping("/reviews")
    public String listFirstPage(Model model) {
        return defaultRedirectURL;
    }

    @GetMapping("/reviews/page/{pageNum}")
    public String listByPage(
            @PagingAndSortingParam(listName = "listReviews", moduleURL = "/reviews") PagingAndSortingHelper helper,
            @PathVariable(name = "pageNum") int pageNum) {

        service.listByPage(pageNum, helper);

        return "reviews/reviews";
    }

    @GetMapping("/reviews/detail/{id}")
    public String viewReview(@PathVariable("id") Integer id, Model model, RedirectAttributes ra) {
        try {
            Review review = service.get(id);
            model.addAttribute("review", review);

            return "reviews/review_detail_modal";
        } catch (ReviewNotFoundException ex) {
            ra.addFlashAttribute("message", ex.getMessage());
            return defaultRedirectURL;
        }
    }

    @GetMapping("/reviews/edit/{id}")
    public String editReview(@PathVariable("id") Integer id, Model model, RedirectAttributes ra) {
        try {
            Review review = service.get(id);

            model.addAttribute("review", review);
            model.addAttribute("pageTitle", String.format("Edit Review (ID: %d)", id));

            return "reviews/review_form";
        } catch (ReviewNotFoundException ex) {
            ra.addFlashAttribute("message", ex.getMessage());
            return defaultRedirectURL;
        }
    }

    @PostMapping("/reviews/save")
    public String saveReview(Review reviewInForm, RedirectAttributes ra) {
        service.save(reviewInForm);
        ra.addFlashAttribute(messageService.getMessage("REVIEW_UPDATE_SUCCESS") + " (ID: " + reviewInForm.getId() + ")");
        return defaultRedirectURL;
    }

    @GetMapping("/reviews/delete/{id}")
    public String deleteReview(@PathVariable("id") Integer id, RedirectAttributes ra) {
        try {
            service.delete(id);
            ra.addFlashAttribute("message", messageService.getMessage("REVIEW_DELETE_SUCCESS") + " (ID: " + id + ")");
        } catch (ReviewNotFoundException ex) {
            ra.addFlashAttribute("message", ex.getMessage());
        }

        return defaultRedirectURL;
    }
}
