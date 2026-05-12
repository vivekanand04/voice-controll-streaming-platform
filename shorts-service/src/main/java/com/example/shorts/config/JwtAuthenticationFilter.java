package com.example.shorts.config;

import com.example.shorts.util.JwtUtils;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.util.Set;

@Component
public class JwtAuthenticationFilter extends GenericFilterBean {

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
            httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
            httpResponse.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        String token = header.substring(7);
        if (!jwtUtils.validateToken(token)) {
            httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
            httpResponse.getWriter().write("Invalid or expired token");
            return;
        }

        Claims claims = jwtUtils.parseClaims(token);
        httpRequest.setAttribute("userId", claims.getSubject());
        chain.doFilter(request, response);
    }

    private boolean isProtectedPath(String path, String method) {
        if (path.equals("/api/shorts/upload") && method.equalsIgnoreCase("POST")) return true;
        if (path.matches("/api/shorts/[A-Za-z0-9_-]+/(like|comment|view)") && method.equalsIgnoreCase("POST")) return true;
        if (path.matches("/api/shorts/[A-Za-z0-9_-]+") && method.equalsIgnoreCase("DELETE")) return true;
        if (path.matches("/api/shorts/user/.*") && method.equalsIgnoreCase("GET")) return true;
        return false;
    }
}
