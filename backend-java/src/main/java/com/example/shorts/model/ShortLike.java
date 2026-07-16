package com.example.shorts.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "shortLikes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShortLike {
    @Id
    private String id;

    @Indexed
    private String shortId;

    @Indexed
    private String userId;

    @CreatedDate
    private Instant createdAt = Instant.now();
}
