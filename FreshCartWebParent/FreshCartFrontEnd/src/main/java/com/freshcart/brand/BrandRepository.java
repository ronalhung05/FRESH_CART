package com.freshcart.brand;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.freshcart.common.entity.Brand;
import java.util.List;

public interface BrandRepository extends JpaRepository<Brand, Integer> {
    @Query("SELECT b FROM Brand b ORDER BY b.name ASC")
    public List<Brand> findAllOrderByNameAsc();
} 