package com.freshcart.admin.brand.export;

import com.freshcart.admin.AbstractExporter;
import com.freshcart.common.entity.Brand;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class BrandCsvExporter extends AbstractExporter {

    public void export(List<Brand> listBrands, HttpServletResponse response) throws IOException {
        super.setResponseHeader(response, "text/csv", ".csv", "brands_");

        ICsvBeanWriter csvWriter = new CsvBeanWriter(response.getWriter(),
                CsvPreference.STANDARD_PREFERENCE);

        String[] csvHeader = {"Brand ID", "Brand Name", "Enabled"};
        String[] fieldMapping = {"id", "name", "enabled"};

        csvWriter.writeHeader(csvHeader);

        for (Brand brand : listBrands) {
            csvWriter.write(brand, fieldMapping);
        }

        csvWriter.close();
    }
}
