import { combineReducers } from "redux";
import user from "./user/reducers";
import document from "./document/reducers.js";


export default combineReducers({
    user,
    document
});