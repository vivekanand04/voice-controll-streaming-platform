package com.example.shorts.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @PostConstruct
    public void init() {
        if (jwtSecret == null || jwtSecret.isEmpty()) {
            throw new IllegalStateException("JWT secret is not configured. Set ACCESS_TOKEN_SECRET environment variable.");
        }
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("Failed to parse JWT token: " + e.getMessage(), e);
        }
    }

    public boolean validateToken(String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                return false;
            }
            parseClaims(token.trim());
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    private String getClaimAsString(Claims claims, String claimName) {
        Object claimValue = claims.get(claimName);
        return claimValue != null ? claimValue.toString() : null;
    }

    public String getUserIdFromToken(String token) {
        Claims claims = parseClaims(token);

        String userId = claims.getSubject();
        if (userId != null && !userId.isBlank()) {
            return userId;
        }

        userId = getClaimAsString(claims, "userId");
        if (userId != null && !userId.isBlank()) {
            return userId;
        }

        userId = getClaimAsString(claims, "id");
        if (userId != null && !userId.isBlank()) {
            return userId;
        }

        userId = getClaimAsString(claims, "_id");
        if (userId != null && !userId.isBlank()) {
            return userId;
        }

        userId = getClaimAsString(claims, "username");
        if (userId != null && !userId.isBlank()) {
            return userId;
        }

        return getClaimAsString(claims, "email");
    }

    public String buildToken(String subject, long milliseconds) {
        SecretKey key = getSigningKey();
        Date now = new Date();
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + milliseconds))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
