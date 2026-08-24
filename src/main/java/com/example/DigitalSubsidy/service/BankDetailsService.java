package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.Application;
import com.example.DigitalSubsidy.entity.BankDetails;
import com.example.DigitalSubsidy.repository.ApplicationRepo;
import com.example.DigitalSubsidy.repository.BankDetailsRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BankDetailsService {

    @Autowired
    BankDetailsRepo bankDetailsRepo;

    @Autowired
    ApplicationRepo applicationRepo;


    // User submits bank details
    public BankDetails createBankDetails(
            BankDetails bankDetails) {

        Long applicationId =
                bankDetails.getApplication().getId();


        Application application =
                applicationRepo.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );


        // Only approved application can submit bank details
        if (!"APPROVED".equals(application.getStatus())) {

            throw new RuntimeException(
                    "Bank details can be submitted only after application approval"
            );
        }


        BankDetails existingBankDetails =
                bankDetailsRepo
                        .findByApplicationId(applicationId)
                        .orElse(null);


        // Bank details already exist
        if (existingBankDetails != null) {

            // Allow resubmission only after rejection
            if (!"REJECTED".equals(
                    existingBankDetails.getVerificationStatus())) {

                throw new RuntimeException(
                        "Bank details already submitted"
                );
            }


            // Update rejected bank details

            existingBankDetails.setAccountHolderName(
                    bankDetails.getAccountHolderName()
            );

            existingBankDetails.setBankName(
                    bankDetails.getBankName()
            );

            existingBankDetails.setAccountNumber(
                    bankDetails.getAccountNumber()
            );

            existingBankDetails.setIfscCode(
                    bankDetails.getIfscCode()
            );

            existingBankDetails.setBranchName(
                    bankDetails.getBranchName()
            );


            // Send again for officer verification

            existingBankDetails.setVerificationStatus(
                    "PENDING"
            );


            return bankDetailsRepo.save(
                    existingBankDetails
            );
        }


        // First time submission

        bankDetails.setApplication(application);

        bankDetails.setVerificationStatus(
                "PENDING"
        );


        return bankDetailsRepo.save(
                bankDetails
        );
    }
    public List<BankDetails> getAllBankDetails() {

        return bankDetailsRepo.findAll();
    }


    public BankDetails getBankDetailsById(Long id) {

        return bankDetailsRepo.findById(id)
                .orElse(null);
    }


    // Officer verifies bank details
    public BankDetails verifyBankDetails(Long id) {

        BankDetails bankDetails =
                bankDetailsRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bank details not found"
                                )
                        );


        bankDetails.setVerificationStatus(
                "VERIFIED"
        );


        return bankDetailsRepo.save(
                bankDetails
        );
    }


    // Officer rejects bank details
    public BankDetails rejectBankDetails(Long id) {

        BankDetails bankDetails =
                bankDetailsRepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bank details not found"
                                )
                        );


        bankDetails.setVerificationStatus(
                "REJECTED"
        );


        return bankDetailsRepo.save(
                bankDetails
        );
    }
    public BankDetails getByApplicationId(
            Long applicationId) {

        return bankDetailsRepo
                .findByApplicationId(applicationId)
                .orElse(null);
    }
}