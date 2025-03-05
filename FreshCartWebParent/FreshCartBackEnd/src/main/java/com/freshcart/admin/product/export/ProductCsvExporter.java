package com.freshcart.admin.product.export;

import com.freshcart.admin.AbstractExporter;
import com.freshcart.common.entity.product.Product;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class ProductCsvExporter extends AbstractExporter {

    public void export(List<Product> listProducts, HttpServletResponse response) throws IOException {
        super.setResponseHeader(response, "text/csv", ".csv", "products_");

        ICsvBeanWriter csvWriter = new CsvBeanWriter(response.getWriter(),
                CsvPreference.STANDARD_PREFERENCE);

        String[] csvHeader = {"Product ID", "Product Name", "Created Time", "Updated Time", "In Stock", "Cost", "Price", "Enabled"};
        String[] fieldMapping = {"id", "name", "createdTime", "updatedTime", "inStock", "cost", "price", "enabled"};

        csvWriter.writeHeader(csvHeader);

        for (Product product : listProducts) {
            csvWriter.write(product, fieldMapping);
        }

        csvWriter.close();
    }
}
