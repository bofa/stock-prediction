import { List, Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import 'react-vis/dist/main.scss';
import { rootRoute } from '../routes';
import bdIcon from '../../images/bd.png';
import Table from '../components/Table';
import Filter from '../components/Filter';
import companys from '../data';
import { dividendEstimate, earningsEstimate, yearsToPayOff } from '../services/ls';

// const buttonStyle = {
//   margin: 12,
// };

class StockApp extends Component {
  static propTypes = {
    stocks: PropTypes.object.isRequired,
    positiveEarningsGrowth: PropTypes.boolean,
    positiveRevenuGrowth: PropTypes.boolean,
    positiveFreeCashFlowGrowth: PropTypes.boolean,
    minHistoryLength: PropTypes.integer,
    minCorrelation: PropTypes.number,
    projectionTime: PropTypes.integer,
    sortOn: PropTypes.string,
    intrest: PropTypes.number
  };

  state = {
    companies: new Map()
  }

  render() {
    const {
      stocks,
      positiveEarningsGrowth,
      positiveRevenuGrowth,
      positiveFreeCashFlowGrowth,
      minHistoryLength,
      projectionTime,
      minCorrelation,
      sortOn,
      intrest
    } = this.props;

    const sorter = company => {
      if(sortOn === 'earnings')
        return -company.get('earningsEstimate');

      return -company.get('estimate');
    };

    const companysMerge = companys.mergeDeep(stocks)
      .filter(company => !company.getIn(['hide']))
      .filter(company => company.getIn(['historyLength']) >= minHistoryLength)
      .filter(company => !(positiveEarningsGrowth && company.getIn(['earningsLs', 1]) < 0))
      .filter(company => !(positiveRevenuGrowth && company.getIn(['revenueLs', 1]) < 0))
      .filter(company => !(positiveFreeCashFlowGrowth && company.getIn(['freeCashFlowLs', 1]) < 0))
      .filter(company => company.getIn(['earningsLs', 3]) > minCorrelation)
      .map(company => company
        .set('estimate', dividendEstimate(company, projectionTime, intrest))
        .set('earningsEstimate', earningsEstimate(company, projectionTime)))
      // .filter(company => !isNaN(company.get('estimate')))
      .toList()
      .sortBy(sorter);
      // .filter((value, index) => index < 100);

    const headers = [
      'Name',
      'Est Yield',
      'Yield',
      'P/E',
      'Avg Dividend Ratio',
      'Earnings Correlation',
      'Momentum 90'
    ];

    const table = companysMerge.map((company, key) => [
      <div>
        <a href={`https://borsdata.se/${company.get('CountryUrlName')}/nyckeltal`} target="_blank">
          <img border="0" alt="W3Schools" src={bdIcon} />
        </a>
        {company.get('Name')}
      </div>,
      <Link to={`${rootRoute}company/${company.get('ShortName')}`} >
        {Math.round(1000 * company.get('estimate')) / 10}%
      </Link>,
      Math.round(100 * company.getIn(['dividend', -1, 'yield']) / company.get('price')) + '%',
      Math.round(company.get('price') / company.getIn(['earnings', -1, 'yield'])),
      Math.round(100 * company.get('avgDividendRatio')) + '%',
      Math.round(100 * company.getIn(['earningsLs', 3])) / 100,
      Math.round(10000  * company.getIn(['stockPriceMomentum'])) + '%',
    ]);

    return (
      <div>
        <Filter/>
        <Table
          headers={headers}
          table={table}
          checkbox={false}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    stocks: state.stockReducer,
    positiveEarningsGrowth: state.filterReducer.get('positiveEarningsGrowth'),
    positiveRevenuGrowth: state.filterReducer.get('positiveRevenuGrowth'),
    positiveFreeCashFlowGrowth:  state.filterReducer.get('positiveFreeCashFlowGrowth'),
    minHistoryLength: state.filterReducer.get('minHistoryLength'),
    minCorrelation: state.filterReducer.get('minCorrelation'),
    sortOn: state.filterReducer.get('sortOn'),
    intrest: state.filterReducer.get('intrest'),
    projectionTime: state.filterReducer.get('projectionTime'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StockApp);
