import React, { Suspense, lazy, useEffect } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import history from "./helpers/history";
import { useSelector } from "react-redux";
import { LinearProgress } from "@material-ui/core";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import Container from "./components/AppContent";
import AppLoading from "./components/AppLoading";
import HomePage from "./routes/HomePage";
import SearchPage from "./routes/SearchPage";
import base_path from "./helpers/base_path";
import firebase from "./helpers/firebase";
import gapi from "./helpers/googleBooksApi";

gapi.setUserAccessToken(firebase.getCurrentUser()?.getIdToken);

const Auth = lazy(() => import("./routes/Auth"));
const Bookshelf = lazy(() => import("./routes/Bookshelf"));
const Book = lazy(() => import("./routes/Book"));
const PageNotFound = lazy(() => import("./routes/PageNotFound"));

function App() {
  const page = useSelector((state) => state.document);

  useEffect(() => {
    document.title = `${
      typeof page.title !== "string" ? "" : page.title + " - "
    }SweetBook`;
  }, [page.title]);

  return (
    <div className="App">
      {page.loading && (
        <LinearProgress
          style={{ position: "fixed", top: 0, width: "100%", zIndex: 999 }}
        />
      )}
      <Router history={history} basename={base_path}>
        <Suspense fallback={<AppLoading />}>
          <AppHeader />
          <Container>
            <Switch>
              <Route exact path={base_path + "/"} component={HomePage} />
              <Route exact path={base_path + "/auth"} component={Auth} />
              <Route path={base_path + "/search"} component={SearchPage} />
              <Route path={base_path + "/book/*"} component={Book} />
              <PrivateRoute
                path={base_path + "/my-library/:bookshelfID?"}
                component={Bookshelf}
              />
              <Route path="*" component={PageNotFound} />
            </Switch>
          </Container>
          <AppFooter />
        </Suspense>
      </Router>
    </div>
  );
}

function PrivateRoute({ component: Component, ...rest }) {
  const user = firebase.getCurrentUser();

  return (
    <Route
      {...rest}
      render={(props) =>
        user?.uid ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: base_path + "/auth",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

export default App;
