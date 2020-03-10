import { PDFDocument } from "pdf-lib";
import uuidv4 from "uuid/v4";
import {
  ADD_PAGES,
  SET_PAGE,
  MOVE_PAGE_UP,
  MOVE_PAGE_DOWN,
  REMOVE_PAGE,
  START_DRAWING,
  STOP_DRAWING,
  SET_SHOW_SAVE_CONFIRMATION,
  SAVE_DRAW_RECT,
  SAVE_CANVAS_MOUSEUP_POSITION
} from "./actionTypes";
export const addPages = pages => ({
  type: ADD_PAGES,
  payload: pages
});
export const setPage = (pageIndex, pageBytes) => ({
  type: SET_PAGE,
  payload: {
    pageIndex,
    pageBytes
  }
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

export const startDrawing = ({ mode }) => {
  return {
    type: START_DRAWING,
    payload: {
      mode
    }
  }
};
export const stopDrawing = () => ({ type: STOP_DRAWING });
export const saveCanvasDrawingDetails = ({
  canvasMouseupPosition = {},
  drawnRectDimensions = {}
}) => {
  return dispatch => {
    dispatch(saveCanvasMouseupPosition(canvasMouseupPosition));
    dispatch(saveDrawRectDimensions(drawnRectDimensions));
  };
};
export const setShowSaveConfirmation = show => ({
  type: SET_SHOW_SAVE_CONFIRMATION,
  payload: show
});
export const saveDrawRectDimensions = rect => ({
  type: SAVE_DRAW_RECT,
  payload: rect
});
export const saveCanvasMouseupPosition = position => {
  return {
    type: SAVE_CANVAS_MOUSEUP_POSITION,
    payload: position
  };
};
