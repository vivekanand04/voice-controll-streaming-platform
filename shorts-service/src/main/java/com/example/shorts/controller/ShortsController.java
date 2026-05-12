package com.example.shorts.controller;

import com.example.shorts.dto.ApiResponse;
import com.example.shorts.model.ShortModel;
import com.example.shorts.service.ShortsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shorts")
@CrossOrigin(origins = "${app.cors.allowed-origins}", allowCredentials = "true")
@Validated
public class ShortsController {

    private final ShortsService shortsService;

    public ShortsController(ShortsService shortsService) {
        this.shortsService = shortsService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<ShortModel>> uploadShort(
            HttpServletRequest request,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam(required = false) String tags,
            @RequestParam Double duration,
            @RequestParam boolean isVertical,
            @RequestPart MultipartFile thumbnail,
            @RequestPart MultipartFile videoFile
    ) throws IOException {
        String userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>(401, null, "Authorization token required."));
        }
        // In this microservice we only have userId subject from JWT.
        ShortModel created = shortsService.createShort(title, description, "Creator", userId, duration, isVertical, tags, thumbnail, videoFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(201, created, "Short uploaded successfully"));
    }

    @GetMapping("/feed")
    public ResponseEntity<ApiResponse<List<ShortModel>>> getFeed(@RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "6") int size) {
        List<ShortModel> feed = shortsService.getFeed(page, size);
        return ResponseEntity.ok(new ApiResponse<>(200, feed, "Shorts feed loaded"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShortModel>> getShort(@PathVariable String id) {
        return shortsService.findById(id)
                .map(shortModel -> ResponseEntity.ok(new ApiResponse<>(200, shortModel, "Short found")))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(404, null, "Short not found")));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse<Map<String, Object>>> likeShort(HttpServletRequest request, @PathVariable String id) {
        String userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>(401, null, "Authorization token required."));
        }
        long totalLikes = shortsService.toggleLike(id, userId);
        Map<String, Object> payload = new HashMap<>();
        payload.put("likes", totalLikes);
        payload.put("id", id);
        return ResponseEntity.ok(new ApiResponse<>(200, payload, "Short like toggled"));
    }

    @PostMapping("/{id}/comment")
    public ResponseEntity<ApiResponse<Map<String, Object>>> commentShort(HttpServletRequest request, @PathVariable String id, @RequestBody Map<String, String> body) {
        String userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>(401, null, "Authorization token required."));
        }
        String comment = body.get("comment");
        if (comment == null || comment.isBlank()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(400, null, "Comment text is required."));
        }
        int commentsCount = shortsService.commentOnShort(id, userId, "Creator", comment);
        Map<String, Object> payload = new HashMap<>();
        payload.put("commentsCount", commentsCount);
        payload.put("id", id);
        return ResponseEntity.ok(new ApiResponse<>(200, payload, "Comment added"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteShort(HttpServletRequest request, @PathVariable String id) {
        String userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse<>(401, null, "Authorization token required."));
        }
        shortsService.deleteShort(id, userId);
        return ResponseEntity.ok(new ApiResponse<>(200, null, "Short deleted successfully"));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ShortModel>>> getUserShorts(@PathVariable String userId) {
        return ResponseEntity.ok(new ApiResponse<>(200, shortsService.getUserShorts(userId), "User shorts loaded"));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<ApiResponse<ShortModel>> incrementView(@PathVariable String id) {
        ShortModel updated = shortsService.incrementView(id);
        return ResponseEntity.ok(new ApiResponse<>(200, updated, "View count incremented"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ShortModel>>> searchShorts(@RequestParam String q) {
        return ResponseEntity.ok(new ApiResponse<>(200, shortsService.searchShorts(q), "Search results"));
    }

    @GetMapping("/recommended")
    public ResponseEntity<ApiResponse<List<ShortModel>>> getRecommended() {
        return ResponseEntity.ok(new ApiResponse<>(200, shortsService.getRecommendedShorts(), "Recommended shorts"));
    }

    private String getUserId(HttpServletRequest request) {
        Object attribute = request.getAttribute("userId");
        return attribute != null ? attribute.toString() : null;
    }
}
