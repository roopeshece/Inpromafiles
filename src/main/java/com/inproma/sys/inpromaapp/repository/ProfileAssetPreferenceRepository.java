package com.inproma.sys.inpromaapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inproma.sys.inpromaapp.entity.ProfileAssetPreference;

public interface ProfileAssetPreferenceRepository
        extends JpaRepository<ProfileAssetPreference, Integer> {

    List<ProfileAssetPreference> findByProfileProfileId(Integer profileId);

    boolean existsByProfileProfileIdAndCategoryCategoryId(
            Integer profileId,
            Integer categoryId
    );
}