package com.example.shorts.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "shorts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShortModel {
    @Id
    private String id;

    @NotBlank
    private String title;

    private String description;

    @NotBlank
    private String videoUrl;

    @NotBlank
    private String thumbnailUrl;

    @NotBlank
    private String uploadedBy;

    @NotBlank
    private String uploaderId;

    private Double duration;

    private Integer views;

    private Integer likes;

    private Integer commentsCount;

    private List<String> tags = new ArrayList<>();

    @CreatedDate
    private Instant createdAt = Instant.now();

    @LastModifiedDate
    private Instant updatedAt = Instant.now();
}
