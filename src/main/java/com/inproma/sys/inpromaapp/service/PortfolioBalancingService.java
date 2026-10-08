package com.inproma.sys.inpromaapp.service;

import java.lang.reflect.InvocationTargetException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.inproma.sys.inpromaapp.entity.AssetCategory;
import com.inproma.sys.inpromaapp.entity.InvestmentProfile;
import com.inproma.sys.inpromaapp.entity.PortfolioHolding;
import com.inproma.sys.inpromaapp.entity.PortfolioRule;
import com.inproma.sys.inpromaapp.repository.InvestmentProfileRepository;
import com.inproma.sys.inpromaapp.repository.PortfolioHoldingRepository;
import com.inproma.sys.inpromaapp.repository.PortfolioRuleRepository;

@Service
public class PortfolioBalancingService {

    private final InvestmentProfileRepository profileRepository;
    private final PortfolioHoldingRepository holdingRepository;
    private final PortfolioRuleRepository ruleRepository;

    public PortfolioBalancingService(
            InvestmentProfileRepository profileRepository,
            PortfolioHoldingRepository holdingRepository,
            PortfolioRuleRepository ruleRepository) {

        this.profileRepository = profileRepository;
        this.holdingRepository = holdingRepository;
        this.ruleRepository = ruleRepository;
    }

    // Generate portfolio balancing report
    public List<Map<String, Object>> getBalancingReport(Integer userId) {

        // Get investor profile
        InvestmentProfile profile =
                profileRepository.findByUserUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Investment profile not found"));

        // Get user's holdings
        List<PortfolioHolding> holdings = holdingRepository.findAll().stream()
                .filter(holding -> holding.getUser() != null
                        && userId.equals(((PortfolioHolding) holding.getUser()).getUserId()))
                .toList();

        // Get recommended rules based on risk tolerance
        List<PortfolioRule> rules =
                ruleRepository.findByRiskTolerance(
                        PortfolioRule.RiskTolerance.valueOf(
                                profile.getRiskTolerance().name()));

        // Calculate total portfolio value

BigDecimal totalValue = BigDecimal.ZERO;

for (PortfolioHolding holding : holdings) {

    if (holding.getCurrentUnitPrice() != null) {
        totalValue = totalValue.add(
                null
        );
    }
}

        List<Map<String, Object>> report = new ArrayList<>();

        // Compare each recommended category
        for (PortfolioRule rule : rules) {

            Integer categoryId =
                    rule.getCategory().getCategoryId();

            String categoryName =
                    rule.getCategory().getCategoryName();

            BigDecimal recommendedPercentage =
                    rule.getRecommendedPercentage();

            BigDecimal actualValue = holdings.stream()
        .filter(holding ->
                holding.getCategory() != null &&
                ((AssetCategory) holding.getCategory())
                        .getCategoryId()
                        .equals(categoryId))
        .map(holding -> holding.getCurrentUnitPrice() == null
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(holding.getCurrentUnitPrice()))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal actualPercentage = BigDecimal.ZERO;

            if (totalValue.compareTo(BigDecimal.ZERO) > 0) {
                actualPercentage =
                        actualValue
                                .multiply(BigDecimal.valueOf(100))
                                .divide(
                                        totalValue,
                                        2,
                                        RoundingMode.HALF_UP);
            }

            BigDecimal difference =
                    actualPercentage.subtract(
                            recommendedPercentage);

            String status;

            if (difference.compareTo(BigDecimal.ZERO) > 0) {
                status = "Overweight";
            } else if (difference.compareTo(BigDecimal.ZERO) < 0) {
                status = "Underweight";
            } else {
                status = "Balanced";
            }

            Map<String, Object> result = new LinkedHashMap<>();

            result.put("category", categoryName);
            result.put("recommendedPercentage",
                    recommendedPercentage);
            result.put("actualPercentage",
                    actualPercentage);
            result.put("difference",
                    difference);
            result.put("status", status);
            result.put("actualValue", actualValue);

            report.add(result);
        }

        return report;
    }
}