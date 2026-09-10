package com.inproma.sys.inpromaapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inproma.sys.inpromaapp.entity.PortfolioRule;

public interface PortfolioRuleRepository
        extends JpaRepository<PortfolioRule, Integer> {

    List<PortfolioRule> findByRiskTolerance(
            PortfolioRule.RiskTolerance riskTolerance
    );

    List<PortfolioRule> findByRiskToleranceAndCategoryCategoryId(
            PortfolioRule.RiskTolerance riskTolerance,
            Integer categoryId
    );
}