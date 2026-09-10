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

import com.inproma.sys.inpromaapp.entity.PortfolioHolding;
import com.inproma.sys.inpromaapp.repository.PortfolioHoldingRepository;

@RestController
@RequestMapping("/api/holdings")
public class PortfolioHoldingController {

    private final PortfolioHoldingRepository holdingRepository;

    public PortfolioHoldingController(
            PortfolioHoldingRepository holdingRepository) {
        this.holdingRepository = holdingRepository;
    }

    // Get all holdings for a user
    @GetMapping("/user/{userId}")
    public List<PortfolioHolding> getHoldingsByUser(
            @PathVariable Integer userId) {

        return holdingRepository.findByUserUserId(userId);
    }

    // Get a specific holding
    @GetMapping("/{holdingId}")
    public ResponseEntity<PortfolioHolding> getHoldingById(
            @PathVariable Integer holdingId) {

        return holdingRepository.findById(holdingId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get holdings by user and category
    @GetMapping("/user/{userId}/category/{categoryId}")
    public List<PortfolioHolding> getHoldingsByUserAndCategory(
            @PathVariable Integer userId,
            @PathVariable Integer categoryId) {

        return holdingRepository
                .findByUserUserIdAndCategoryCategoryId(
                        userId, categoryId);
    }

    // Add a holding
    @PostMapping
    public ResponseEntity<PortfolioHolding> createHolding(
            @RequestBody PortfolioHolding holding) {

        return ResponseEntity.ok(
                holdingRepository.save(holding)
        );
    }

    // Update a holding
    @PutMapping("/{holdingId}")
    public ResponseEntity<PortfolioHolding> updateHolding(
            @PathVariable Integer holdingId,
            @RequestBody PortfolioHolding updatedHolding) {

        return holdingRepository.findById(holdingId)
                .map(existingHolding -> {

                    existingHolding.setAssetName(
                            updatedHolding.getAssetName());

                    existingHolding.setCategory(
                            updatedHolding.getCategory());

                    existingHolding.setInvestedAmount(
                            updatedHolding.getInvestedAmount());

                    existingHolding.setQuantity(
                            updatedHolding.getQuantity());

                    existingHolding.setCurrentValue(
                            updatedHolding.getCurrentValue());

                    existingHolding.setPurchaseDate(
                            updatedHolding.getPurchaseDate());

                    return ResponseEntity.ok(
                            holdingRepository.save(existingHolding));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a holding
    @DeleteMapping("/{holdingId}")
    public ResponseEntity<Void> deleteHolding(
            @PathVariable Integer holdingId) {

        if (!holdingRepository.existsById(holdingId)) {
            return ResponseEntity.notFound().build();
        }

        holdingRepository.deleteById(holdingId);

        return ResponseEntity.noContent().build();
    }
}