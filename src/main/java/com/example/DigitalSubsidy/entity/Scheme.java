package com.example.DigitalSubsidy.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String schemeName;

    private Double maximumAmount;
    private Integer minimumAge;
    private Integer maximumAge;
    private Double maximumIncome;
    private String eligibleOccupation;
    private String eligibleLocation;
    private String requiredDocuments;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String eligibleGender;
    @Column(length = 1000)
    private String benefits;
    @Column(length = 1000)
    private String description;

    public String getBenefits() {
        return benefits;
    }

    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }

    public String getSchemeName() {
        return schemeName;
    }

    public void setSchemeName(String schemeName) {
        this.schemeName = schemeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getMaximumAmount() {
        return maximumAmount;
    }

    public void setMaximumAmount(Double maximumAmount) {
        this.maximumAmount = maximumAmount;
    }

    public Integer getMinimumAge() {
        return minimumAge;
    }

    public void setMinimumAge(Integer minimumAge) {
        this.minimumAge = minimumAge;
    }

    public Integer getMaximumAge() {
        return maximumAge;
    }

    public void setMaximumAge(Integer maximumAge) {
        this.maximumAge = maximumAge;
    }

    public Double getMaximumIncome() {
        return maximumIncome;
    }

    public void setMaximumIncome(Double maximumIncome) {
        this.maximumIncome = maximumIncome;
    }

    public String getEligibleOccupation() {
        return eligibleOccupation;
    }

    public void setEligibleOccupation(String eligibleOccupation) {
        this.eligibleOccupation = eligibleOccupation;
    }

    public String getEligibleLocation() {
        return eligibleLocation;
    }

    public void setEligibleLocation(String eligibleLocation) {
        this.eligibleLocation = eligibleLocation;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getId() {
        return id;
     }
    public String getRequiredDocuments() {
        return requiredDocuments;
    }

    public void setRequiredDocuments(String requiredDocuments) {
        this.requiredDocuments = requiredDocuments;
    }
    public String getEligibleGender() {
        return eligibleGender;
    }

    public void setEligibleGender(String eligibleGender) {
        this.eligibleGender = eligibleGender;
    }

}