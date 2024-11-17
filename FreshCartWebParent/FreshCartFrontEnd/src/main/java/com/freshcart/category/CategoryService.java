package com.freshcart.category;

import com.freshcart.common.entity.Category;
import com.freshcart.common.exception.CategoryNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository repo;

    public List<Category> listHierarchicalCategories() {
        List<Category> rootCategories = repo.findRootCategories();
        return rootCategories.stream()
                .filter(Category::isEnabled)
                .collect(Collectors.toList());
    }

    public Category getCategory(String alias) throws CategoryNotFoundException {
        Category category = repo.findByAliasEnabled(alias);
        if (category == null) {
            throw new CategoryNotFoundException("Could not find any categories with alias " + alias);
        }

        return category;
    }

    public List<Category> getCategoryParents(Category child) {
        List<Category> listParents = new ArrayList<>();

        Category parent = child.getParent();

        while (parent != null) {
            listParents.add(0, parent);
            parent = parent.getParent();
        }

        listParents.add(child);

        return listParents;
    }
}
