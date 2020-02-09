import {
  START_DRAWING,
  STOP_DRAWING,
  SET_SHOW_SAVE_CONFIRMATION,
  CANCEL_DRAWING,
  SAVE_DRAW_RECT
} from "../actionTypes";

const initialState = {
  drawing: false,
  showSaveConfirmation: false,
  cancelDrawingIndicator: false,
  drawnRectDimensions: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case START_DRAWING: {
      return {
        ...state,
        drawing: true
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
    case CANCEL_DRAWING: {
      return {
        ...state,
        cancelDrawingIndicator: !state.cancelDrawingIndicator
      };
    }
    case SAVE_DRAW_RECT: {
      return { ...state, drawnRectDimensions: action.payload };
    }
    default: {
      return state;
    }
  }
}
