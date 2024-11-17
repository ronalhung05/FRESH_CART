package com.freshcart;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

@Service
public class MessageServiceFrontend {
    private final Map<String, String> messages = new HashMap<>();

    public MessageServiceFrontend() {
        loadMessagesFromCSV();
    }

    private void loadMessagesFromCSV() {
        try {
            ClassPathResource resource = new ClassPathResource("message/message.csv");
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(resource.getInputStream()))) {
                String line;
                while ((line = br.readLine()) != null) {
                    String[] parts = line.split(",", 2);
                    if (parts.length >= 2) {
                        String key = parts[0].trim();
                        String message = parts[1].trim();
                        messages.put(key, message);
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error loading messages from CSV: " + e.getMessage(), e);
        }
    }

    public String getMessage(String key) {
        if (!messages.containsKey(key)) {
            throw new RuntimeException("Key '" + key + "' not found in messages.");
        }
        return messages.get(key);
    }
}
