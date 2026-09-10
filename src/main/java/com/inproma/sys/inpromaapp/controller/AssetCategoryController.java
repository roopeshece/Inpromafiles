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

import com.inproma.sys.inpromaapp.entity.AssetCategory;
import com.inproma.sys.inpromaapp.repository.AssetCategoryRepository;

@RestController
@RequestMapping("/api/categories")
public class AssetCategoryController {

    private final AssetCategoryRepository categoryRepository;

    public AssetCategoryController(
            AssetCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Get all asset categories
    @GetMapping
    public List<AssetCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get category by ID
    @GetMapping("/{categoryId}")
    public ResponseEntity<AssetCategory> getCategoryById(
            @PathVariable Integer categoryId) {

        return categoryRepository.findById(categoryId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create asset category
    @PostMapping
    public ResponseEntity<AssetCategory> createCategory(
            @RequestBody AssetCategory category) {

        if (categoryRepository.existsByCategoryName(
                category.getCategoryName())) {

            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                categoryRepository.save(category)
        );
    }

    // Update asset category
    @PutMapping("/{categoryId}")
    public ResponseEntity<AssetCategory> updateCategory(
            @PathVariable Integer categoryId,
            @RequestBody AssetCategory updatedCategory) {

        return categoryRepository.findById(categoryId)
                .map(existingCategory -> {

                    existingCategory.setCategoryName(
                            updatedCategory.getCategoryName());

                    existingCategory.setDescription(
                            updatedCategory.getDescription());

                    return ResponseEntity.ok(
                            categoryRepository.save(existingCategory));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete asset category
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Integer categoryId) {

        if (!categoryRepository.existsById(categoryId)) {
            return ResponseEntity.notFound().build();
        }

        categoryRepository.deleteById(categoryId);

        return ResponseEntity.noContent().build();
    }
}