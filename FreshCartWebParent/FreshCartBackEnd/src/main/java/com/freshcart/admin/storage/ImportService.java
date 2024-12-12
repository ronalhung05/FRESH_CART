package com.freshcart.admin.storage;

import com.freshcart.admin.MessageServiceAdmin;
import com.freshcart.admin.paging.PagingAndSortingHelper;
import com.freshcart.admin.product.ProductService;
import com.freshcart.admin.user.UserService;
import com.freshcart.common.entity.User;
import com.freshcart.common.entity.product.Product;
import com.freshcart.common.entity.storage.Import;
import com.freshcart.common.exception.ImportNotFoundException;
import com.freshcart.common.exception.ProductNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class ImportService {
    public static final int IMPORT_PER_PAGE = 5;

    @Autowired ImportRepository importRepo;
    @Autowired UserService userService;
    @Autowired ProductService productService;
    @Autowired MessageServiceAdmin messageService;
    public List<Import> listAll() {return (List<Import>) importRepo.findAll();}

    public void listByPage(int pageNum, PagingAndSortingHelper helper){
        helper.listEntities(pageNum, IMPORT_PER_PAGE, importRepo);
    }

    public Import get(Integer id) throws ImportNotFoundException{
        try {
            return importRepo.findById(id).get();
        } catch (NoSuchElementException ex) {
            throw new ImportNotFoundException(messageService.getMessage("IMPORT_NOT_FOUND") + " " + id);
        }
    }

    public void setImportDetails(String[] detailProductIds, String[] detailAmounts,
         String[] detailCosts, Import ip) throws ProductNotFoundException {
        if (detailProductIds == null || detailProductIds.length == 0) return;

        float sumCost = 0;

        for (int count = 0; count < detailProductIds.length; count++) {

            int productId = Integer.parseInt(detailProductIds[count]);
            Product product = productService.get(productId);
            Integer quantity = Integer.parseInt(detailAmounts[count]);
            Float cost = Float.parseFloat(detailCosts[count]);
            sumCost += (quantity * cost);

            ip.addDetail(product, quantity, cost);
        }

        ip.setSumCost(sumCost);
    }

    public Import save(Import ip, String emailUser){
        User user = userService.getByEmail(emailUser);
        if(ip.getId() == null){
            ip.setTransactionTime(new Date());
            ip.setUser(user);
        }
        return importRepo.save(ip);
    }
}
