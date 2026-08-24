package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.Application;
import com.example.DigitalSubsidy.entity.BankDetails;
import com.example.DigitalSubsidy.entity.Disbursement;
import com.example.DigitalSubsidy.repository.ApplicationRepo;
import com.example.DigitalSubsidy.repository.BankDetailsRepo;
import com.example.DigitalSubsidy.repository.DisbursementRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DisbursementService {

    @Autowired
    DisbursementRepo repository;
    @Autowired
    ApplicationRepo applicationrepo;
    @Autowired
    BankDetailsRepo bankDetailsRepo;


    public List<Disbursement> getAllDisbursements() {
        return repository.findAll();
    }

    public Disbursement getDisbursementById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteDisbursement(Long id) {
        repository.deleteById(id);
    }
    public Disbursement createDisbursement(
            Disbursement disbursement) {

        Long applicationId =
                disbursement.getApplication().getId();


        Application application =
                applicationrepo.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                ));


        // Application must be approved

        if (!"APPROVED".equals(
                application.getStatus())) {

            throw new RuntimeException(
                    "Disbursement allowed only for approved applications"
            );

        }


        // Get bank details

        BankDetails bankDetails =
                bankDetailsRepo
                        .findByApplicationId(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bank details not submitted"
                                )
                        );


        // Bank details must be verified

        if (!"VERIFIED".equals(
                bankDetails.getVerificationStatus())) {

            throw new RuntimeException(
                    "Bank details are not verified"
            );

        }


        // Prevent duplicate disbursement

        if (!repository
                .findByApplicationId(applicationId)
                .isEmpty()) {

            throw new RuntimeException(
                    "Disbursement already exists for this application"
            );

        }


        disbursement.setApplication(application);


        Disbursement savedDisbursement =
                repository.save(disbursement);


        // Application status changes after payment

        application.setStatus("DISBURSED");

        applicationrepo.save(application);


        return savedDisbursement;
    }
}