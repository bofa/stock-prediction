import React, { Component } from 'react';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadFile, addToUserGroup, createUserGroup } from '../ducks/return';
import { Map } from 'immutable';
import Dropzone from 'react-dropzone';
import Table from '../components/Table';
import internalIntrest from '../services/internalIntrest';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import data from '../data';

const companys = data.toList().sortBy(item => item.get('Name')).toJS();

function yearFrac(date) {
  var ageDifMs = Date.now() - (new Date(date)).getTime();
  var ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const priceList = companys.map((item, key) => <MenuItem value={key} primaryText={item.Name} />);

class View extends Component {

  static propTypes = {
    loadFile: PropTypes.func.isRequired,
    transactions: PropTypes.object.isRequired,
    addToUserGroup: PropTypes.func.isRequired,
    createUserGroup: PropTypes.func.isRequired
  };

  state = {
  }

  addGroup = () => {
    const { groups, addToUserGroup, createUserGroup } = this.props;
    const { groupText, selected, dropdown } = this.state;
    const priceData = companys[dropdown];

    const groupData = new Map({
      borsDataName: priceData.CountryUrlName,
      selected: selected.map(index => groups.getIn([index, 0, 'name']))
    });

    addToUserGroup(groupText, groupData);
  }

  render () {
    const { groups, addToUserGroup, createUserGroup, userGroups } = this.props;
    const { groupText } = this.state;

    const headers = [
      'Group',
      'Sum',
      'Shares',
      'Internal Rate Of Return'
    ];

    const table = groups.map((item, key) => {
      const name = item.getIn([0, 'name']);
      const sumTransactions = item
        .reduce((sum, item) => sum + item.get('sum'), 0);

      const numberOfShares = item
        .filter(item => !item.get('type') || item.get('type').toLowerCase() !== 'utdelning')
        .reduce((sum, item) => sum + item.get('amount'), 0);

      const mappedData = item
      .filter(item => isNumeric(item.get('sum')))
      .map((item) => ({
          yearFrac: yearFrac(item.get('date')),
          value: item.get('sum')
        }));

      const intrest = internalIntrest(mappedData, 0);

      return [name, sumTransactions, numberOfShares, Math.round(100*intrest) + '%'];
    });

    console.log('groups', groups.toJS());

    const table2 = userGroups.map((userGroup, name) => {
      // return ['asdf'];
      const item = userGroup
        .get('selected')
        .reduce((acc, groupIndex) =>
          acc.concat(groups.find((g) => g.getIn([0, 'name']) === groupIndex))
          , new List());

      console.log('userGroup', userGroup, 'item', item.toJS());

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
      const price = companys.find(c => c.CountryUrlName === borsdataName).price;
      const value = numberOfShares*price;
      const intrest = internalIntrest(mappedData, value);

      return [name, sumTransactions + value, numberOfShares, Math.round(100*intrest) + '%'];
    });

    return (
      <div>
        <Dropzone onDrop={this.props.loadFile}>
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
        <RaisedButton onClick ={this.addGroup} label="Add Group"/>
        <TextField
          onChange={(event, text) => this.setState({ groupText: text })}
          hintText="Group Name"
        />
        <DropDownMenu
          value={this.state.dropDown}
          onChange={(event, index, value) => this.setState({ dropdown: value })}
        >
          {priceList}
        </DropDownMenu>
        <Table
          headers={headers}
          table={table2}
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

function mapStateToProps(state) {
  return {
    userGroups: state.returnReducer
      .get('userGroups', new Map()),
    groups: state.returnReducer
      .get('transactions', new Map())
      .get('dataPoints', new Map())
      .groupBy(point => point.get('name'))
      .toList(),
    // transactions: state.returnReducer.get('transactions', new Map()),
    stocks: state.stockReducer,
    projectionTime: 5
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadFile: bindActionCreators(loadFile, dispatch),
    addToUserGroup: bindActionCreators(addToUserGroup, dispatch),
    createUserGroup: bindActionCreators(createUserGroup, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(View);
