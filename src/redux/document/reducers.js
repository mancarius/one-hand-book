/* eslint-disable import/no-anonymous-default-export */
import header from './header/reducers'
import nav from './navigation/reducers'
import loading from './loading/reducers'
import title from './title/reducers'
import { combineReducers } from "redux";


export default combineReducers({
    title,
    header,
    nav,
    loading,
})