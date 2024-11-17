package com.freshcart.admin.storage;


import com.freshcart.common.entity.storage.Import;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Rollback(false)
class ImportRepositoryTest {
    @Autowired
    private ImportRepository repo;

    @Test
    public void testListAllImports() {
        Iterable<Import> iterableImports = repo.findAll();

        iterableImports.forEach(System.out::println);
    }
}