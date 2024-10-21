import * as ExcelJS from 'exceljs';
import { saveAs } from "file-saver";

export const exportExcel = async ({ cols, data, sheetName = "files", creator = "Autogenerated", toastHandler = null, handleLoading, loadingKey = 'exportExcel' }) => {
  try {
    handleLoading({ [loadingKey]: true });
    const workbook = new ExcelJS.Workbook();
    workbook.creator = creator;
    workbook.lastModifiedBy = creator;

    const today = new Date();
    workbook.created = today;
    workbook.modified = today;
    workbook.lastPrinted = today;

    const sheet = workbook.addWorksheet(sheetName);
    sheet.state = "visible";
    sheet.columns = cols;

    data?.forEach(t => {
      sheet.addRow(t);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const fileExtension = ".xlsx";

    const blob = new Blob([buffer], { type: fileType });
    saveAs(blob, `${sheetName}_${today.toLocaleDateString()}.xlsx`);
  } catch (err) {
    console.error('Error al exportar a excel. ' + err.message);
    toastHandler && toastHandler('Error al exportar a excel. ' + err.message);
  } finally {
    handleLoading({ [loadingKey]: false });
  }
}
