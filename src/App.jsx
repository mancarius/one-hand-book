import React, { Suspense, lazy } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useSelector } from "react-redux";
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter'
import Container from './components/AppContent'
import AppLoading from './components/AppLoading'
import HomePage from './routes/HomePage'
import SearchPage from './routes/SearchPage'


const Auth = lazy(() => import("./routes/Auth"));
const Bookshelf = lazy(() => import("./routes/Bookshelf"));
const Book = lazy(() => import("./routes/Book"));


function App() {
  const user = useSelector((state) => state.user);

  return (
    <div className="App">
      <Router>
        <Suspense fallback={<AppLoading />}>
          <AppHeader />
            <Container>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/auth" component={Auth} />
                <Route path="/search" component={SearchPage} />
                <Route path="/book" component={Book} />
                <PrivateRoute
                  path="/bookshelf/:bookshelfID"
                  component={Bookshelf}
                  isAuthenticated={user?.token}
                />
                <Route path="*" component={HomePage} />
              </Switch>
            </Container>
          <AppFooter />
        </Suspense>
      </Router>
    </div>
  );
}

function PrivateRoute({ component: Component, isAuthenticated, ...rest }) {
  
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/auth",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}


export default App;