import { PDFDocument } from "pdf-lib";
import uuidv4 from "uuid/v4";
import {
  ADD_PAGES,
  MOVE_PAGE_UP,
  MOVE_PAGE_DOWN,
  REMOVE_PAGE
} from "./actionTypes";
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
        newDocs.push({
          id: uuidv4(),
          bytes: newDocBytes
        });
      }
      dispatch(addPages(newDocs));
    };
    reader.readAsArrayBuffer(fileRef);
  };
};
export const movePageUp = pageIndex => ({
  type: MOVE_PAGE_UP,
  payload: pageIndex
});
export const movePageDown = pageIndex => ({
  type: MOVE_PAGE_DOWN,
  payload: pageIndex
});
export const removePage = pageIndex => ({
  type: REMOVE_PAGE,
  payload: pageIndex
});
