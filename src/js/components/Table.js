import React, { Component, PropTypes } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import { Link } from 'react-router';
import data from '../data';

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
            <TableHeaderColumn>Price / Stock</TableHeaderColumn>
            <TableHeaderColumn>Estimated Return</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((company, key) => (
            <TableRow key={key} >
              <TableRowColumn>{company.Name}</TableRowColumn>
              <TableRowColumn>{company.price}</TableRowColumn>
              <TableRowColumn><Link to={`/stock-prediction/company/${company.ShortName}`} >{Math.round(100 * company.lsEarnings)}%</Link></TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}
