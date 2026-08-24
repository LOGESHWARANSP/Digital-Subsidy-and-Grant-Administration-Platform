package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.entity.Scheme;
import com.example.DigitalSubsidy.entity.User;
import com.example.DigitalSubsidy.repository.SchemeRepo;
import com.example.DigitalSubsidy.repository.userRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
public class SchemeService {

    @Autowired
    SchemeRepo schemerepo;
    @Autowired
    userRepo userrepo;

    public Scheme createScheme(Scheme scheme) {
        return schemerepo.save(scheme);
    }

    public List<Scheme> getAllSchemes() {
        return schemerepo.findAll();
    }

    public Scheme getSchemeById(Long id) {
        return schemerepo.findById(id).orElse(null);
    }

    public void deleteScheme(Long id) {
        schemerepo.deleteById(id);
    }
    public List<Scheme> getEligibleSchemes(Long userId) {

        User user = userrepo.findById(userId).orElse(null);

        if (user == null) {
            return List.of();
        }

        LocalDate dob = user.getDateofbirth();

        int age =
                Period.between(dob, LocalDate.now()).getYears();

        List<Scheme> schemes =
                schemerepo.findAll();

        return schemes.stream()

                .filter(scheme -> {
                    boolean result =
                            "ACTIVE".equalsIgnoreCase(scheme.getStatus());

                    System.out.println("STATUS: " + result);
                    return result;
                })

                .filter(scheme -> {
                    boolean result =
                            age >= scheme.getMinimumAge() &&
                                    age <= scheme.getMaximumAge();

                    System.out.println(
                            "AGE = " + age +
                                    " | Min = " + scheme.getMinimumAge() +
                                    " | Max = " + scheme.getMaximumAge() +
                                    " | Result = " + result
                    );

                    return result;
                })

                .filter(scheme -> {
                    boolean result =
                            user.getAnnualIncome() <=
                                    scheme.getMaximumIncome();

                    System.out.println(
                            "INCOME = " + user.getAnnualIncome() +
                                    " | Max = " + scheme.getMaximumIncome() +
                                    " | Result = " + result
                    );

                    return result;
                })

                .filter(scheme -> {
                    boolean result =
                            user.getOccupation().trim()
                                    .equalsIgnoreCase(
                                            scheme.getEligibleOccupation().trim()
                                    );

                    System.out.println(
                            "USER OCCUPATION = " + user.getOccupation() +
                                    " | SCHEME OCCUPATION = " +
                                    scheme.getEligibleOccupation() +
                                    " | Result = " + result
                    );

                    return result;
                })

                .filter(scheme -> {

                    String schemeGender = scheme.getEligibleGender();
                    String userGender = user.getGender();

                    boolean result =
                            schemeGender.equalsIgnoreCase("ALL") ||
                                    schemeGender.trim()
                                            .equalsIgnoreCase(userGender.trim());

                    System.out.println(
                            "USER GENDER = " + userGender +
                                    " | SCHEME GENDER = " + schemeGender +
                                    " | Result = " + result
                    );

                    return result;

                })

                .toList();
    }
    public Scheme updateScheme(
            Long id,
            Scheme updatedScheme) {

        Scheme scheme =
                schemerepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Scheme not found"
                                )
                        );

        scheme.setSchemeName(
                updatedScheme.getSchemeName()
        );

        scheme.setDescription(
                updatedScheme.getDescription()
        );

        scheme.setMaximumAmount(
                updatedScheme.getMaximumAmount()
        );

        scheme.setMinimumAge(
                updatedScheme.getMinimumAge()
        );

        scheme.setMaximumAge(
                updatedScheme.getMaximumAge()
        );

        scheme.setMaximumIncome(
                updatedScheme.getMaximumIncome()
        );

        scheme.setEligibleOccupation(
                updatedScheme.getEligibleOccupation()
        );

        scheme.setEligibleLocation(
                updatedScheme.getEligibleLocation()
        );

        scheme.setRequiredDocuments(
                updatedScheme.getRequiredDocuments()
        );

        scheme.setStartDate(
                updatedScheme.getStartDate()
        );

        scheme.setEndDate(
                updatedScheme.getEndDate()
        );

        scheme.setStatus(
                updatedScheme.getStatus()
        );
        scheme.setEligibleGender(
                updatedScheme.getEligibleGender()
        );

        return schemerepo.save(scheme);
    }
}