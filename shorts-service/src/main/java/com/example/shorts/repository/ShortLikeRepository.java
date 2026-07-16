package com.example.shorts.repository;

import com.example.shorts.model.ShortLike;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShortLikeRepository extends MongoRepository<ShortLike, String> {
    Optional<ShortLike> findByShortIdAndUserId(String shortId, String userId);
    long countByShortId(String shortId);
}
