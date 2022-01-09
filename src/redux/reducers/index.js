import { combineReducers } from "redux";
import { pagesReducer } from "./pages";
import { editorReducer } from "./editor";

export default combineReducers({ pages: pagesReducer, editor: editorReducer });
