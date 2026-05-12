package com.example.shorts.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.storage.base-path}")
    private String storageBasePath;

    @Value("${app.storage.base-url}")
    private String storageBaseUrl;

    public String saveVideo(MultipartFile file) throws IOException {
        validateVideoType(file);
        Path folder = ensureDirectory("shorts");
        String fileName = generateFileName(file.getOriginalFilename());
        Files.copy(file.getInputStream(), folder.resolve(fileName));
        return storageBaseUrl + "/shorts/" + fileName;
    }

    public String saveThumbnail(MultipartFile file) throws IOException {
        Path folder = ensureDirectory("thumbnails");
        String fileName = generateFileName(file.getOriginalFilename());
        Files.copy(file.getInputStream(), folder.resolve(fileName));
        return storageBaseUrl + "/thumbnails/" + fileName;
    }

    private void validateVideoType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !(contentType.equals("video/mp4") || contentType.equals("video/webm"))) {
            throw new IllegalArgumentException("Only MP4 and WebM video formats are supported.");
        }
    }

    private Path ensureDirectory(String sub) throws IOException {
        Path folder = Paths.get(storageBasePath, sub).toAbsolutePath().normalize();
        Files.createDirectories(folder);
        return folder;
    }

    private String generateFileName(String originalFilename) {
        String extension = StringUtils.getFilenameExtension(originalFilename);
        String safeName = UUID.randomUUID().toString();
        return safeName + (extension != null ? "." + extension : "");
    }
}
