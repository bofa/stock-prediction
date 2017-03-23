import React, { Component, PropTypes } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import { leastSquarceEstimate } from '../services/ls';
import data from '../../data/data.json';
import { data as companyNames } from '../../data/companies.json';
import { data as screener } from '../../data/screener.json';
import { Link } from 'react-router';


function earningsEstimate(earnings) {
  const [bias, slop, cov] = leastSquarceEstimate(earnings.map(spark => spark.yield));
  return [bias, [bias, slop, cov]];
}

console.log('data', data);
console.log('companyNames', companyNames);
console.log('screener', screener);

const mergeData = companyNames.map((company, index) => {
  const price = screener.find(screenerCompany => screenerCompany.ShortName === company.ShortName).KpisValues[1].NumValue;
  const [estimate, params] = earningsEstimate(data[index][5].Sparkline);

  return {
    ...company,
    history: data[index],
    price,
    params,
    lsEarnings: estimate / price
  };
}).sort((c1, c2) => c2.lsEarnings - c1.lsEarnings);

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
            <TableHeaderColumn>Price / Stock</TableHeaderColumn>
            <TableHeaderColumn>Estimated Return</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mergeData.map((company, key) => (
            <TableRow key={key} >
              <TableRowColumn>{company.Name}</TableRowColumn>
              <TableRowColumn>{company.price}</TableRowColumn>
              <TableRowColumn><Link to="/stock-prediction/404">{Math.round(100 * company.lsEarnings)}%</Link></TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}
