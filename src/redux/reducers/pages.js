import { ADD_PAGE, ADD_PAGES } from "../actionTypes";
const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_PAGE: {
      const page = action.payload;
      return [...state, page];
    }
    case ADD_PAGES: {
      const pages = action.payload;
      return [...state, ...pages];
    }
    default:
      return state;
  }
}
