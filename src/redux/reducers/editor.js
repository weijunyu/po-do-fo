import {
  START_DRAWING,
  STOP_DRAWING,
  SET_SHOW_SAVE_CONFIRMATION,
  SAVE_DRAW_RECT,
  SAVE_CANVAS_MOUSEUP_POSITION
} from "../actionTypes";

const initialState = {
  drawing: false,
  showSaveConfirmation: false,
  drawnRectDimensions: {},
  canvasMouseupPosition: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case START_DRAWING: {
      return {
        ...state,
        drawing: action.payload
      };
    }
    case STOP_DRAWING: {
      return {
        ...state,
        drawing: false
      };
    }
    case SET_SHOW_SAVE_CONFIRMATION: {
      return {
        ...state,
        showSaveConfirmation: action.payload
      };
    }
    case SAVE_DRAW_RECT: {
      return { ...state, drawnRectDimensions: action.payload };
    }
    case SAVE_CANVAS_MOUSEUP_POSITION: {
      return {
        ...state,
        canvasMouseupPosition: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
