package com.example.DigitalSubsidy.repository;

import com.example.DigitalSubsidy.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepo extends JpaRepository<Application,Long> {
    boolean existsByUserIdAndSchemeIdAndStatusNot(
            Long userId,
            Long schemeId,
            String status
    );
    List<Application> findByUserId(Long userId);
}
