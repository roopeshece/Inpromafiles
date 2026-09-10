package com.inproma.sys.inpromaapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inproma.sys.inpromaapp.entity.InvestmentProfile;
import com.inproma.sys.inpromaapp.service.InvestmentProfileService;

@RestController
@RequestMapping("/api/profiles")
public class InvestmentProfileController {

    private final InvestmentProfileService profileService;

    public InvestmentProfileController(
            InvestmentProfileService profileService) {
        this.profileService = profileService;
    }

    // Get profile by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<InvestmentProfile> getProfileByUserId(
            @PathVariable Integer userId) {

        return profileService.getProfileByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create investment profile
    @PostMapping
    public ResponseEntity<InvestmentProfile> createProfile(
            @RequestBody InvestmentProfile profile) {

        return ResponseEntity.ok(
                profileService.createProfile(profile)
        );
    }

    // Update investment profile
    @PutMapping("/user/{userId}")
    public ResponseEntity<InvestmentProfile> updateProfile(
            @PathVariable Integer userId,
            @RequestBody InvestmentProfile profile) {

        return ResponseEntity.ok(
                profileService.updateProfile(userId, profile)
        );
    }

    // Delete investment profile
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteProfile(
            @PathVariable Integer userId) {

        profileService.deleteProfile(userId);

        return ResponseEntity.noContent().build();
    }
}