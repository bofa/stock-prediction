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
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Avg Dividend Ratio</TableHeaderColumn>
            <TableHeaderColumn>Estimated Return</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
        >
          {data.map((company, key) => (
            <TableRow key={key} >
              <TableRowColumn>
                <a href={`https://borsdata.se/${company.CountryUrlName}/nyckeltal`} target="_blank">
                  {company.Name}
                </a>
              </TableRowColumn>
              <TableRowColumn>{Math.round(100 * company.avgDividendRatio)}%</TableRowColumn>
              <TableRowColumn><Link to={`/stock-prediction/company/${company.ShortName}`} >{Math.round(100 * company.lsEarnings)}%</Link></TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}
