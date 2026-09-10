package com.inproma.sys.inpromaapp.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inproma.sys.inpromaapp.entity.ProfileAssetPreference;
import com.inproma.sys.inpromaapp.repository.ProfileAssetPreferenceRepository;

@RestController
@RequestMapping("/api/preferences")
public class ProfileAssetPreferenceController {

    private final ProfileAssetPreferenceRepository preferenceRepository;

    public ProfileAssetPreferenceController(
            ProfileAssetPreferenceRepository preferenceRepository) {
        this.preferenceRepository = preferenceRepository;
    }

    // Get all preferences for a profile
    @GetMapping("/profile/{profileId}")
    public List<ProfileAssetPreference> getPreferencesByProfile(
            @PathVariable Integer profileId) {

        return preferenceRepository.findByProfileProfileId(profileId);
    }

    // Add an asset preference
    @PostMapping
    public ResponseEntity<ProfileAssetPreference> createPreference(
            @RequestBody ProfileAssetPreference preference) {

        Integer profileId =
                preference.getProfile().getProfileId();

        Integer categoryId =
                preference.getCategory().getCategoryId();

        if (preferenceRepository
                .existsByProfileProfileIdAndCategoryCategoryId(
                        profileId, categoryId)) {

            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                preferenceRepository.save(preference)
        );
    }

    // Delete a preference
    @DeleteMapping("/{preferenceId}")
    public ResponseEntity<Void> deletePreference(
            @PathVariable Integer preferenceId) {

        if (!preferenceRepository.existsById(preferenceId)) {
            return ResponseEntity.notFound().build();
        }

        preferenceRepository.deleteById(preferenceId);

        return ResponseEntity.noContent().build();
    }
}