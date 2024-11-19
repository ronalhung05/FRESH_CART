package com.freshcart.security.oauth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

public class CustomerOAuth2User implements OAuth2User {
    private String clientName;
    private String fullName;
    private OAuth2User oauth2User;

    public CustomerOAuth2User(OAuth2User user, String clientName) {
        this.oauth2User = user;
        this.clientName = clientName;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oauth2User.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return oauth2User.getAuthorities();
    }

    @Override
    public String getName() {
        return oauth2User.getAttribute("name");
    }

    public String getEmail() {
        return oauth2User.getAttribute("email");
    }

    public String getFullName() {
        Map<String, Object> attributes = this.getAttributes();

        // Đối với Google
        if (attributes.get("name") != null) {
            return (String) attributes.get("name");
        }

        // Đối với Facebook
        if (attributes.get("given_name") != null) {
            String firstName = (String) attributes.get("given_name");
            String lastName = (String) attributes.get("family_name");
            return firstName + " " + lastName;
        }

        // Trường hợp không có tên, dùng email
        String email = (String) attributes.get("email");
        if (email != null) {
            return email.split("@")[0]; // Lấy phần trước @ của email
        }

        // Trường hợp mặc định
        return "User";
    }

    public String getClientName() {
        return clientName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
