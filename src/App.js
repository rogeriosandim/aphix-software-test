import 'react-perfect-scrollbar/dist/css/styles.css';
import React, { Component } from 'react';
import { ThemeProvider } from '@material-ui/core';
import './assets/scss/index.scss';
import theme from './theme';
import Routes from './routes';

export default class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    );
  }
}
