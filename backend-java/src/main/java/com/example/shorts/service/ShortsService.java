package com.example.shorts.service;

import com.example.shorts.model.ShortComment;
import com.example.shorts.model.ShortLike;
import com.example.shorts.model.ShortModel;
import com.example.shorts.repository.ShortCommentRepository;
import com.example.shorts.repository.ShortLikeRepository;
import com.example.shorts.repository.ShortRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ShortsService {

    private final ShortRepository shortRepository;
    private final ShortCommentRepository commentRepository;
    private final ShortLikeRepository likeRepository;
    private final FileStorageService fileStorageService;

    @Value("${app.shorts.max-duration-seconds:60}")
    private int maxDurationSeconds;

    public ShortsService(ShortRepository shortRepository,
                         ShortCommentRepository commentRepository,
                         ShortLikeRepository likeRepository,
                         FileStorageService fileStorageService) {
        this.shortRepository = shortRepository;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
        this.fileStorageService = fileStorageService;
    }

    public ShortModel createShort(String title,
                                  String description,
                                  String uploadedBy,
                                  String uploaderId,
                                  Double duration,
                                  boolean isVertical,
                                  String tags,
                                  MultipartFile thumbnail,
                                  MultipartFile videoFile) throws IOException {
        if (duration == null || duration <= 0 || duration > maxDurationSeconds) {
            throw new IllegalArgumentException("Duration must be between 1 and " + maxDurationSeconds + " seconds.");
        }
        if (!isVertical) {
            throw new IllegalArgumentException("Shorts must be uploaded in vertical orientation.");
        }

        String thumbnailUrl = fileStorageService.saveThumbnail(thumbnail);
        String videoUrl = fileStorageService.saveVideo(videoFile);
        List<String> tagsList = parseTags(tags);

        ShortModel model = ShortModel.builder()
                .title(title)
                .description(description)
                .thumbnailUrl(thumbnailUrl)
                .videoUrl(videoUrl)
                .uploadedBy(uploadedBy)
                .uploaderId(uploaderId)
                .duration(duration)
                .views(0)
                .likes(0)
                .commentsCount(0)
                .tags(tagsList)
                .build();

        return shortRepository.save(model);
    }

    public List<ShortModel> getFeed(int page, int size) {
        return shortRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))).getContent();
    }

    public Optional<ShortModel> findById(String id) {
        return shortRepository.findById(id);
    }

    public ShortModel incrementView(String id) {
        ShortModel model = shortRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Short not found"));
        model.setViews(Optional.ofNullable(model.getViews()).orElse(0) + 1);
        return shortRepository.save(model);
    }

    public long toggleLike(String id, String userId) {
        if (!shortRepository.existsById(id)) {
            throw new IllegalArgumentException("Short not found");
        }
        Optional<ShortLike> existing = likeRepository.findByShortIdAndUserId(id, userId);
        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
        } else {
            likeRepository.save(ShortLike.builder().shortId(id).userId(userId).build());
        }
        long count = likeRepository.countByShortId(id);
        ShortModel model = shortRepository.findById(id).orElseThrow();
        model.setLikes((int) count);
        shortRepository.save(model);
        return count;
    }

    public int commentOnShort(String id, String commenterId, String commenterName, String comment) {
        ShortModel model = shortRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Short not found"));
        ShortComment shortComment = ShortComment.builder()
                .shortId(id)
                .commenterId(commenterId)
                .commenterName(commenterName)
                .comment(comment)
                .build();
        commentRepository.save(shortComment);
        model.setCommentsCount(Optional.ofNullable(model.getCommentsCount()).orElse(0) + 1);
        shortRepository.save(model);
        return model.getCommentsCount();
    }

    public List<ShortComment> getComments(String shortId) {
        return commentRepository.findByShortIdOrderByCreatedAtDesc(shortId);
    }

    public void deleteShort(String id, String userId) {
        ShortModel model = shortRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Short not found"));
        if (!model.getUploaderId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to delete this short");
        }
        shortRepository.delete(model);
    }

    public List<ShortModel> getUserShorts(String uploaderId) {
        return shortRepository.findByUploaderIdOrderByCreatedAtDesc(uploaderId);
    }

    public List<ShortModel> searchShorts(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getFeed(0, 20);
        }
        String regex = ".*" + Pattern.quote(query.trim()) + ".*";
        return shortRepository.findByTitleRegexOrDescriptionRegexOrTagsRegexOrderByCreatedAtDesc(regex, regex, regex);
    }

    public List<ShortModel> getRecommendedShorts() {
        List<ShortModel> all = shortRepository.findAll(Sort.by(Sort.Direction.DESC, "views", "likes", "createdAt"));
        return all.stream().limit(12).collect(Collectors.toList());
    }

    private List<String> parseTags(String tags) {
        if (tags == null || tags.isBlank()) return new ArrayList<>();
        return List.of(tags.split(","))
                .stream()
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .collect(Collectors.toList());
    }
}
