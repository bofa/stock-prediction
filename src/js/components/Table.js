import React, { Component, PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { Link } from 'react-router';
import bdIcon from '../../images/bd.png';

const tableItem = (company, key) =>
  <TableRow key={key} >
    <TableRowColumn>
      <a href={`https://borsdata.se/${company.get('CountryUrlName')}/nyckeltal`} target="_blank">
        <img border="0" alt="W3Schools" src={bdIcon} />
      </a>
      {company.get('Name')}
    </TableRowColumn>
    <TableRowColumn>{company.get('price')}</TableRowColumn>
    <TableRowColumn>{Math.round(100 * company.get('avgDividendRatio'))}%</TableRowColumn>
    <TableRowColumn><Link to={`/stock-prediction/company/${company.get('ShortName')}`} >{Math.round(100 * company.get('estimate'))}%</Link></TableRowColumn>
  </TableRow>
;

export default class App extends Component {
  static propTypes = {
    companys: PropTypes.object.isRequired
  };

  render() {
    const { companys } = this.props;

    return (
      <Table>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Price</TableHeaderColumn>
            <TableHeaderColumn>Avg Dividend Ratio</TableHeaderColumn>
            <TableHeaderColumn>Estimated Return</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
        >
          {companys.map(tableItem)}
        </TableBody>
      </Table>
    );
  }
}
