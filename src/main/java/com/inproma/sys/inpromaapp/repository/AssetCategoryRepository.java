package com.inproma.sys.inpromaapp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inproma.sys.inpromaapp.entity.AssetCategory;

public interface AssetCategoryRepository extends JpaRepository<AssetCategory, Integer> {

    Optional<AssetCategory> findByCategoryName(String categoryName);

    boolean existsByCategoryName(String categoryName);
}