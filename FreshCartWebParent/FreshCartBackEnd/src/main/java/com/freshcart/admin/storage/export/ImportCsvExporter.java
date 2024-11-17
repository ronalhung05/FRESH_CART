package com.freshcart.admin.storage.export;

import com.freshcart.admin.AbstractExporter;
import com.freshcart.common.entity.storage.Import;
import org.supercsv.io.CsvListWriter;
import org.supercsv.io.ICsvListWriter;
import org.supercsv.prefs.CsvPreference;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ImportCsvExporter extends AbstractExporter {

	public void export(List<Import> listImports, HttpServletResponse response) throws IOException {
		super.setResponseHeader(response, "text/csv", ".csv", "imports_");

		ICsvListWriter csvWriter = new CsvListWriter(response.getWriter(), CsvPreference.STANDARD_PREFERENCE);

		// Define the CSV header
		String[] csvHeader = {"Import ID", "User ID", "User Full Name", "Transaction Time", "Sum Cost"};
		csvWriter.writeHeader(csvHeader);

		// Write each Import entity as a row in the CSV
		for (Import ip : listImports) {
			// Prepare the data for each row
			List<String> csvRow = new ArrayList<>();
			csvRow.add(ip.getId() != null ? ip.getId().toString() : "");
			csvRow.add(ip.getUser() != null && ip.getUser().getId() != null ? ip.getUser().getId().toString() : "");
			csvRow.add(ip.getUser() != null ? ip.getUser().getFirstName() + " " + ip.getUser().getLastName() : "");
			csvRow.add(ip.getTransactionTime() != null ? ip.getTransactionTime().toString() : "");
			csvRow.add(ip.getSumCost() != null ? ip.getSumCost().toString() : "");

			// Write the row using List<String>
			csvWriter.write(csvRow);
		}

		csvWriter.close();
	}
}
