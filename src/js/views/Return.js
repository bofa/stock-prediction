import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadFile } from '../ducks/return';
import { Map } from 'immutable';
import Dropzone from 'react-dropzone';
import IconButton from 'material-ui/IconButton';
import earningsEstimate, { getProjection } from '../services/ls';

// const yieldArray = stocks.getIn([stock, 5, 'Sparkline'], new List());

class View extends Component {

  static propTypes = {
    loadFile: PropTypes.func.isRequired,
    transactions: PropTypes.object.isRequired
  };

  state = {}

  render () {
    const { transactions } = this.props;

    console.log('transactions', transactions.toJS());

    return (
      <div>
        <Dropzone onDrop={this.props.loadFile}>
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
        {transactions.get('dataPoints', new Map()).map(item => item.get(3))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    transactions: state.returnReducer.get('transactions', new Map()),
    stocks: state.stockReducer,
    projectionTime: 5
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadFile: bindActionCreators(loadFile, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(View);
