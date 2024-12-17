package com.freshcart.admin.customer.export;

import com.freshcart.admin.AbstractExporter;
import com.freshcart.common.entity.Customer;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class CustomerCsvExporter extends AbstractExporter {

    public void export(List<Customer> listCustomers, HttpServletResponse response) throws IOException {
        super.setResponseHeader(response, "text/csv", ".csv", "users_");

        ICsvBeanWriter csvWriter = new CsvBeanWriter(response.getWriter(),
                CsvPreference.STANDARD_PREFERENCE);

        String[] csvHeader = {"Customer ID", "First Name", "Last Name", "Email", "Phone Number", "City", "State", "Enabled"};
        String[] fieldMapping = {"id", "firstName", "lastName", "email", "phoneNumber", "city", "state", "enabled"};

        csvWriter.writeHeader(csvHeader);

        for (Customer customer : listCustomers) {
            csvWriter.write(customer, fieldMapping);
        }

        csvWriter.close();
    }
}
