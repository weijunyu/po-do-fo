import { START_DRAWING, STOP_DRAWING } from "../actionTypes";

const initialState = {
  drawing: false
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
    default: {
      return state;
    }
  }
}
