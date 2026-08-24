package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.Application;
import com.example.DigitalSubsidy.entity.Disbursement;
import com.example.DigitalSubsidy.entity.Document;
import com.example.DigitalSubsidy.entity.User;
import com.example.DigitalSubsidy.repository.ApplicationRepo;
import com.example.DigitalSubsidy.repository.DisbursementRepo;
import com.example.DigitalSubsidy.repository.DocumentRepo;
import com.example.DigitalSubsidy.repository.userRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class userService {

    @Autowired
    userRepo userrepo;
    @Autowired
    ApplicationRepo applicationRepo;
    @Autowired
    DisbursementRepo disbursementRepo;
    @Autowired
    DocumentRepo documentRepo;

    public List<User> getallusers() {
       return  userrepo.findAll();
    }

    public String addnewUsers(User user) {
        userrepo.save(user);
        return "new User added";
    }

    public User finduserid(long id) {

        return userrepo.findById(id).orElse(null);
    }
    @Transactional
    public String DeleteIdByUser(long id) {

        List<Application> applications =
                applicationRepo.findByUserId(id);

        for (Application application : applications) {

            Long applicationId =
                    application.getId();

            // Delete Documents first
            List<Document> documents =
                    documentRepo.findByApplicationId(
                            applicationId
                    );

            documentRepo.deleteAll(documents);


            // Delete Disbursements
            List<Disbursement> disbursements =
                    disbursementRepo.findByApplicationId(
                            applicationId
                    );

            disbursementRepo.deleteAll(disbursements);
        }


        // Delete Applications
        applicationRepo.deleteAll(applications);

        // Finally delete User
        userrepo.deleteById(id);

        return "User Data Deleted";
    }

    public User updateUser(Long id, User updatedUser) {

        User user = userrepo.findById(id).orElse(null);

        if (user != null) {
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setPhone(updatedUser.getPhone());
            user.setEmailId(updatedUser.getEmailId());
            user.setDateofbirth(updatedUser.getDateofbirth());
            user.setAnnualIncome(updatedUser.getAnnualIncome());
            user.setOccupation(updatedUser.getOccupation());
            user.setLocation(updatedUser.getLocation());
            user.setGender(updatedUser.getGender());

            return userrepo.save(user);
        }
                return null;
    }
}
