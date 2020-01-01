import {
  ADD_PAGE,
  ADD_PAGES,
  MOVE_PAGE_UP,
  MOVE_PAGE_DOWN,
  REMOVE_PAGE
} from "../actionTypes";
const initialState = [];

function swapArrayIndices(arr, first, second) {
  let temp = arr[first];
  arr[first] = arr[second];
  arr[second] = temp;
}

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
    case MOVE_PAGE_UP: {
      let currentIndex = action.payload;
      if (currentIndex === 0) return state;
      let pages = [...state];
      if (currentIndex !== 0) {
        swapArrayIndices(pages, currentIndex, currentIndex - 1);
      }
      return pages;
    }
    case MOVE_PAGE_DOWN: {
      let currentIndex = action.payload;
      if (currentIndex === state.length - 1) return state;
      let pages = [...state];
      if (currentIndex !== pages.length - 1) {
        swapArrayIndices(pages, currentIndex, currentIndex + 1);
      }
      return pages;
    }
    case REMOVE_PAGE: {
      return state.filter((page, index) => {
        return index !== action.payload;
      });
    }
    default:
      return state;
  }
}
