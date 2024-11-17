package com.freshcart.admin.storage.export;

import com.freshcart.admin.AbstractExporter;
import com.freshcart.common.entity.storage.Import;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.xssf.usermodel.*;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class ImportExcelExporter extends AbstractExporter {
	private XSSFWorkbook workbook;
	private XSSFSheet sheet;

	public ImportExcelExporter() {
		workbook = new XSSFWorkbook();
	}

	private void writeHeaderLine() {
		sheet = workbook.createSheet("Imports");
		XSSFRow row = sheet.createRow(0);

		XSSFCellStyle cellStyle = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setBold(true);
		font.setFontHeight(16);
		cellStyle.setFont(font);

		createCell(row, 0, "Import ID", cellStyle);
		createCell(row, 1, "User ID", cellStyle);
		createCell(row, 2, "User Full Name", cellStyle);
		createCell(row, 3, "Transaction Time", cellStyle);
		createCell(row, 4, "Sum Cost", cellStyle);
	}

	private void createCell(XSSFRow row, int columnIndex, Object value, CellStyle style) {
		XSSFCell cell = row.createCell(columnIndex);
		sheet.autoSizeColumn(columnIndex);

		if (value instanceof Integer) {
			cell.setCellValue((Integer) value);
		} else if (value instanceof Long) {
			cell.setCellValue((Long) value);
		} else if (value instanceof Double) {
			cell.setCellValue((Double) value);
		} else if (value instanceof Boolean) {
			cell.setCellValue((Boolean) value);
		} else if (value instanceof java.util.Date) {
			cell.setCellValue((java.util.Date) value);
		} else {
			cell.setCellValue(value != null ? value.toString() : "");
		}

		cell.setCellStyle(style);
	}

	public void export(List<Import> listImports, HttpServletResponse response) throws IOException {
		super.setResponseHeader(response, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx", "imports_");

		writeHeaderLine();
		writeDataLines(listImports);

		ServletOutputStream outputStream = response.getOutputStream();
		workbook.write(outputStream);
		workbook.close();
		outputStream.close();
	}

	private void writeDataLines(List<Import> listImports) {
		int rowIndex = 1;

		XSSFCellStyle cellStyle = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setFontHeight(14);
		cellStyle.setFont(font);

		for (Import ip : listImports) {
			XSSFRow row = sheet.createRow(rowIndex++);
			int columnIndex = 0;

			createCell(row, columnIndex++, ip.getId(), cellStyle);
			createCell(row, columnIndex++, ip.getUser() != null ? ip.getUser().getId() : null, cellStyle);
			createCell(row, columnIndex++, ip.getUser() != null ? ip.getUser().getFirstName() + " " + ip.getUser().getLastName() : null, cellStyle);

			// Format transactionTime as a string
			String transactionTime = ip.getTransactionTime() != null ? ip.getTransactionTime().toString() : "";
			createCell(row, columnIndex++, transactionTime, cellStyle);

			createCell(row, columnIndex++, ip.getSumCost(), cellStyle);
		}
	}

}
