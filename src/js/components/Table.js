import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { Link } from 'react-router';
import bdIcon from '../../images/bd.png';
import { rootRoute } from '../routes';

const tableItem = (company, key) =>
  <TableRow key={key} >
    <TableRowColumn>
      <a href={`https://borsdata.se/${company.get('CountryUrlName')}/nyckeltal`} target="_blank">
        <img border="0" alt="W3Schools" src={bdIcon} />
      </a>
      {company.get('Name')}
    </TableRowColumn>
    <TableRowColumn>
      <Link to={`${rootRoute}/company/${company.get('ShortName')}`} >
        {Math.round(1000 * company.get('estimate')) / 10}%
      </Link>
    </TableRowColumn>
    <TableRowColumn>
      {Math.round(100 * company.getIn(['dividend', -1, 'yield']) / company.get('price'))}%
    </TableRowColumn>
    <TableRowColumn>
      {Math.round(company.get('price') / company.getIn(['earnings', -1, 'yield']))}
    </TableRowColumn>
    <TableRowColumn>
      {Math.round(100 * company.get('avgDividendRatio'))}%
    </TableRowColumn>
  </TableRow>
;

export default class App extends Component {
  static propTypes = {
    companys: PropTypes.object.isRequired
  };

  render() {
    const { companys } = this.props;
    console.log('companys', companys.toJS());

    return (
      <Table>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Estimated Return</TableHeaderColumn>
            <TableHeaderColumn>Yield</TableHeaderColumn>
            <TableHeaderColumn>P/E</TableHeaderColumn>
            <TableHeaderColumn>Avg Dividend Ratio</TableHeaderColumn>
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
