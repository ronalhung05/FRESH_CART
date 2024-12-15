package com.freshcart.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EntityScan({"com.freshcart.common.entity"})
public class FreshCartBackEndApplication {

    public static void main(String[] args) {
        SpringApplication.run(FreshCartBackEndApplication.class, args);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        String passwordToEncode = "12345678";

        String encodedPassword = passwordEncoder.encode(passwordToEncode);

        System.out.println("Encoded Pass: " + encodedPassword);
    }

}
