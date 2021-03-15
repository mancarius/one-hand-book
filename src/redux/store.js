import { compose, createStore, applyMiddleware } from "redux";
import rootReducers from "./reducers";
import { loginMiddleware } from "./user/middlewares";

const devtool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

export default createStore(rootReducers, devtool);

/*
export default compose(
  applyMiddleware( loginMiddleware ),
  devtool
)(createStore)(rootReducers);
*/