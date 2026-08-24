package com.example.DigitalSubsidy.controller;

import com.example.DigitalSubsidy.entity.Disbursement;
import com.example.DigitalSubsidy.service.DisbursementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disbursements")
public class DisbursementController {

    @Autowired
    DisbursementService service;

    @PostMapping
    public Disbursement createDisbursement(
            @RequestBody Disbursement disbursement) {

        return service.createDisbursement(disbursement);
    }

    @GetMapping
    public List<Disbursement> getAllDisbursements() {
        return service.getAllDisbursements();
    }

    @GetMapping("/{id}")
    public Disbursement getDisbursementById(
            @PathVariable Long id) {

        return service.getDisbursementById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteDisbursement(@PathVariable Long id) {

        service.deleteDisbursement(id);
        return "Disbursement deleted successfully";
    }
}