package org.example.laptopstore.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import java.util.*;

@RestController
@RequestMapping("/api/ai-chat")
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:5500" })
public class AIChatController {
    private static final Logger logger = LoggerFactory.getLogger(AIChatController.class);

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @PostMapping("/ask")
    public ResponseEntity<?> askAI(@RequestBody Map<String, String> payload) {
        logger.info("Received AI chat request: {}", payload);
        String userQuestion = payload.get("question");
        if (userQuestion == null || userQuestion.isEmpty()) {
            logger.warn("Empty question received");
            return ResponseEntity.badRequest().body(Map.of("answer", "Câu hỏi không hợp lệ."));
        }

        String prompt = "Bạn là chuyên gia tư vấn bán hàng về laptop. Hãy tư vấn cho người dùng về nhu cầu, giá cả và thông số kỹ thuật để khách hàng tìm được sản phẩm phù hợp. "
                +
                "Hãy đưa ra lời khuyên chuyên nghiệp và hữu ích về laptop phù hợp với nhu cầu và ngân sách của khách hàng.\n"
                +
                "Câu hỏi: " + userQuestion;
        String geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

        // RestTemplate with timeout
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000); // 5s
        factory.setReadTimeout(10000); // 10s
        RestTemplate restTemplate = new RestTemplate(factory);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-goog-api-key", geminiApiKey);

        Map<String, Object> body = new HashMap<>();
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(part));
        contents.add(content);
        body.put("contents", contents);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            logger.info("Sending request to Gemini API...");
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(geminiUrl, HttpMethod.POST, request,
                    new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {
                    });
            String answer = "";
            if (response.getBody() != null) {
                @SuppressWarnings("unchecked")
                var candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    @SuppressWarnings("unchecked")
                    var contentMap = (Map<String, Object>) candidates.get(0).get("content");
                    if (contentMap != null) {
                        @SuppressWarnings("unchecked")
                        var parts = (List<Map<String, Object>>) contentMap.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            answer = (String) parts.get(0).get("text");
                        }
                    }
                }
            }
            logger.info("Gemini API response: {}", answer);

            return ResponseEntity.ok(Map.of("answer", answer));
        } catch (Exception e) {
            logger.error("Error when calling Gemini API", e);
            return ResponseEntity.status(500).body(Map.of("answer", "Lỗi khi kết nối Gemini API: " + e.getMessage()));
        }
    }
}
