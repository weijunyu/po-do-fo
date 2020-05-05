import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export function colorDataToCssAttribute(colorData) {
  return `rgba(${colorData.r}, ${colorData.g}, ${colorData.b}, ${colorData.a})`;
}

export async function exportPdf(pages) {
  let newDocument = await PDFDocument.create();
  for (let page of pages) {
    let pageDoc = await PDFDocument.load(page.bytes);
    const [pdfPage] = await newDocument.copyPages(pageDoc, [0]);
    newDocument.addPage(pdfPage);
  }
  let final = await newDocument.save();
  const file = new File([final], "export.pdf", { type: "application/pdf" });
  saveAs(file);
}

export async function exportPdfInImages() {
  // new pdf doc
  let newDoc = await PDFDocument.create();
  let canvases = document.querySelectorAll("canvas.react-pdf__Page__canvas");
  // for every canvas element,
  // get image, make new page, copy image to new page
  for (let canvas of canvases) {
    let b64CanvasImage = canvas.toDataURL();
    let pdfImg = await newDoc.embedPng(b64CanvasImage);
    let newPage = newDoc.addPage([pdfImg.width, pdfImg.height]);
    newPage.drawImage(pdfImg, {
      x: 0,
      y: 0,
      width: pdfImg.width,
      height: pdfImg.height,
    });
  }
  // let user download pdf doc
  let final = await newDoc.save();
  const file = new File([final], "export.pdf", { type: "application/pdf" });
  saveAs(file);
}
