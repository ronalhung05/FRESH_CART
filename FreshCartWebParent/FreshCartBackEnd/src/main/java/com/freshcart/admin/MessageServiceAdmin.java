package com.freshcart.admin;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class MessageServiceAdmin {
    private final Map<String, String> messages = new HashMap<>();

    // the path file location
    public MessageServiceAdmin() {
        String currentDir = System.getProperty("user.dir");
        int lastSeparatorIndex = currentDir.lastIndexOf(File.separator); // find the last string after /

        String modifiedPath = currentDir.substring(0, lastSeparatorIndex) + File.separator + "message" + File.separator + "message.csv";
        //replace by message/message.csv

        //System.out.println("Modified file path: " + modifiedPath); // Debugging output
        loadMessagesFromCSV(modifiedPath);
    }

    private void loadMessagesFromCSV(String filePath) {
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] parts = line.split(",", 2); // 2 parts (key message and message value)
                if (parts.length >= 2) {
                    String key = parts[0].trim();
                    String message = parts[1].trim();
                    messages.put(key, message);
                }
            }
        } catch (IOException e) { // don't have file -> showing error at run time
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
