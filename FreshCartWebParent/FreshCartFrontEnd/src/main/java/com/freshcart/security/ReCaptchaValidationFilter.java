package com.freshcart.security;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

public class ReCaptchaValidationFilter extends OncePerRequestFilter {

    private final String recaptchaSecretKey = "6LcXA4gqAAAAAOaeXfXY2nshJ7p35IcCPHLE_DXP";
    private final AntPathRequestMatcher requestMatcher = new AntPathRequestMatcher("/login", "POST");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (requestMatcher.matches(request)) {
            String recaptchaResponse = request.getParameter("g-recaptcha-response");
            System.out.println("reCAPTCHA response: " + recaptchaResponse); // Log dữ liệu từ client

            if (recaptchaResponse == null || !verifyReCaptcha(recaptchaResponse)) {
                System.out.println("Invalid reCAPTCHA for request: " + request.getRequestURL()); // Log nếu reCAPTCHA không hợp lệ
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid reCAPTCHA");
                return;
            }
            System.out.println("Valid reCAPTCHA for request: " + request.getRequestURL()); // Log nếu reCAPTCHA hợp lệ
        }

        filterChain.doFilter(request, response);
    }

    private boolean verifyReCaptcha(String response) {
        String verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("secret", recaptchaSecretKey);
        requestBody.add("response", response);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            Map<String, Object> recaptchaResponse = restTemplate.postForObject(verifyUrl, requestEntity, Map.class);
            System.out.println("reCAPTCHA verification response: " + recaptchaResponse); // Log the response
            return recaptchaResponse != null && Boolean.TRUE.equals(recaptchaResponse.get("success"));
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
