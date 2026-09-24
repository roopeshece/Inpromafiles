package com.inproma.sys.inpromaapp.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inproma.sys.inpromaapp.service.PortfolioBalancingService;

@RestController
@RequestMapping("/api/balancing")
public class PortfolioBalancingController {

    private final PortfolioBalancingService balancingService;

    public PortfolioBalancingController(
            PortfolioBalancingService balancingService) {

        this.balancingService = balancingService;
    }

    // Get portfolio balancing report for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getBalancingReport(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                balancingService.getBalancingReport(userId)
        );
    }
}