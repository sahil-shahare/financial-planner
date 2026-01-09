package com.finplanner.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Document(collection = "plans")
public class Plan {

    @Id
    private String id;

    private String userId;

    private String type; // SIP, SWP, GOAL, RETIREMENT

    private Map<String, Object> inputs;

    private Map<String, Object> results;

    private LocalDateTime createdAt = LocalDateTime.now();
}
