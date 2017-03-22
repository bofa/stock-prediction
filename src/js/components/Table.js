import React, { Component, PropTypes } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import data from '../../data/data.json';
import { data as companyNames } from '../../data/companies.json';
// {data.map(() => 'args!\n')}

console.log('data', data);
console.log('companyNames', companyNames);

const mergeData = companyNames.map((company, index) => ({
  ...company,
  history: data[index]
}))

console.log('mergeData', mergeData);

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  render() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mergeData.map((company, key) => (
            <TableRow key={key} >
              <TableRowColumn>{company.Name}</TableRowColumn>
              <TableRowColumn>{company.history[5].Value}</TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}
