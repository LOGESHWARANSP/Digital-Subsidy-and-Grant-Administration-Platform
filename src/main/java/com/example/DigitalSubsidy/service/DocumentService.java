package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.Application;
import com.example.DigitalSubsidy.entity.Document;
import com.example.DigitalSubsidy.repository.ApplicationRepo;
import com.example.DigitalSubsidy.repository.DocumentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepo documentRepo;

    @Autowired
    private ApplicationRepo applicationRepo;

    private final String uploadDir = "uploads/documents/";

    public Document uploadDocument(
            MultipartFile file,
            String documentType,
            Long applicationId) throws IOException {

        // Find application
        Application application = applicationRepo.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Create folder if not exists
        Path directory = Paths.get(uploadDir);

        if (!Files.exists(directory)) {
            Files.createDirectories(directory);
        }

        // Save file
        String fileName = file.getOriginalFilename();

        Path filePath = directory.resolve(fileName);

        Files.write(filePath, file.getBytes());

        // Create Document object
        Document document = new Document();

        document.setDocumentType(documentType);
        document.setDocumentName(fileName);
        document.setDocumentPath(filePath.toString());
        document.setVerificationStatus("PENDING");
        document.setUploadedAt(LocalDateTime.now());
        document.setApplication(application);

        // Save document details in database
        return documentRepo.save(document);
    }

    public List<Document> getAllDocuments() {
        return documentRepo.findAll();
    }

    public Document getDocumentById(Long id) {
        return documentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }
    public Document verifyDocument(Long id) {

        Document document = documentRepo.findById(id).orElse(null);

        if (document != null) {
            document.setVerificationStatus("VERIFIED");
            return documentRepo.save(document);
        }

        return null;
    }

    public Document rejectDocument(Long id) {

        Document document = documentRepo.findById(id).orElse(null);

        if (document != null) {
            document.setVerificationStatus("REJECTED");
            return documentRepo.save(document);
        }

        return null;
    }
    public List<Document> getDocumentsByApplication(Long applicationId) {

        return documentRepo.findByApplicationId(applicationId);
    }
}