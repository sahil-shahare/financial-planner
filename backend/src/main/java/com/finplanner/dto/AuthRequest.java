package com.finplanner.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}

@Data
class AuthResponse {
    private String token;
    public AuthResponse(String token) {
        this.token = token;
    }
}
