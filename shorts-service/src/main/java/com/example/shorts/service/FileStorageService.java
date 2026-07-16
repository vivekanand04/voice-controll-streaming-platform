package com.example.shorts.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.storage.base-path}")
    private String storageBasePath;

    @Value("${app.storage.base-url}")
    private String storageBaseUrl;

    @Value("${app.cloudinary.enabled:false}")
    private boolean cloudinaryEnabled;

    @Autowired(required = false)
    private Cloudinary cloudinary;

    public String saveVideo(MultipartFile file) throws IOException {
        validateVideoType(file);
        if (cloudinaryEnabled && cloudinary != null) {
            return uploadToCloudinary(file, "video", "shorts");
        }
        return uploadToLocalStorage(file, "shorts");
    }

    public String saveThumbnail(MultipartFile file) throws IOException {
        if (cloudinaryEnabled && cloudinary != null) {
            return uploadToCloudinary(file, "image", "thumbnails");
        }
        return uploadToLocalStorage(file, "thumbnails");
    }

    private String uploadToCloudinary(MultipartFile file, String resourceType, String folder) throws IOException {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "resource_type", resourceType,
                    "folder", "shorts-service/" + folder,
                    "unique_filename", true,
                    "use_filename", false
            ));
            return (String) uploadResult.get("secure_url");
        } catch (Exception e) {
            throw new IOException("Cloudinary upload failed: " + e.getMessage(), e);
        }
    }

    private String uploadToLocalStorage(MultipartFile file, String folder) throws IOException {
        Path folderPath = ensureDirectory(folder);
        String fileName = generateFileName(file.getOriginalFilename());
        Files.copy(file.getInputStream(), folderPath.resolve(fileName));
        return storageBaseUrl + "/" + folder + "/" + fileName;
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
