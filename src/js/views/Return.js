import React, { Component } from 'react';
import { List, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadFile, addToUserGroup, createUserGroup, addCustomCompany } from '../ducks/return';
import { Map } from 'immutable';
import Dropzone from 'react-dropzone';
import Table from '../components/Table';
import internalIntrest from '../services/internalIntrest';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import data from '../data';
import stringDiffMetric from '../services/string-distance';

// TODO
let companysImmutable, companys, priceList;
data().then(data => {
  companysImmutable = data;
  companysImmutable.toJS();

  priceList = companysImmutable
  .map((item, key) => <MenuItem value={key} primaryText={item.Name} />)
  .toList()
  .toJS();

  priceList.unshift(<MenuItem value="custom" primaryText="Custom Company" />);
}); // data.toList().sortBy(item => item.get('Name'));
// const companys = companysImmutable.toJS();



console.log('stringDiff', stringDiff, companysImmutable, companys);


//Debug
const stringDiff = stringDiffMetric('hej', 'hejsan');
console.log('stringDiff', stringDiff);

const msToYears = 1/(1000*60*60*24*365.25);
function yearFrac(date) {
  const diffMs = Date.now() - date;
  const diffYears = msToYears*diffMs; // yes.. yes not exact
  return diffYears;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

class View extends Component {

  static propTypes = {
    loadFile: PropTypes.func.isRequired,
    transactions: PropTypes.object.isRequired,
    addToUserGroup: PropTypes.func.isRequired,
    createUserGroup: PropTypes.func.isRequired,
    addCustomCompany: PropTypes.func.isRequired
  };

  state = {
    nowValue: 1691212,
  }

  addGroup = () => {
    const { groups, addToUserGroup, createUserGroup, addCustomCompany } = this.props;
    const { groupText, selected, dropdown, customPrice } = this.state;

    // TODO add custom companies
    if (dropdown == 'custom') {
      const groupData = new Map({
        borsDataName: groupText,
        selected: selected.map(index => groups.getIn([index, 0, 'name']))
      });

      console.log('que?', groupText, groupData.toJS());
      addCustomCompany(groupText, customPrice);
      addToUserGroup(groupText, groupData);
    } else {
      const priceData = companys[dropdown];
      const groupData = new Map({
        borsDataName: priceData.CountryUrlName,
        selected: selected.map(index => groups.getIn([index, 0, 'name']))
      });

      console.log('que?', groupText, groupData.toJS());
      addToUserGroup(groupText, groupData);
    }
  }

  render () {
    const { groups, addToUserGroup, createUserGroup, userGroups, customCompanies } = this.props;
    const { groupText, nowValue, selected } = this.state;

    if (customCompanies) console.log('customCompanies.toJS()', customCompanies.toJS());

    const companiesExtended = companys.concat(customCompanies.toJS());
    const companiesExtendedImmutable = fromJS(companiesExtended);

    console.log('state', selected);

    // console.log('companiesExtended', companiesExtended);

    const headers = [
      'Group',
      'Sum',
      'Shares',
      'Internal Rate Of Return'
    ];

    const table = groups.map((item, key) => {
      const name = item.getIn([0, 'name'], '') || '';
      const sumTransactions = item
        .reduce((sum, item) => sum + item.get('sum'), 0);

      // const numberOfShares = item
      //   .filter(item => item.get('type') && (item.get('type').toLowerCase() == 'KÖPT' || item.get('type').toLowerCase() == 'SÄLJ'))
      //   // .filter(item => item.get('type') || item.get('type').toLowerCase() !== 'utdelning')
      //   .reduce((sum, item) => sum + item.get('amount'), 0);

      const numberOfShares = item
        .filter(item => item.get('type') !== 'Utdelning')
        .reduce((sum, item) => sum + item.get('amount'), 0);


      const mappedData = item
        .filter(item => isNumeric(item.get('sum')))
        .map((item) => ({
            yearFrac: yearFrac(item.get('date')),
            value: item.get('sum')
          }));

      console.log('the Name', name);

      const bestStringMatch = companysImmutable
        .filter(c => c.get('CountryUrlName'))
        .minBy(c => stringDiffMetric(c.get('CountryUrlName').toLowerCase(), name.toLowerCase()));

      console.log('bestStringMatch', item.toJS(), bestStringMatch);

      const minMetric = stringDiffMetric(bestStringMatch.get('CountryUrlName').toLowerCase(), name.toLowerCase());

      const price = minMetric < 8 ? bestStringMatch.get('price') : 0;
      const nowValue = numberOfShares*price;

      console.log(
        'name: ', name,
        bestStringMatch.get('CountryUrlName'),
        stringDiffMetric(bestStringMatch.get('CountryUrlName').toLowerCase(), name.toLowerCase()),
        'nowValue', nowValue,
        'numberOfShares', numberOfShares
      );

      const intrest = internalIntrest(mappedData, nowValue);

      return [name, sumTransactions, numberOfShares, Math.round(100*intrest) + '%'];
    });

    const tableGroups = userGroups.map((userGroup, name) => {
      // return ['asdf'];
      const item = userGroup
        .get('selected')
        .reduce((acc, groupIndex) =>
          acc.concat(groups.find((g) => g.getIn([0, 'name']) === groupIndex))
          , new List());

      // console.log('userGroup', userGroup, 'item', item.toJS());

      const sumTransactions = item
        .reduce((sum, item) => sum + item.get('sum'), 0);

      const numberOfShares = item
        .filter(item => item.get('type') !== 'Utdelning')
        .reduce((sum, item) => sum + item.get('amount'), 0);

      const mappedData = item
        .filter(item => isNumeric(item.get('sum')))
        .map((item) => ({
          yearFrac: yearFrac(item.get('date')),
          value: item.get('sum')
        }));

      const borsdataName = userGroup.get('borsDataName');
      if (companiesExtended)
        console.log('companiesExtended', companiesExtended, borsdataName);

      const price = companiesExtended.find(c => c.CountryUrlName === borsdataName).price;
      const value = numberOfShares*price;
      const intrest = internalIntrest(mappedData, value);

      return [name, sumTransactions + value, numberOfShares, Math.round(100*intrest) + '%'];
      // return ['gurkburk', 123, 321, Math.round(100*1) + '%'];
    });

    // console.log('groups', groups.toJS());
    // console.log('this.state.dropDown', this.state);

    const groupedByType = groups.flatten(1).groupBy(item => item.get('type'));

    const deposits = groupedByType.get('Ins�ttning', List());
    const withdraws = groupedByType.get('Uttag', List());

    const transactions = deposits.concat(withdraws).map((item) => ({
      yearFrac: yearFrac(item.get('date')),
      value: -item.get('sum')
    }));

    const deposited = deposits.reduce((sum, item) => sum - item.get('sum'), 0);
    const withdrawed = withdraws.reduce((sum, item) => sum - item.get('sum'), 0);
    const totalEarnings = deposited + withdrawed + nowValue;

    const totalInternalIntrest = internalIntrest(transactions.toJS(), nowValue);

    // console.log('transactions', transactions.toJS());
    // console.log('deposited', deposited);
    // console.log('withdrawed', withdrawed);
    // console.log('totalInternalIntrest', totalInternalIntrest);

    return (
      <div>
        <Dropzone onDrop={this.props.loadFile}>
          <div>Upload transaction history csv</div>
        </Dropzone>
        <h2>Total Earnings: {Math.round(totalEarnings)}</h2>
        <h2>Total IIR: {Math.round(100*totalInternalIntrest)}%</h2>
        <RaisedButton onClick ={this.addGroup} label="Add Group"/>
        <TextField
          onChange={(event, text) => this.setState({ groupText: text })}
          hintText="Group Name"
        />
        <DropDownMenu
          value={this.state.dropdown}
          onChange={(event, index, value) => this.setState({ dropdown: value })}
        >
          {priceList}
        </DropDownMenu>
        {this.state.dropdown == 'custom' ? (
          <TextField
            onChange={(event, text) => this.setState({ customPrice: Number(text) })}
            hintText="Price"
          />
        ) : false}
        <Table
          headers={headers}
          table={tableGroups}
        />
        <Table
          headers={headers}
          table={table}
          checkbox
          onRowSelection={selected => this.setState({ selected })}
        />
      </div>
    );
  }
}

// console.log('companysImmutable', companysImmutable.toJS());

function mapStateToProps(state) {
  console.log('state', state.returnReducer.toJS());
  return {
    userGroups: state.returnReducer
      .get('userGroups', new Map()),
    groups: state.returnReducer
      .get('transactions', new Map())
      .get('dataPoints', new Map())
      .groupBy(point => point.get('name'))
      // .filter((item, key) => key)
      // .map((group, key) => group.set('stringMatch', companysImmutable
      //   .filter(c => c.get('CountryUrlName'))
      //   .minBy(c => stringDiffMetric(c.get('CountryUrlName').toLowerCase(), key.toLowerCase()))))
      .toList(),
    customCompanies: state.returnReducer.get('customCompanies'),
    // transactions: state.returnReducer.get('transactions', new Map()),
    stocks: state.stockReducer,
    projectionTime: 5
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadFile: bindActionCreators(loadFile, dispatch),
    addToUserGroup: bindActionCreators(addToUserGroup, dispatch),
    createUserGroup: bindActionCreators(createUserGroup, dispatch),
    addCustomCompany: bindActionCreators(addCustomCompany, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(View);
