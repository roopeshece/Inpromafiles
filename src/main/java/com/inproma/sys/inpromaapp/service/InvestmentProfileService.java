package com.inproma.sys.inpromaapp.service;

import com.inproma.sys.inpromaapp.entity.InvestmentProfile;
import com.inproma.sys.inpromaapp.repository.InvestmentProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class InvestmentProfileService {

    private final InvestmentProfileRepository profileRepository;

    public InvestmentProfileService(
            InvestmentProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    // Get profile by user ID
    public Optional<InvestmentProfile> getProfileByUserId(Integer userId) {
        return profileRepository.findByUserUserId(userId);
    }

    // Create investment profile
    public InvestmentProfile createProfile(InvestmentProfile profile) {

        if (profile.getUser() == null) {
            throw new RuntimeException("User is required");
        }

        if (profileRepository.existsByUserUserId(
                Math.toIntExact(profile.getUser().getId()))) {
            throw new RuntimeException(
                    "Investment profile already exists for this user");
        }

        return profileRepository.save(profile);
    }

    // Update investment profile
    public InvestmentProfile updateProfile(
            Integer userId,
            InvestmentProfile updatedProfile) {

        InvestmentProfile existingProfile =
                profileRepository.findByUserUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Investment profile not found"));

        existingProfile.setAge(updatedProfile.getAge());
        existingProfile.setEmploymentStatus(
                updatedProfile.getEmploymentStatus());
        existingProfile.setInvestmentGoal(
                updatedProfile.getInvestmentGoal());
        existingProfile.setRiskTolerance(
                updatedProfile.getRiskTolerance());
        existingProfile.setInvestmentDuration(
                updatedProfile.getInvestmentDuration());
        existingProfile.setInvestmentExperience(
                updatedProfile.getInvestmentExperience());
        existingProfile.setCryptoInvestor(
                updatedProfile.getCryptoInvestor());
        existingProfile.setCryptoRiskComfort(
                updatedProfile.getCryptoRiskComfort());
        existingProfile.setInformationSources(
                updatedProfile.getInformationSources());
        existingProfile.setInvestmentPreference(
                updatedProfile.getInvestmentPreference());

        return profileRepository.save(existingProfile);
    }

    // Delete investment profile
    public void deleteProfile(Integer userId) {

        InvestmentProfile profile =
                profileRepository.findByUserUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Investment profile not found"));

        profileRepository.delete(profile);
    }
}