package com.freshcart.admin.storage;

import com.freshcart.admin.paging.SearchRepository;
import com.freshcart.common.entity.storage.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

public interface ImportRepository extends SearchRepository<Import, Integer> {
    @Query("SELECT i FROM Import i  WHERE CONCAT(i.id, ' ', i.user.id, ' ', i.user.firstName, ' ' , i.user.lastName, ' ', " +
            "i.sumCost, ' ', i.transactionTime) LIKE %?1%")
    public Page<Import> findAll(String keyword, Pageable pageable);
}
