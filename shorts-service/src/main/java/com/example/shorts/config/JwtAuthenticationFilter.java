package com.example.shorts.config;

import com.example.shorts.util.JwtUtils;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.util.Set;

@Component
public class JwtAuthenticationFilter extends GenericFilterBean {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtils jwtUtils;

    private static final Set<String> PROTECTED_PATHS = Set.of(
            "/api/shorts/upload",
            "/api/shorts/", // any path that starts with this and requires authentication
            "/api/shorts/{id}/like",
            "/api/shorts/{id}/comment",
            "/api/shorts/{id}",
            "/api/shorts/user/"
    );

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();
        boolean requiresAuth = isProtectedPath(path, httpRequest.getMethod());

        if (!requiresAuth) {
            chain.doFilter(request, response);
            return;
        }

        String header = httpRequest.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            logger.warn("Missing or invalid Authorization header for path: {}", path);
            httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
            httpResponse.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        String token = header.substring(7).trim();
        
        if (token.isEmpty()) {
            logger.warn("Empty token provided for path: {}", path);
            httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
            httpResponse.getWriter().write("Empty token provided");
            return;
        }

        if (!jwtUtils.validateToken(token)) {
            logger.warn("Token validation failed for path: {} - token: {}", path, token.substring(0, Math.min(20, token.length())) + "...");
            httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
            httpResponse.getWriter().write("Invalid or expired token");
            return;
        }

        try {
            String userId = jwtUtils.getUserIdFromToken(token);
            if (userId == null || userId.isBlank()) {
                logger.warn("Token has no user identifier for path: {}", path);
                httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
                httpResponse.getWriter().write("Token has no user identifier");
                return;
            }
            httpRequest.setAttribute("userId", userId);
            logger.debug("Token validated successfully for userId: {}", userId);
            chain.doFilter(request, response);
        } catch (Exception e) {
            logger.error("Token parsing failed for path: {} - error: {}", path, e.getMessage(), e);
            httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
            httpResponse.getWriter().write("Token parsing failed: " + e.getMessage());
            return;
        }
    }

    private boolean isProtectedPath(String path, String method) {
        if (path.equals("/api/shorts/upload") && method.equalsIgnoreCase("POST")) return true;
        if (path.matches("/api/shorts/[A-Za-z0-9_-]+/(like|comment|view)") && method.equalsIgnoreCase("POST")) return true;
        if (path.matches("/api/shorts/[A-Za-z0-9_-]+") && method.equalsIgnoreCase("DELETE")) return true;
        if (path.matches("/api/shorts/user/.*") && method.equalsIgnoreCase("GET")) return true;
        return false;
    }
}
