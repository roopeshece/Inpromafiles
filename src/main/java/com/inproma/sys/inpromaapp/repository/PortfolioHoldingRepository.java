package com.inproma.sys.inpromaapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inproma.sys.inpromaapp.entity.PortfolioHolding;

public interface PortfolioHoldingRepository
        extends JpaRepository<PortfolioHolding, Integer> {

    List<PortfolioHolding> findByUserUserId(Integer userId);

    List<PortfolioHolding> findByUserUserIdAndCategoryCategoryId(
            Integer userId,
            Integer categoryId
    );
}