import { createStore, applyMiddleware, compose } from "redux";
import rootReducers from "./reducers";
import { logoutMiddleware } from './user/middlewares'


const devtool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

export default compose(
  applyMiddleware(logoutMiddleware),
)(createStore)(rootReducers);
