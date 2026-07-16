package com.example.shorts.repository;

import com.example.shorts.model.ShortModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShortRepository extends MongoRepository<ShortModel, String> {
    Page<ShortModel> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<ShortModel> findByUploaderIdOrderByCreatedAtDesc(String uploaderId);
    List<ShortModel> findByTitleRegexOrDescriptionRegexOrTagsRegexOrderByCreatedAtDesc(String title, String description, String tags);
}
