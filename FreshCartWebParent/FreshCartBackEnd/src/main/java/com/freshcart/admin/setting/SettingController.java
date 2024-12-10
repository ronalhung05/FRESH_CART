package com.freshcart.admin.setting;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import com.freshcart.admin.MessageServiceAdmin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.freshcart.admin.AmazonS3Util;
import com.freshcart.common.Constants;
import com.freshcart.common.entity.Currency;
import com.freshcart.common.entity.setting.Setting;

@Controller
public class SettingController {

    @Autowired
    private SettingService service;

    @Autowired
    private CurrencyRepository currencyRepo;

    @Autowired
    private MessageServiceAdmin messageService;
    @GetMapping("/settings")
    public String listAll(@RequestParam(name = "tab", defaultValue = "general") String tab, Model model) {
        List<Setting> listSettings = service.listAllSettings();
        List<Currency> listCurrencies = currencyRepo.findAllByOrderByNameAsc();

        model.addAttribute("listCurrencies", listCurrencies);
        model.addAttribute("currentTab", tab);

        for (Setting setting : listSettings) {
            model.addAttribute(setting.getKey(), setting.getValue());
        }

        model.addAttribute("S3_BASE_URI", Constants.S3_BASE_URI);

        return "settings/settings";
    }

    @PostMapping("/settings/save_general")
    public String saveGeneralSettings(@RequestParam("fileImage") MultipartFile multipartFile,
                                      HttpServletRequest request, RedirectAttributes ra) throws IOException {
        GeneralSettingBag settingBag = service.getGeneralSettings();

        saveSiteLogo(multipartFile, settingBag);
        saveCurrencySymbol(request, settingBag);

        updateSettingValuesFromForm(request, settingBag.list());


        ra.addFlashAttribute("message", messageService.getMessage("GENERAL_SAVE_SUCCESS"));

        return "redirect:/settings?tab=general";
    }

    private void saveSiteLogo(MultipartFile multipartFile, GeneralSettingBag settingBag) throws IOException {
        if (!multipartFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            String value = "/site-logo/" + fileName;
            settingBag.updateSiteLogo(value);

            String uploadDir = "site-logo";
            AmazonS3Util.removeFolder(uploadDir);
            AmazonS3Util.uploadFile(uploadDir, fileName, multipartFile.getInputStream());
        }
    }

    private void saveCurrencySymbol(HttpServletRequest request, GeneralSettingBag settingBag) {
        Integer currencyId = Integer.parseInt(request.getParameter("CURRENCY_ID"));
        Optional<Currency> findByIdResult = currencyRepo.findById(currencyId);

        if (findByIdResult.isPresent()) {
            Currency currency = findByIdResult.get();
            settingBag.updateCurrencySymbol(currency.getSymbol());
        }
    }

    private void updateSettingValuesFromForm(HttpServletRequest request, List<Setting> listSettings) {
        for (Setting setting : listSettings) {
            String value = request.getParameter(setting.getKey());
            if (value != null) {
                setting.setValue(value);
            }
        }

        service.saveAll(listSettings);
    }

    @PostMapping("/settings/save_mail_server")
    public String saveMailServerSetttings(HttpServletRequest request, RedirectAttributes ra) {
        List<Setting> mailServerSettings = service.getMailServerSettings();
        updateSettingValuesFromForm(request, mailServerSettings);

        ra.addFlashAttribute("message", messageService.getMessage("MAIL_SERVER_SAVE_SUCCESS"));

        return "redirect:/settings?tab=mailServer";
    }

    @PostMapping("/settings/save_mail_templates")
    public String saveMailTemplateSetttings(HttpServletRequest request, RedirectAttributes ra) {
        List<Setting> mailTemplateSettings = service.getMailTemplateSettings();
        updateSettingValuesFromForm(request, mailTemplateSettings);

        ra.addFlashAttribute("message", messageService.getMessage("MAIL_TEMPLATE_SAVE_SUCCESS"));

        return "redirect:/settings?tab=mailTemplates";
    }

    @PostMapping("/settings/save_payment")
    public String savePaymentSetttings(HttpServletRequest request, RedirectAttributes ra) {
        List<Setting> paymentSettings = service.getPaymentSettings();
        updateSettingValuesFromForm(request, paymentSettings);

        ra.addFlashAttribute("message", messageService.getMessage("PAYMENT_SAVE_SUCCESS"));

        return "redirect:/settings?tab=payment";
    }
}
