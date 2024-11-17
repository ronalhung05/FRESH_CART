package com.freshcart.brand;

import org.springframework.data.jpa.repository.JpaRepository;

import com.freshcart.common.entity.Brand;

public interface BrandRepository extends JpaRepository<Brand, Integer> {
} 