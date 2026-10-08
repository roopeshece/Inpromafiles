package com.inproma.sys.inpromaapp.controller;

import com.inproma.sys.inpromaapp.entity.PortfolioHolding;
import com.inproma.sys.inpromaapp.repository.PortfolioHoldingRepository;
import com.inproma.sys.inpromaapp.service.MarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio-holdings")
@CrossOrigin(origins = "*")
public class PortfolioHoldingController {

    @Autowired
    private PortfolioHoldingRepository portfolioHoldingRepository;

    @Autowired
    private MarketDataService marketDataService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PortfolioHolding>> getHoldingsByUser(@PathVariable Long userId) {
        List<PortfolioHolding> holdings = portfolioHoldingRepository.findByUserId(userId);

        for (PortfolioHolding holding : holdings) {
            if (holding.getTickerSymbol() != null) {
                try {
                    Double livePrice = marketDataService.getLivePrice(holding.getTickerSymbol());
                    if (livePrice != null) {
                        holding.setCurrentUnitPrice(livePrice);
                    }
                } catch (Exception e) {
                    System.err.println("Live price lookup skipped for symbol: " + holding.getTickerSymbol());
                }
            }
        }
        return ResponseEntity.ok(holdings);
    }

    @PostMapping
    public ResponseEntity<?> addHolding(@RequestBody PortfolioHolding holding) {
        try {
            if (holding.getUserId() == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Missing User ID"));
            }
            if (holding.getTickerSymbol() != null && (holding.getCurrentUnitPrice() == null || holding.getCurrentUnitPrice() == 0)) {
                try {
                    Double livePrice = marketDataService.getLivePrice(holding.getTickerSymbol());
                    if (livePrice != null) {
                        holding.setCurrentUnitPrice(livePrice);
                    }
                } catch (Exception e) {
                    System.err.println("Could not fetch live price, saving with default price.");
                }
            }
            if (holding.getCurrentUnitPrice() == null) {
                holding.setCurrentUnitPrice(0.0);
            }
            PortfolioHolding saved = portfolioHoldingRepository.save(holding);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to add holding: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHolding(@PathVariable Long id) {
        try {
            portfolioHoldingRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Delete error: " + e.getMessage()));
        }
    }
}