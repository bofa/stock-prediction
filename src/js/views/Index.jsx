import { List, Map, fromJS } from 'immutable';
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
import importStockData from '../data';
import { intrest as investmentIntrestGroups, saftyMargin } from '../data/manualData';
import { leastSquarceEstimate, dividendEstimate, earningsEstimate, yearsToPayOff } from '../services/ls';
import { average } from '../services/statistics';
import { setModel, parseMargin } from '../services/company';

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
    intrest: PropTypes.number,
    leverageType: PropTypes.string,
  };

  state = {
    companies: new Map()
  }

  constructor() {
    super();
    importStockData().then(companys => this.setState({ companys }));
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
      intrest,
      leverageType
    } = this.props;

    const { companys } = this.state;

    if(!companys) {
      return false;
    }

    function sorter(company) {
      if(sortOn === 'earnings') {
        return -company.get('earningsEstimate');
      }

      return -company.get('estimate');
    }

    function freeCashFlowVsDividend (company) {
      return company.get('freeCashFlow').reduce((sum, cash) => sum + cash, 0)
      > 0.1*company.get('dividend').reduce((sum, cash) => sum + cash, 0);
    }

    // console.log('here', companys.toJS());

    const companysMerge = companys
      .filter(company => company.getIn(['historyLength']) >= minHistoryLength)
      .map(company => setModel(company, minHistoryLength))
      .mergeDeep(stocks)
      .filter(company => !company.getIn(['hide']))
      // .filter((c, key) => key === 'avanza')
      .toList()
      // .filter((c, i) => 4000 < i < 8000 )
      .filter(company => !(positiveEarningsGrowth && company.getIn(['earningsLs', 1]) < 0))
      .filter(company => !(positiveRevenuGrowth && company.getIn(['revenueLs', 1]) < 0))
      // .filter(company => !(positiveFreeCashFlowGrowth && company.getIn(['freeCashFlowLs', 1]) < 0))
      .filter(company => company.getIn(['earningsLs', 3]) > minCorrelation)
      // .filter(company => !positiveRevenuGrowth || freeCashFlowVsDividend(company))
      .map(company => {
        const [leverage, cost, type] = parseMargin(leverageType, company);

        return company
        .set('estimate', leverage*dividendEstimate(company, projectionTime, intrest)/company.get('price')/company.getIn(['numberOfStocks', -1]) - cost)
        .set('earningsEstimate', leverage*earningsEstimate(company, projectionTime) - cost);
      })
      .filter(company => company.get('estimate') > 0.03)
      // .filter(company => !isNaN(company.get('estimate')))
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
      <Link to={`${rootRoute}company/${company.get('CountryUrlName')}`} >
        {Math.round(1000 * company.get('estimate')) / 10}%
      </Link>,
      Math.round(100 * company.getIn(['dividend', -1]) / company.getIn(['numberOfStocks', -1]) / company.get('price')) + '%',
      Math.round(company.get('price') * company.getIn(['numberOfStocks', -1]) / company.getIn(['earnings', -1])),
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
    leverageType: state.filterReducer.get('leverage'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StockApp);
