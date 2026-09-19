package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.*;
import com.example.DigitalSubsidy.repository.*;
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

    @Autowired
    EmailService emailService;

    @Autowired
    InstallmentPlanRepo installmentPlanRepo;


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


        // ================= APPLICATION =================

        Application application =
                applicationrepo.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                ));


        // Application must be approved

        String applicationStatus =
                application.getStatus();

        boolean validStatus =
                "APPROVED".equals(applicationStatus)
                        || "INSTALLMENT_1_PAID".equals(applicationStatus)
                        || "UTILIZATION_PROOF_1_VERIFIED".equals(applicationStatus)
                        || "INSTALLMENT_2_PAID".equals(applicationStatus)
                        || "UTILIZATION_PROOF_2_VERIFIED".equals(applicationStatus);

        if (!validStatus) {

            throw new RuntimeException(
                    "Disbursement allowed only for eligible applications"
            );
        }


        // ================= BANK DETAILS =================

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


        // ================= INSTALLMENT VALIDATION =================

        if (disbursement.getInstallmentNumber() == null) {

            throw new RuntimeException(
                    "Installment number is required"
            );
        }


        // Find installment plan

        InstallmentPlan plan =
                installmentPlanRepo
                        .findByApplicationIdAndInstallmentNumber(
                                applicationId,
                                disbursement.getInstallmentNumber()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Installment plan not found"
                                )
                        );


        // Installment must be AVAILABLE

        if (!"AVAILABLE".equals(plan.getStatus())) {

            throw new RuntimeException(
                    "Installment is not available for disbursement"
            );
        }


        // Use installment plan amount

        Double installmentAmount =
                plan.getAmount();


        if (installmentAmount == null
                || installmentAmount <= 0) {

            throw new RuntimeException(
                    "Invalid installment amount"
            );
        }


        // Set the actual installment amount

        disbursement.setAmount(
                installmentAmount
        );


        // ================= DUPLICATE CHECK =================

        boolean installmentAlreadyPaid =
                repository
                        .findByApplicationId(applicationId)
                        .stream()
                        .anyMatch(d ->
                                disbursement
                                        .getInstallmentNumber()
                                        .equals(
                                                d.getInstallmentNumber()
                                        )
                        );


        if (installmentAlreadyPaid) {

            throw new RuntimeException(
                    "This installment has already been disbursed"
            );
        }


        // ================= SET PAYMENT DETAILS =================

        disbursement.setApplication(
                application
        );


        disbursement.setPaymentStatus(
                "PAID"
        );


        disbursement.setDisbursementDate(
                java.time.LocalDate.now()
        );


        disbursement.setTransactionReference(
                "TXN" + System.currentTimeMillis()
        );


        // ================= SAVE PAYMENT =================

        Disbursement savedDisbursement =
                repository.save(disbursement);


        // ================= UPDATE INSTALLMENT =================

        // Current installment → PAID

        plan.setStatus(
                "PAID"
        );

        installmentPlanRepo.save(
                plan
        );


        // ================= UPDATE APPLICATION STATUS =================

        Integer installmentNumber =
                plan.getInstallmentNumber();

        if (installmentNumber == 1) {

            application.setStatus("INSTALLMENT_1_PAID");

        } else if (installmentNumber == 2) {

            application.setStatus("INSTALLMENT_2_PAID");

        } else if (installmentNumber == 3) {

            application.setStatus("DISBURSED");
        }

        application.setStatusUpdatedDate(
                java.time.LocalDateTime.now()
        );

        applicationrepo.save(
                application
        );


        // ================= UNLOCK NEXT INSTALLMENT =================

        Integer nextInstallmentNumber =
                plan.getInstallmentNumber() + 1;


        installmentPlanRepo
                .findByApplicationIdAndInstallmentNumber(
                        applicationId,
                        nextInstallmentNumber
                )
                .ifPresent(nextPlan -> {

                    nextPlan.setStatus(
                            "AVAILABLE"
                    );

                    installmentPlanRepo.save(
                            nextPlan
                    );
                });


        // ================= EMAIL =================

        emailService.sendPaymentDisbursedEmail(

                application.getUser().getEmailId(),

                application.getUser().getFirstName(),

                application.getScheme().getSchemeName(),

                savedDisbursement.getInstallmentNumber(),

                savedDisbursement.getAmount()
        );


        return savedDisbursement;
    }
}