import { PDFDocument } from "pdf-lib";
import { ADD_PAGES } from "./actionTypes";
export const addPages = pages => ({
  type: ADD_PAGES,
  payload: pages
});
export const loadPagesFromFile = file => {
  return dispatch => {
    let fileRef = file.data;
    let reader = new FileReader();
    reader.onload = async () => {
      const pdfDoc = await PDFDocument.load(reader.result);

      let newDocs = [];
      for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        let newDoc = await PDFDocument.create();
        let [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
        newDoc.addPage(copiedPage);
        let newDocBytes = await newDoc.save();
        newDocs.push(newDocBytes);
      }
      dispatch(addPages(newDocs));
    };
    reader.readAsArrayBuffer(fileRef);
  };
};