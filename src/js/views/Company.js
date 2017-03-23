import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import BarChart from '../components/BarChart';
import data from '../data';

// const yieldArray = stocks.getIn([stock, 5, 'Sparkline'], new List());

export default class Company extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  };

  render () {
    const shortName = this.props.params.company;
    const companyData = data.find(company => company.ShortName === shortName);
    const earnings = companyData.history[5].Sparkline;

    console.log('companyData', companyData);
    console.log('earnings', earnings);

    return (
      <div>
        <h1>
          <Link to='/stock-prediction'>Back </Link>
          {companyData.Name}
        </h1>
        <BarChart width={400} height={400} data={earnings} />
        <hr />
        <Link to='/stock-prediction'>Back To Home View</Link>
      </div>
    );
  }
}
