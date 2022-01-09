import { PDFDocument } from "pdf-lib";

export async function loadPDF(pdfData) {
  let error;
  let pdfDoc = await PDFDocument.load(pdfData).catch((err) => {
    error = err;
    return PDFDocument.load(pdfData, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
    });
  });
  return {
    pdfDoc,
    error,
  };
}
