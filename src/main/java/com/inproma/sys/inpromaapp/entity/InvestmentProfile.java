package com.inproma.sys.inpromaapp.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "investment_profiles")
public class InvestmentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Integer profileId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column
    private Integer age;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_status")
    private EmploymentStatus employmentStatus;

    @Column(name = "investment_goal", nullable = false, length = 255)
    private String investmentGoal;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_tolerance", nullable = false)
    private RiskTolerance riskTolerance;

    @Column(name = "investment_duration", nullable = false)
    private Integer investmentDuration;

    @Enumerated(EnumType.STRING)
    @Column(name = "investment_experience")
    private InvestmentExperience investmentExperience;

    @Enumerated(EnumType.STRING)
    @Column(name = "crypto_investor")
    private YesNo cryptoInvestor = YesNo.No;

    @Enumerated(EnumType.STRING)
    @Column(name = "crypto_risk_comfort")
    private RiskTolerance cryptoRiskComfort;

    @Column(name = "information_sources", length = 500)
    private String informationSources;

    @Column(name = "investment_preference", length = 255)
    private String investmentPreference;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    public enum EmploymentStatus {
        Student,
        Employed,
        Self_Employed,
        Unemployed,
        Retired,
        Other
    }

    public enum RiskTolerance {
        Low,
        Medium,
        High
    }

    public enum InvestmentExperience {
        Beginner,
        Intermediate,
        Advanced
    }

    public enum YesNo {
        Yes,
        No
    }


    // Getters and Setters

    public Integer getProfileId() {
        return profileId;
    }

    public void setProfileId(Integer profileId) {
        this.profileId = profileId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public EmploymentStatus getEmploymentStatus() {
        return employmentStatus;
    }

    public void setEmploymentStatus(EmploymentStatus employmentStatus) {
        this.employmentStatus = employmentStatus;
    }

    public String getInvestmentGoal() {
        return investmentGoal;
    }

    public void setInvestmentGoal(String investmentGoal) {
        this.investmentGoal = investmentGoal;
    }

    public RiskTolerance getRiskTolerance() {
        return riskTolerance;
    }

    public void setRiskTolerance(RiskTolerance riskTolerance) {
        this.riskTolerance = riskTolerance;
    }

    public Integer getInvestmentDuration() {
        return investmentDuration;
    }

    public void setInvestmentDuration(Integer investmentDuration) {
        this.investmentDuration = investmentDuration;
    }

    public InvestmentExperience getInvestmentExperience() {
        return investmentExperience;
    }

    public void setInvestmentExperience(InvestmentExperience investmentExperience) {
        this.investmentExperience = investmentExperience;
    }

    public YesNo getCryptoInvestor() {
        return cryptoInvestor;
    }

    public void setCryptoInvestor(YesNo cryptoInvestor) {
        this.cryptoInvestor = cryptoInvestor;
    }

    public RiskTolerance getCryptoRiskComfort() {
        return cryptoRiskComfort;
    }

    public void setCryptoRiskComfort(RiskTolerance cryptoRiskComfort) {
        this.cryptoRiskComfort = cryptoRiskComfort;
    }

    public String getInformationSources() {
        return informationSources;
    }

    public void setInformationSources(String informationSources) {
        this.informationSources = informationSources;
    }

    public String getInvestmentPreference() {
        return investmentPreference;
    }

    public void setInvestmentPreference(String investmentPreference) {
        this.investmentPreference = investmentPreference;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}