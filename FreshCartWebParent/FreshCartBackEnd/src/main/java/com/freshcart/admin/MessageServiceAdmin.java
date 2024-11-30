package com.freshcart.admin;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class MessageServiceAdmin {
    private final Map<String, String> messages = new HashMap<>();

    // the path file location
    public MessageServiceAdmin() {
        String resourcePath = "message/message_backend.csv"; // Relative path inside resources
        loadMessagesFromCSV(resourcePath);
    }

    private void loadMessagesFromCSV(String filePath) {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(filePath)) {
            if (inputStream == null) {
                throw new RuntimeException("File not found: " + filePath);
            }
            try (BufferedReader br = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
                String line;
                while ((line = br.readLine()) != null) {
                    String[] parts = line.split(",", 2); // 2 parts (key message and message value)
                    if (parts.length >= 2) {
                        String key = parts[0].trim();
                        String message = parts[1].trim();
                        messages.put(key, message);
                    }
                }
            }
        } catch (IOException e) {
            String errorMessage = "Error while accessing the CSV file at " + filePath + ": " + e.getMessage();
            System.err.println(errorMessage);
            throw new RuntimeException(errorMessage, e);
        }
    }


    public String getMessage(String key) {
        if (!messages.containsKey(key)) {
            throw new RuntimeException("Key '" + key + "' not found in messages."); // not found key
        }
        return messages.get(key);
    }
}