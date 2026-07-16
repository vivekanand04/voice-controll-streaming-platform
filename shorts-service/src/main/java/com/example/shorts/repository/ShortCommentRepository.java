package com.example.shorts.repository;

import com.example.shorts.model.ShortComment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShortCommentRepository extends MongoRepository<ShortComment, String> {
    List<ShortComment> findByShortIdOrderByCreatedAtDesc(String shortId);
}
