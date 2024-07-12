import { thunk } from "redux-thunk";
import { reducer } from "./reducer";
import { createStore, applyMiddleware } from "redux";


export const store = createStore(reducer, applyMiddleware(thunk));