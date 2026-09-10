package com.inproma.sys.inpromaapp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "profile_asset_preferences",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_profile_category",
            columnNames = {"profile_id", "category_id"}
        )
    }
)
public class ProfileAssetPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "preference_id")
    private Integer preferenceId;

    @ManyToOne
    @JoinColumn(name = "profile_id", nullable = false)
    private InvestmentProfile profile;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private AssetCategory category;


    // Getters and Setters

    public Integer getPreferenceId() {
        return preferenceId;
    }

    public void setPreferenceId(Integer preferenceId) {
        this.preferenceId = preferenceId;
    }

    public InvestmentProfile getProfile() {
        return profile;
    }

    public void setProfile(InvestmentProfile profile) {
        this.profile = profile;
    }

    public AssetCategory getCategory() {
        return category;
    }

    public void setCategory(AssetCategory category) {
        this.category = category;
    }
}