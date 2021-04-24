import React from 'react';
import ReactDOM from 'react-dom';
import store from "./redux/store";
import { Provider } from "react-redux";
import { SnackbarProvider } from 'notistack';
import Collapse from '@material-ui/core/Collapse';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './helpers/muiTheme'
import { SnackbarUtilsConfigurator } from './helpers/SnackBarUtils';



ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider
      maxSnack={3}
      dense
      hideIconVariant
      preventDuplicate
      anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
      }}
      TransitionComponent={Collapse}
    > 
      <ThemeProvider theme={theme}>
        <SnackbarUtilsConfigurator />
        <App />
      </ThemeProvider>
    </SnackbarProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);