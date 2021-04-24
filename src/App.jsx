import React, { Suspense, lazy, useEffect } from 'react'
import {
  Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import history from './helpers/history';
import { useSelector } from "react-redux";
import {LinearProgress} from '@material-ui/core'
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter'
import Container from './components/AppContent'
import AppLoading from './components/AppLoading'
import HomePage from './routes/HomePage'
import SearchPage from './routes/SearchPage'



const Auth = lazy(() => import("./routes/Auth"));
const Bookshelf = lazy(() => import("./routes/Bookshelf"));
const Book = lazy(() => import("./routes/Book"));
const PageNotFound = lazy(() => import("./routes/PageNotFound"));


function App() {
  const user = useSelector(state => state.user);
  const page = useSelector( state => state.document)

  useEffect(() => {
    document.title = `${typeof page.title !== 'string' ? '' : page.title + ' - '}SweetBook`;
  },[page.title])

  return (
    <div className="App">
      { page.loading && <LinearProgress style={{ position: 'fixed', top: 0, width: '100%', zIndex: 999 }} />}
      <Router history={history}>
        <Suspense fallback={<AppLoading />}>
          <AppHeader />
          <Container>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/auth" component={Auth} />
              <Route path="/search" component={SearchPage} />
              <Route path="/book/*" component={Book} />
              <PrivateRoute
                path="/my-bookshelves/:bookshelfID?"
                component={Bookshelf}
                isAuthenticated={user?.token}
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