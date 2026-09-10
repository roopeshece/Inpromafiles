package com.inproma.sys.inpromaapp.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inproma.sys.inpromaapp.entity.PortfolioRule;
import com.inproma.sys.inpromaapp.repository.PortfolioRuleRepository;

@RestController
@RequestMapping("/api/rules")
public class PortfolioRuleController {

    private final PortfolioRuleRepository ruleRepository;

    public PortfolioRuleController(
            PortfolioRuleRepository ruleRepository) {
        this.ruleRepository = ruleRepository;
    }

    // Get rules by risk tolerance
    @GetMapping("/risk/{riskTolerance}")
    public List<PortfolioRule> getRulesByRiskTolerance(
            @PathVariable PortfolioRule.RiskTolerance riskTolerance) {

        return ruleRepository.findByRiskTolerance(riskTolerance);
    }

    // Get a specific rule
    @GetMapping("/{ruleId}")
    public ResponseEntity<PortfolioRule> getRuleById(
            @PathVariable Integer ruleId) {

        return ruleRepository.findById(ruleId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a portfolio rule
    @PostMapping
    public ResponseEntity<PortfolioRule> createRule(
            @RequestBody PortfolioRule rule) {

        return ResponseEntity.ok(
                ruleRepository.save(rule)
        );
    }

    // Update a portfolio rule
    @PutMapping("/{ruleId}")
    public ResponseEntity<PortfolioRule> updateRule(
            @PathVariable Integer ruleId,
            @RequestBody PortfolioRule updatedRule) {

        return ruleRepository.findById(ruleId)
                .map(existingRule -> {

                    existingRule.setRiskTolerance(
                            updatedRule.getRiskTolerance());

                    existingRule.setCategory(
                            updatedRule.getCategory());

                    existingRule.setRecommendedPercentage(
                            updatedRule.getRecommendedPercentage());

                    return ResponseEntity.ok(
                            ruleRepository.save(existingRule));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a portfolio rule
    @DeleteMapping("/{ruleId}")
    public ResponseEntity<Void> deleteRule(
            @PathVariable Integer ruleId) {

        if (!ruleRepository.existsById(ruleId)) {
            return ResponseEntity.notFound().build();
        }

        ruleRepository.deleteById(ruleId);

        return ResponseEntity.noContent().build();
    }
}