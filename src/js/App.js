import React, { Component, PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <MuiThemeProvider className="page-container">
        {this.props.children}
      </MuiThemeProvider>
    );
  }
}
