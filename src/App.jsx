import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import AppHeader from './components/AppHeader';
import HomePage from './routes/HomePage'
import AppFooter from './components/AppFooter'
import Container from './components/AppContent'
import Auth from './routes/Auth'
import SearchPage from './routes/SearchPage'

function App() {
  return (
    <div className="App">
      <Router>
        <AppHeader />
        <Container>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/auth" component={Auth} />
            <Route exact path="/search"  component={SearchPage} />
          </Switch>
        </Container>
        <AppFooter />
      </Router>
    </div>
  );
}

export default App;