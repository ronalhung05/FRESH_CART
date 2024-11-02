package com.shopme.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EntityScan({"com.shopme.common.entity"})
public class ShopmeBackEndApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShopmeBackEndApplication.class, args);
		PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // Contraseña a codificar
        String passwordToEncode = "esemio123";

        // Codificar la contraseña
        String encodedPassword = passwordEncoder.encode(passwordToEncode);

        // Imprimir la contraseña codificada
        System.out.println("Contraseña esemio123 codificada es: " + encodedPassword);
	}

}
