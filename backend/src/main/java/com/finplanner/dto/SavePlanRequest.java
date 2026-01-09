package main.java.com.finplanner.dto;

import lombok.Data;

import java.util.Map;

@Data
public class SavePlanRequest {
    private String type;
    private Map<String, Object> inputs;
    private Map<String, Object> results;
}
