package com.example.shorts.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "shortComments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShortComment {
    @Id
    private String id;
    private String shortId;
    private String commenterId;
    private String commenterName;
    private String comment;
    @CreatedDate
    private Instant createdAt = Instant.now();
}
