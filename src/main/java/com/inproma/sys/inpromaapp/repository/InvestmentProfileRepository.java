package com.inproma.sys.inpromaapp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inproma.sys.inpromaapp.entity.InvestmentProfile;

public interface InvestmentProfileRepository
        extends JpaRepository<InvestmentProfile, Integer> {

    Optional<InvestmentProfile> findByUserUserId(Integer userId);

    boolean existsByUserUserId(Integer userId);
}