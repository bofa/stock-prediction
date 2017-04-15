import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadFile } from '../ducks/return';
import { Map } from 'immutable';
import Dropzone from 'react-dropzone';
import Table from '../components/Table';
import internalIntrest from '../services/internalIntrest';

// const yieldArray = stocks.getIn([stock, 5, 'Sparkline'], new List());
function yearFrac(date) {
  var ageDifMs = Date.now() - (new Date(date)).getTime();
  var ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

class View extends Component {

  static propTypes = {
    loadFile: PropTypes.func.isRequired,
    transactions: PropTypes.object.isRequired
  };

  state = {}

  render () {
    const { transactions } = this.props;

    const tranHeaders = transactions.get('headers');
    const groups = transactions
      .get('dataPoints', new Map())
      .groupBy(point => point.get(3))
      // .filter((item, key) => key === 'Handelsbanken A');

    // console.log('Headers', tranHeaders.toJS());
    // console.log('groups', groups.toJS());

    const headers = [
      'Group',
      'Sum',
      'Shares',
      'Internal Rate Of Return'
    ];

    const table = groups.map((item, key) => {
      const name = item.getIn([0, 3]);
      const sumTransactions = item.reduce((sum, item) => sum + item.get(6), 0);

      const numberOfShares = item
        .filter(item => item.get(2) !== 'Utdelning')
        .reduce((sum, item) => sum + item.get(4), 0);

      const mappedData = item
        .filter(item => isNumeric(item.get(6)))
        .map((item) => ({
          yearFrac: yearFrac(item.get(0)),
          value: item.get(6)
        }));

      const intrest = internalIntrest(mappedData, 0);

      return [name, sumTransactions, numberOfShares, Math.round(100*intrest) + '%'];
    });

    return (
      <div>
        <Dropzone onDrop={this.props.loadFile}>
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
        <Table headers={headers} table={table} />
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
