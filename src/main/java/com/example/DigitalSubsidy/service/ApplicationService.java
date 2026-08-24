package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.Application;
import com.example.DigitalSubsidy.entity.Document;
import com.example.DigitalSubsidy.entity.Scheme;
import com.example.DigitalSubsidy.entity.User;
import com.example.DigitalSubsidy.repository.ApplicationRepo;
import com.example.DigitalSubsidy.repository.DocumentRepo;
import com.example.DigitalSubsidy.repository.SchemeRepo;
import com.example.DigitalSubsidy.repository.userRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {
    @Autowired
    userRepo userrepo;
    @Autowired
    SchemeRepo schemerepo;

    @Autowired
    ApplicationRepo applicationRepo;
    @Autowired
    DocumentRepo documentRepo;

    public Application createApplication(Application application) {

        long userid = application.getUser().getId();
        long schemeid = application.getScheme().getId();

        User user = userrepo.findById(userid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Scheme scheme = schemerepo.findById(schemeid)
                .orElseThrow(() -> new RuntimeException("Scheme not found"));
        boolean alreadyApplied =
                applicationRepo
                        .existsByUserIdAndSchemeIdAndStatusNot(
                                userid,
                                schemeid,
                                "WITHDRAWN"
                        );

        if (alreadyApplied) {

            throw new RuntimeException(
                    "You have already applied for this scheme"
            );
        }

        // 1. Scheme must be ACTIVE
        if (!"ACTIVE".equals(scheme.getStatus())) {
            throw new RuntimeException("Scheme is not active");
        }


        // 2. Check scheme date
        java.time.LocalDate today =
                java.time.LocalDate.now();

        if (today.isBefore(scheme.getStartDate()) ||
                today.isAfter(scheme.getEndDate())) {

            throw new RuntimeException(
                    "Application is outside the scheme period"
            );
        }


        // 3. Calculate user age
        int age = java.time.Period.between(
                user.getDateofbirth(),
                today
        ).getYears();


        // 4. Check age
        if (age < scheme.getMinimumAge() ||
                age > scheme.getMaximumAge()) {

            throw new RuntimeException(
                    "User is not eligible based on age"
            );
        }


        // 5. Check income
        if (user.getAnnualIncome() >
                scheme.getMaximumIncome()) {

            throw new RuntimeException(
                    "User is not eligible based on income"
            );
        }



        // 6. Check occupation
        if (!scheme.getEligibleOccupation()
                .equalsIgnoreCase(user.getOccupation())) {

            throw new RuntimeException(
                    "User is not eligible based on occupation"
            );
        }
        String schemeGender =
                scheme.getEligibleGender();

        if (schemeGender != null &&
                !schemeGender.isBlank() &&
                !schemeGender.equalsIgnoreCase("ALL")) {

            if (user.getGender() == null ||
                    !schemeGender.equalsIgnoreCase(
                            user.getGender()
                    )) {

                throw new RuntimeException(
                        "User is not eligible based on gender"
                );
            }
        }


        // Everything is valid
        application.setUser(user);
        application.setScheme(scheme);

        return applicationRepo.save(application);
    }

    public List<Application> getAllApplications() {

        return applicationRepo.findAll();
    }

    public Application getApplicationById(Long id) {

        return applicationRepo.findById(id).orElse(null);
    }

    public void deleteApplication(Long id) {

        applicationRepo.deleteById(id);
    }

    public Application approveApplication(Long id) {

        Application application =
                applicationRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found"));

        List<Document> documents =
                documentRepo.findByApplicationId(id);

        if (documents.isEmpty()) {

            throw new RuntimeException(
                    "No documents uploaded"
            );
        }

        application.setStatus("APPROVED");

        return applicationRepo.save(application);
    }

    public Application rejectApplication(Long id, String reason) {

        Application application =
                applicationRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found"));

        application.setStatus("REJECTED");

        application.setRejectionReason(reason);

        return applicationRepo.save(application);
    }

    public Application withdrawApplication(Long id) {

        Application application =
                applicationRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found"));

        // Only submitted/pending applications can be withdrawn
        if ("APPROVED".equals(application.getStatus())) {
            throw new RuntimeException(
                    "Approved application cannot be withdrawn");
        }

        if ("DISBURSED".equals(application.getStatus())) {
            throw new RuntimeException(
                    "Disbursed application cannot be withdrawn");
        }

        if ("REJECTED".equals(application.getStatus())) {
            throw new RuntimeException(
                    "Rejected application cannot be withdrawn");
        }

        application.setStatus("WITHDRAWN");

        return applicationRepo.save(application);
    }
}
