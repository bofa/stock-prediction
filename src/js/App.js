import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { loadSheet } from './ducks/stocks';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    loadSheet: PropTypes.func
  };

  componentWillMount() {
    this.props.loadSheet();
  }

  render() {
    return (
      <MuiThemeProvider className="page-container">
        {this.props.children}
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadSheet: bindActionCreators(loadSheet, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
