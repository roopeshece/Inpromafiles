package com.inproma.sys.inpromaapp.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "portfolio_rules",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_risk_category",
            columnNames = {"risk_tolerance", "category_id"}
        )
    }
)
public class PortfolioRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rule_id")
    private Integer ruleId;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_tolerance", nullable = false)
    private RiskTolerance riskTolerance;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private AssetCategory category;

    @Column(
        name = "recommended_percentage",
        nullable = false,
        precision = 5,
        scale = 2
    )
    private BigDecimal recommendedPercentage;


    public enum RiskTolerance {
        Low,
        Medium,
        High
    }


    // Getters and Setters

    public Integer getRuleId() {
        return ruleId;
    }

    public void setRuleId(Integer ruleId) {
        this.ruleId = ruleId;
    }

    public RiskTolerance getRiskTolerance() {
        return riskTolerance;
    }

    public void setRiskTolerance(RiskTolerance riskTolerance) {
        this.riskTolerance = riskTolerance;
    }

    public AssetCategory getCategory() {
        return category;
    }

    public void setCategory(AssetCategory category) {
        this.category = category;
    }

    public BigDecimal getRecommendedPercentage() {
        return recommendedPercentage;
    }

    public void setRecommendedPercentage(BigDecimal recommendedPercentage) {
        this.recommendedPercentage = recommendedPercentage;
    }
}